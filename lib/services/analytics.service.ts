/**
 * lib/services/analytics.service.ts
 *
 * Shared service for updating service_analytics.
 * Previously this logic was copy-pasted verbatim in both
 * the likes and reviews API routes. Centralized here.
 */

import { supabaseAdmin } from "../supabase-admin";

export interface AnalyticsUpdate {
  serviceId: string;
  totalLikes?: number;
  totalReviews?: number;
  averageRating?: number;
}

/**
 * Updates or creates analytics totals for a service.
 *
 * @param update - The analytics values to store for the service.
 */
export async function upsertServiceAnalytics(
  update: AnalyticsUpdate,
): Promise<void> {
  if (!supabaseAdmin) return;

  const { serviceId, totalLikes, totalReviews, averageRating } = update;

  const { data: existingRow, error: lookupError } = await supabaseAdmin
    .from("service_analytics")
    .select("service_id")
    .eq("service_id", serviceId)
    .maybeSingle();

  if (lookupError) {
    console.error("Analytics lookup error:", lookupError);
    throw new Error("Failed to lookup analytics record");
  }

  const now = new Date().toISOString();

  if (existingRow) {
    const patch: Record<string, unknown> = { updated_at: now };
    if (totalLikes !== undefined) patch.total_likes = totalLikes;
    if (totalReviews !== undefined) patch.total_reviews = totalReviews;
    if (averageRating !== undefined) patch.average_rating = averageRating;

    const { error: updateError } = await supabaseAdmin
      .from("service_analytics")
      .update(patch)
      .eq("service_id", serviceId);

    if (updateError) {
      console.error("Analytics update error:", updateError);
      throw new Error("Failed to update analytics record");
    }
  } else {
    const { error: insertError } = await supabaseAdmin
      .from("service_analytics")
      .insert({
        service_id: serviceId,
        total_likes: totalLikes ?? 0,
        total_views: 0,
        unique_visitors: 0,
        total_contacts: 0,
        total_reviews: totalReviews ?? 0,
        average_rating: averageRating ?? 0,
        portfolio_views: 0,
        updated_at: now,
      });

    if (insertError) {
      console.error("Analytics insert error:", insertError);
      throw new Error("Failed to insert analytics record");
    }
  }
}
