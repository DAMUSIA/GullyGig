import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "mockKeyPart1.mockKeyPart2.mockKeyPart3";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const body = await request.json();
    const { serviceId, rating, comment } = body;

    if (!serviceId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Verify JWT token using Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("JWT verification failed:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already reviewed this service (unique constraint check)
    const { data: existingReview } = await supabaseAdmin
      .from("service_ratings")
      .select("id")
      .eq("service_id", serviceId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted a review for this tutor/service." },
        { status: 400 },
      );
    }

    // Insert new review using admin client
    const { error: insertError } = await supabaseAdmin.from("service_ratings").insert({
      service_id: serviceId,
      user_id: user.id,
      rating,
      review: comment?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Failed to insert review:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Recalculate average and count of ratings
    const { data: allRatings, error: ratingsFetchError } = await supabaseAdmin
      .from("service_ratings")
      .select("rating")
      .eq("service_id", serviceId);

    if (ratingsFetchError) throw ratingsFetchError;

    const totalReviews = allRatings ? allRatings.length : 0;
    const totalScore = allRatings ? allRatings.reduce((sum, r) => sum + r.rating, 0) : 0;
    const averageRating = totalReviews > 0 ? parseFloat((totalScore / totalReviews).toFixed(1)) : 0;

    // Update services table
    const { error: updateServiceError } = await supabaseAdmin
      .from("services")
      .update({
        rating_average: averageRating,
        reviews_count: totalReviews
      })
      .eq("id", serviceId);

    if (updateServiceError) {
      console.error("Failed to update service stats:", updateServiceError);
    }

    // Update service analytics table
    const { data: analyticsRow } = await supabaseAdmin
      .from("service_analytics")
      .select("*")
      .eq("service_id", serviceId)
      .maybeSingle();

    if (analyticsRow) {
      await supabaseAdmin
        .from("service_analytics")
        .update({
          total_reviews: totalReviews,
          average_rating: averageRating,
          updated_at: new Date().toISOString()
        })
        .eq("service_id", serviceId);
    } else {
      await supabaseAdmin
        .from("service_analytics")
        .insert({
          service_id: serviceId,
          total_reviews: totalReviews,
          average_rating: averageRating,
          updated_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
      success: true,
      message: "Review posted successfully",
      averageRating,
      totalReviews,
    });

  } catch (error: any) {
    console.error("API reviews error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
