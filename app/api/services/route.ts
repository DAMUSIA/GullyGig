import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

/**
 * GET /api/services
 * Returns the current authenticated user's payment status (is_paid) and existing service count/details.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile for payment status
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("id, is_paid, full_name, email, phone_no")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error(
        "[services API] Error fetching user profile:",
        profileError,
      );
    }

    // Fetch user's services to check count
    const { data: services, error: servicesError } = await supabaseAdmin
      .from("services")
      .select("id, title, category, is_active, created_at")
      .eq("user_id", user.id);

    if (servicesError) {
      console.error(
        "[services API] Error fetching user services:",
        servicesError,
      );
    }

    const isPaid = !!userProfile?.is_paid;
    const existingServices = services || [];

    return NextResponse.json({
      success: true,
      isPaid,
      serviceCount: existingServices.length,
      hasService: existingServices.length > 0,
      services: existingServices,
    });
  } catch (error: unknown) {
    console.error("[services API] GET error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve service information. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/services
 * Strictly enforces:
 * 1. User must be authenticated
 * 2. User must have is_paid = true
 * 3. User can create exactly 1 service
 */
export async function POST(request: NextRequest) {
  // Rate limit
  const identifier = getIdentifier(request);
  const limitResult = rateLimit("default", identifier);

  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429, headers: limitResult.headers },
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You must be logged in to create a service listing." },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Your session has expired. Please log in again." },
        { status: 401 },
      );
    }

    // 1. Verify User Payment Status
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("id, is_paid")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        {
          error:
            "User profile not found. Please ensure your profile is set up or contact support.",
        },
        { status: 404 },
      );
    }

    if (!userProfile.is_paid) {
      return NextResponse.json(
        {
          error:
            "Account activation required. Please contact support at support@gullygig.in or call 7559302315 / 8263081521 to activate your provider listing.",
          code: "PAYMENT_REQUIRED",
        },
        { status: 403 },
      );
    }

    // 2. Verify 1 Service per User Limit
    const { data: existingServices, error: checkError } = await supabaseAdmin
      .from("services")
      .select("id, title")
      .eq("user_id", user.id);

    if (checkError) {
      console.error("[services API] Check existing service error:", checkError);
      return NextResponse.json(
        { error: "Could not verify existing services. Please try again." },
        { status: 500 },
      );
    }

    if (existingServices && existingServices.length > 0) {
      return NextResponse.json(
        {
          error:
            "You already have an active service listing. Each account is strictly limited to 1 service.",
          code: "SERVICE_LIMIT_REACHED",
          existingServiceId: existingServices[0].id,
        },
        { status: 400 },
      );
    }

    // 3. Parse & Validate Payload
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid data format submitted." },
        { status: 400 },
      );
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const area = typeof body.area === "string" ? body.area.trim() : null;
    const service_modes = Array.isArray(body.service_modes)
      ? body.service_modes
      : [];
    const availability = Array.isArray(body.availability)
      ? body.availability
      : [];
    const languages =
      Array.isArray(body.languages) && body.languages.length > 0
        ? body.languages
        : ["English"];
    const contact_numbers = Array.isArray(body.contact_numbers)
      ? body.contact_numbers
          .map((n) => String(n).replace(/\D/g, ""))
          .filter((n) => n.length === 10)
      : [];
    const starting_price =
      body.starting_price !== null &&
      body.starting_price !== undefined &&
      body.starting_price !== ""
        ? parseInt(String(body.starting_price), 10)
        : null;
    const price_unit =
      starting_price && typeof body.price_unit === "string"
        ? body.price_unit
        : null;
    const latitude = typeof body.latitude === "number" ? body.latitude : null;
    const longitude =
      typeof body.longitude === "number" ? body.longitude : null;

    if (!title || title.length < 3 || title.length > 80) {
      return NextResponse.json(
        { error: "Service title must be between 3 and 80 characters." },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Please select a valid service category." },
        { status: 400 },
      );
    }

    if (contact_numbers.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one valid 10-digit contact number." },
        { status: 400 },
      );
    }

    // 4. Insert Service into DB
    const insertData = {
      user_id: user.id,
      title,
      category,
      description,
      service_modes,
      city,
      area,
      latitude,
      longitude,
      availability,
      languages,
      starting_price,
      price_unit,
      is_active: true,
      views_count: 0,
      likes_count: 0,
      reviews_count: 0,
      rating_average: 0,
      contact_numbers,
    };

    const { data: newService, error: insertError } = await supabaseAdmin
      .from("services")
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error("[services API] Insert error:", insertError);
      if (
        insertError.code === "23505" ||
        insertError.message?.includes("services_user_id_unique")
      ) {
        return NextResponse.json(
          {
            error:
              "You already have an active service listing. Each account is limited to 1 service.",
            code: "SERVICE_LIMIT_REACHED",
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          error:
            "Failed to publish service. Please check your inputs and try again.",
        },
        { status: 500 },
      );
    }

    // 5. Initialize Service Analytics
    if (newService) {
      const { error: analyticsError } = await supabaseAdmin
        .from("service_analytics")
        .insert([
          {
            service_id: newService.id,
            total_views: 0,
            unique_visitors: 0,
            total_likes: 0,
            total_contacts: 0,
            total_reviews: 0,
            average_rating: 0,
            portfolio_views: 0,
          },
        ]);

      if (analyticsError) {
        console.warn("[services API] Analytics init warning:", analyticsError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service listing published successfully!",
        service: newService,
      },
      { status: 201, headers: limitResult.headers },
    );
  } catch (error: unknown) {
    console.error("[services API] POST error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
