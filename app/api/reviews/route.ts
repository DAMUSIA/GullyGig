import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { rateLimit, getIdentifier } from "../../../lib/rate-limit";
import { ReviewSchema, formatZodError } from "../../../lib/validation";
import { getReviews, postReview } from "../../../lib/services/reviews.service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const serviceId = url.searchParams.get("serviceId");

    if (!serviceId) {
      return NextResponse.json(
        { error: "Missing serviceId parameter" },
        { status: 400 },
      );
    }

    const result = await getReviews(serviceId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviews: result.reviews });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  // Rate limiting — IP-based
  const identifier = getIdentifier(request);
  const limitResult = rateLimit("reviews", identifier);

  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: limitResult.headers },
    );
  }

  try {
    // Auth
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin!.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validation
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 },
      );
    }

    const { serviceId, rating, comment } = parsed.data;

    // Business logic via service layer
    const result = await postReview(user.id, serviceId, rating, comment);

    if (!result.success) {
      const isNotFound = result.error === "Service listing not found.";
      return NextResponse.json(
        { error: result.error },
        { status: isNotFound ? 404 : 400 },
      );
    }

    return NextResponse.json(result, { headers: limitResult.headers });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
