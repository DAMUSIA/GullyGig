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
    let { data: userProfile } = await supabaseAdmin
      .from("users")
      .select("id, is_paid, phone_no, email")
      .eq("id", user.id)
      .maybeSingle();

    let isPaid =
      userProfile?.is_paid === true ||
      String(userProfile?.is_paid) === "true" ||
      user.user_metadata?.is_paid === true;

    const rawPhone =
      user.user_metadata?.phone_no ||
      (user.phone ? user.phone.replace(/\D/g, "").slice(-10) : null);
    const email =
      user.email && !user.email.startsWith("phone_") ? user.email : null;

    if (!isPaid && rawPhone) {
      const cleanPhone = String(rawPhone).replace(/\D/g, "").slice(-10);
      const { data: profileByPhone } = await supabaseAdmin
        .from("users")
        .select("id, is_paid")
        .eq("phone_no", cleanPhone)
        .maybeSingle();

      if (
        profileByPhone?.is_paid === true ||
        String(profileByPhone?.is_paid) === "true"
      ) {
        isPaid = true;
      }
    }

    if (!isPaid && email) {
      const { data: profileByEmail } = await supabaseAdmin
        .from("users")
        .select("id, is_paid")
        .eq("email", email)
        .maybeSingle();

      if (
        profileByEmail?.is_paid === true ||
        String(profileByEmail?.is_paid) === "true"
      ) {
        isPaid = true;
      }
    }

    // Ensure user row exists in public.users
    if (!userProfile) {
      const { data: createdProfile } = await supabaseAdmin
        .from("users")
        .upsert({
          id: user.id,
          full_name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "Service Provider",
          email: email,
          phone_no: rawPhone
            ? String(rawPhone).replace(/\D/g, "").slice(-10)
            : null,
          is_paid: isPaid,
          created_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle();

      userProfile = createdProfile;
    } else if (isPaid && !userProfile.is_paid) {
      await supabaseAdmin
        .from("users")
        .update({ is_paid: true })
        .eq("id", user.id);
      userProfile.is_paid = true;
    }

    if (!isPaid) {
      return NextResponse.json(
        {
          error:
            "Account activation required. Please contact support at support@gullygig.in or call/WhatsApp 88795 14626 / 755 930 2315 / 82630 81521 to activate your provider listing.",
          code: "PAYMENT_REQUIRED",
        },
        { status: 403 },
      );
    }

    // 2. Strict Limit Check: Maximum 1 service listing allowed per account
    const { data: existingUserServices, error: checkServicesError } =
      await supabaseAdmin
        .from("services")
        .select("id, title")
        .eq("user_id", user.id);

    if (checkServicesError) {
      console.error(
        "[services API] Error checking user services:",
        checkServicesError,
      );
    }

    if (existingUserServices && existingUserServices.length >= 1) {
      return NextResponse.json(
        {
          error:
            "Maximum 1 service allowed: Each account is permitted to create only 1 service listing. You already have an active service ('" +
            (existingUserServices[0].title || "My Service") +
            "'). Please edit your existing service from your dashboard or call support at 88795 14626 / 755 930 2315 / 82630 81521.",
          code: "SERVICE_LIMIT_REACHED",
          existingServiceId: existingUserServices[0].id,
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
    let description =
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
      typeof body.price_unit === "string" && body.price_unit.trim()
        ? body.price_unit.trim()
        : null;
    const pricing_note =
      typeof body.pricing_note === "string" ? body.pricing_note.trim() : "";
    const pricing_tiers = Array.isArray(body.pricing_tiers)
      ? body.pricing_tiers
      : [];
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const custom_availability =
      typeof body.custom_availability === "string"
        ? body.custom_availability.trim()
        : "";
    const intro_video_url =
      typeof body.intro_video_url === "string"
        ? body.intro_video_url.trim()
        : "";
    const social_links =
      typeof body.social_links === "object" && body.social_links !== null
        ? (body.social_links as Record<string, unknown>)
        : {};
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

    // Merge custom availability into availability list if provided
    const finalAvailability = [...availability];
    if (
      custom_availability &&
      !finalAvailability.includes(custom_availability)
    ) {
      finalAvailability.push(custom_availability);
    }

    // Append pricing plans & tiers to description if present
    if (pricing_tiers.length > 0) {
      const tiersFormatted = pricing_tiers
        .filter(
          (t: { label?: string; price?: string | number; unit?: string }) =>
            t.label || t.price,
        )
        .map(
          (t: { label?: string; price?: string | number; unit?: string }) =>
            `• ${t.label || "Plan"}: ₹${t.price || 0} / ${t.unit || "month"}`,
        )
        .join("\n");

      if (tiersFormatted && !description.includes(tiersFormatted)) {
        description = description
          ? `${description}\n\nPricing Plans & Fee Tiers:\n${tiersFormatted}`
          : `Pricing Plans & Fee Tiers:\n${tiersFormatted}`;
      }
    }

    // Append pricing note to description if present and not already contained
    if (pricing_note && !description.includes(pricing_note)) {
      description = description
        ? `${description}\n\nFee Details / Pricing Note: ${pricing_note}`
        : `Fee Details / Pricing Note: ${pricing_note}`;
    }

    // Append custom address / landmark to description if present
    if (address && !description.includes(address)) {
      description = description
        ? `${description}\n\nAddress & Location: ${address}`
        : `Address & Location: ${address}`;
    }

    // Append custom timings to description if present
    if (custom_availability && !description.includes(custom_availability)) {
      description = description
        ? `${description}\n\nSchedule & Availability: ${custom_availability}`
        : `Schedule & Availability: ${custom_availability}`;
    }

    // 3. Sync User Profile Social Links & Intro Video if provided
    try {
      const { data: userCurrent } = await supabaseAdmin
        .from("users")
        .select("social_links")
        .eq("id", user.id)
        .single();

      const existingSocials =
        (userCurrent?.social_links as Record<string, string>) || {};
      const updatedSocials = {
        ...existingSocials,
        ...social_links,
      };

      if (intro_video_url) {
        updatedSocials.intro_video_url = intro_video_url;
      }

      await supabaseAdmin
        .from("users")
        .update({ social_links: updatedSocials })
        .eq("id", user.id);
    } catch (socialErr) {
      console.warn("[services API] User social links sync warning:", socialErr);
    }

    // 4. Insert Service into DB
    const insertData = {
      user_id: user.id,
      title,
      category,
      description,
      service_modes,
      city,
      area: address ? (area ? `${area} - ${address}` : address) : area,
      latitude,
      longitude,
      availability: finalAvailability,
      languages,
      starting_price,
      price_unit: price_unit || "Custom / Flexible",
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
              "A service listing already exists for this account on the database. Please edit your existing service or contact support at 88795 14626 / 755 930 2315 / 82630 81521.",
            code: "SERVICE_LIMIT_REACHED",
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          error:
            "Failed to publish service. Please check your inputs and try again, or contact support at 88795 14626 / 755 930 2315 / 82630 81521.",
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
      {
        error:
          "An unexpected error occurred. Please try again or call support at 88795 14626 / 755 930 2315 / 82630 81521.",
      },
      { status: 500 },
    );
  }
}
