/**
 * lib/services/reviews.service.ts
 *
 * All Supabase DB operations for the reviews feature.
 * API routes call these functions — they never touch the DB directly.
 */

import { supabaseAdmin } from "../supabase-admin";
import { upsertServiceAnalytics } from "./analytics.service";

export interface ReviewRow {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
  users?: { full_name: string; about: string | null } | null;
}

export interface ReviewsResult {
  success: boolean;
  reviews?: ReviewRow[];
  error?: string;
}

export interface PostReviewResult {
  success: boolean;
  message?: string;
  averageRating?: number;
  totalReviews?: number;
  error?: string;
  errorCode?: "NOT_FOUND" | "CLIENT_ERROR" | "SERVER_ERROR";
}

/**
 * Fetch all reviews for a service, filtering out self-reviews.
 */
export async function getReviews(serviceId: string): Promise<ReviewsResult> {
  if (!supabaseAdmin) {
    return { success: false, error: "Service unavailable" };
  }

  const { data: service } = await supabaseAdmin
    .from("services")
    .select("user_id")
    .eq("id", serviceId)
    .maybeSingle();

  const serviceOwnerId = service?.user_id ?? null;

  const { data: reviews, error } = await supabaseAdmin
    .from("service_ratings")
    .select("*, users:user_id(full_name, about)")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const filtered = serviceOwnerId
    ? (reviews ?? []).filter((r) => r.user_id !== serviceOwnerId)
    : (reviews ?? []);

  return { success: true, reviews: filtered as ReviewRow[] };
}

/**
 * Submits a review for a service and updates its rating stats.
 *
 * @param userId - The reviewer
 * @param serviceId - The service being reviewed
 * @param rating - The rating to store
 * @param comment - The optional review text
 * @returns A result indicating whether the review was posted successfully, along with the updated average rating and total review count on success
 */
export async function postReview(
  userId: string,
  serviceId: string,
  rating: number,
  comment?: string | null,
): Promise<PostReviewResult> {
  if (!supabaseAdmin) {
    return { success: false, error: "Service unavailable" };
  }

  // Check service exists and user is not owner
  const { data: service, error: serviceError } = await supabaseAdmin
    .from("services")
    .select("user_id")
    .eq("id", serviceId)
    .maybeSingle();

  if (serviceError) {
    console.error("Database error checking service existence:", serviceError);
    return {
      success: false,
      error: "Failed to submit review. Please try again later.",
      errorCode: "SERVER_ERROR",
    };
  }

  if (!service) {
    return {
      success: false,
      error: "Service listing not found.",
      errorCode: "NOT_FOUND",
    };
  }

  if (service.user_id === userId) {
    return {
      success: false,
      error: "You cannot review your own service listing.",
      errorCode: "CLIENT_ERROR",
    };
  }

  // Check for duplicate review
  const { data: existingReview } = await supabaseAdmin
    .from("service_ratings")
    .select("id")
    .eq("service_id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingReview) {
    return {
      success: false,
      error: "You have already submitted a review for this tutor/service.",
      errorCode: "CLIENT_ERROR",
    };
  }

  // Insert review
  const now = new Date().toISOString();
  const { error: insertError } = await supabaseAdmin
    .from("service_ratings")
    .insert({
      service_id: serviceId,
      user_id: userId,
      rating,
      review: comment?.trim() ?? null,
      created_at: now,
      updated_at: now,
    });

  if (insertError) {
    return {
      success: false,
      error: insertError.message,
      errorCode: "SERVER_ERROR",
    };
  }

  // Recalculate stats
  const { data: allRatings, error: ratingsFetchError } = await supabaseAdmin
    .from("service_ratings")
    .select("rating")
    .eq("service_id", serviceId);

  if (ratingsFetchError) {
    return {
      success: false,
      error: ratingsFetchError.message,
      errorCode: "SERVER_ERROR",
    };
  }

  const totalReviews = allRatings?.length ?? 0;
  const totalScore = allRatings?.reduce((sum, r) => sum + r.rating, 0) ?? 0;
  const averageRating =
    totalReviews > 0 ? parseFloat((totalScore / totalReviews).toFixed(1)) : 0;

  // Sync denormalized counts
  await supabaseAdmin
    .from("services")
    .update({ rating_average: averageRating, reviews_count: totalReviews })
    .eq("id", serviceId);

  await upsertServiceAnalytics({ serviceId, totalReviews, averageRating });

  return {
    success: true,
    message: "Review posted successfully",
    averageRating,
    totalReviews,
  };
}
