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
 * Upsert a row in service_analytics for the given service.
 * Merges only the fields provided — other fields are left untouched
 * if the row already exists.
 */
export async function upsertServiceAnalytics(
  update: AnalyticsUpdate,
): Promise<void> {
  if (!supabaseAdmin) return;

  const { serviceId, totalLikes, totalReviews, averageRating } = update;

  const { data: existingRow } = await supabaseAdmin
    .from("service_analytics")
    .select("id")
    .eq("service_id", serviceId)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existingRow) {
    const patch: Record<string, unknown> = { updated_at: now };
    if (totalLikes !== undefined) patch.total_likes = totalLikes;
    if (totalReviews !== undefined) patch.total_reviews = totalReviews;
    if (averageRating !== undefined) patch.average_rating = averageRating;

    await supabaseAdmin
      .from("service_analytics")
      .update(patch)
      .eq("service_id", serviceId);
  } else {
    await supabaseAdmin.from("service_analytics").insert({
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
  }
}
