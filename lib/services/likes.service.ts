/**
 * lib/services/likes.service.ts
 *
 * All Supabase DB operations for the likes feature.
 * API routes call these functions — they never touch the DB directly.
 */

import { supabaseAdmin } from "../supabase-admin";
import { upsertServiceAnalytics } from "./analytics.service";

export interface LikeResult {
  success: boolean;
  liked?: boolean;
  likesCount?: number;
  alreadyLiked?: boolean;
  alreadyUnliked?: boolean;
  message?: string;
  error?: string;
  errorCode?: "CLIENT_ERROR" | "SERVER_ERROR";
}

/**
 * Check whether a user has liked a specific service.
 */
export async function getLikeStatus(
  userId: string,
  serviceId: string,
): Promise<{ liked: boolean }> {
  if (!supabaseAdmin) return { liked: false };

  const { data } = await supabaseAdmin
    .from("service_likes")
    .select("id")
    .eq("service_id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();

  return { liked: !!data };
}

/**
 * Get the current likes count for a service.
 */
async function getLikesCount(serviceId: string): Promise<number> {
  if (!supabaseAdmin) return 0;

  const { count } = await supabaseAdmin
    .from("service_likes")
    .select("*", { count: "exact", head: true })
    .eq("service_id", serviceId);

  return count ?? 0;
}

/**
 * Toggles a user's like on a service listing.
 *
 * Prevents the service owner from liking their own listing and keeps the stored like count in sync after a change.
 *
 * @param userId - The user performing the action
 * @param serviceId - The service listing being updated
 * @param action - The like action to apply
 * @returns A result indicating whether the operation succeeded, the current liked state, and the updated likes count
 */
export async function toggleLike(
  userId: string,
  serviceId: string,
  action: "like" | "unlike",
): Promise<LikeResult> {
  if (!supabaseAdmin) {
    return {
      success: false,
      error: "Service unavailable",
      errorCode: "SERVER_ERROR",
    };
  }

  // Prevent self-like
  const { data: service } = await supabaseAdmin
    .from("services")
    .select("user_id")
    .eq("id", serviceId)
    .maybeSingle();

  if (service && service.user_id === userId) {
    return {
      success: false,
      error: "You cannot like your own service listing.",
      errorCode: "CLIENT_ERROR",
    };
  }

  // Check existing like
  const { data: existingLike } = await supabaseAdmin
    .from("service_likes")
    .select("id")
    .eq("service_id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();

  // Idempotent short-circuits
  if (action === "like" && existingLike) {
    const likesCount = await getLikesCount(serviceId);
    return {
      success: true,
      liked: true,
      alreadyLiked: true,
      likesCount,
      message: "You already liked this service",
    };
  }

  if (action === "unlike" && !existingLike) {
    const likesCount = await getLikesCount(serviceId);
    return {
      success: true,
      liked: false,
      alreadyUnliked: true,
      likesCount,
      message: "You haven't liked this service",
    };
  }

  // Perform action
  if (action === "like") {
    const { error: insertError } = await supabaseAdmin
      .from("service_likes")
      .insert({ service_id: serviceId, user_id: userId });

    if (insertError) {
      if (insertError.code === "23505") {
        const likesCount = await getLikesCount(serviceId);
        return {
          success: true,
          liked: true,
          alreadyLiked: true,
          likesCount,
          message: "You already liked this service",
        };
      }
      console.error(
        "Database error adding like to service_likes:",
        insertError,
      );
      return {
        success: false,
        error: "Failed to like this service. Please try again.",
        errorCode: "SERVER_ERROR",
      };
    }
  } else {
    const { error: deleteError } = await supabaseAdmin
      .from("service_likes")
      .delete()
      .eq("service_id", serviceId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error(
        "Database error removing like from service_likes:",
        deleteError,
      );
      return {
        success: false,
        error: "Failed to unlike this service. Please try again.",
        errorCode: "SERVER_ERROR",
      };
    }
  }

  const likesCount = await getLikesCount(serviceId);

  // Sync denormalized counts
  await supabaseAdmin
    .from("services")
    .update({ likes_count: likesCount, updated_at: new Date().toISOString() })
    .eq("id", serviceId);

  await upsertServiceAnalytics({ serviceId, totalLikes: likesCount });

  return { success: true, liked: action === "like", likesCount };
}
