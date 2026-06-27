import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { rateLimit, getIdentifier } from "../../../lib/rate-limit";
import { LikeSchema, formatZodError } from "../../../lib/validation";
import { getLikeStatus, toggleLike } from "../../../lib/services/likes.service";

export async function GET(request: Request) {
  try {
    // Auth check — graceful: unauthenticated users get liked: false
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ liked: false });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin!.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ liked: false });
    }

    const url = new URL(request.url);
    const serviceId = url.searchParams.get("serviceId");
    if (!serviceId) {
      return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
    }

    const result = await getLikeStatus(user.id, serviceId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ liked: false });
  }
}

export async function POST(request: Request) {
  // Rate limiting — IP-based
  const identifier = getIdentifier(request);
  const limitResult = rateLimit("likes", identifier);

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

    const parsed = LikeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 },
      );
    }

    const { serviceId, action } = parsed.data;

    // Business logic via service layer
    const result = await toggleLike(user.id, serviceId, action);

    if (!result.success) {
      const statusCode = result.errorCode === "SERVER_ERROR" ? 500 : 400;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json(result, { headers: limitResult.headers });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
