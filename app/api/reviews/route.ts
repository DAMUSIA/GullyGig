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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const serviceId = url.searchParams.get("serviceId");
    
    if (!serviceId) {
      return NextResponse.json({ error: "Missing serviceId parameter" }, { status: 400 });
    }

    // Fetch the service to get its owner's user_id
    const { data: service } = await supabaseAdmin
      .from("services")
      .select("user_id")
      .eq("id", serviceId)
      .maybeSingle();

    const serviceOwnerId = service?.user_id || null;

    const { data: reviews, error } = await supabaseAdmin
      .from("service_ratings")
      .select("*, users:user_id(full_name, about)")
      .eq("service_id", serviceId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load reviews:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out any self-reviews (where reviewer === service owner)
    const filteredReviews = serviceOwnerId
      ? (reviews || []).filter((r) => r.user_id !== serviceOwnerId)
      : (reviews || []);

    return NextResponse.json({ success: true, reviews: filteredReviews });
  } catch (error: unknown) {
    const err = error as { message?: string } | null;
    console.error("API get reviews error:", error);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

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

    // Check if the user is the owner of the service listing
    const { data: service, error: serviceError } = await supabaseAdmin
      .from("services")
      .select("user_id")
      .eq("id", serviceId)
      .maybeSingle();

    if (serviceError || !service) {
      return NextResponse.json({ error: "Service listing not found." }, { status: 404 });
    }

    if (service.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot review your own service listing." },
        { status: 400 }
      );
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

  } catch (error: unknown) {
    console.error("API reviews error:", error);
    const err = error as { message?: string } | null;
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
