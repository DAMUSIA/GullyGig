import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * DELETE /api/services/delete
 * Deletes a service and all its associated data (likes, ratings, analytics).
 * Uses the service_role key to bypass RLS.
 * Validates that the requesting user owns the service before deleting.
 */
export async function DELETE(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }

  // Create a regular client to verify the user's session
  const supabaseAnon = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Get auth token from the Authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  // Verify the user session
  const {
    data: { user },
    error: authError,
  } = await supabaseAnon.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 },
    );
  }

  // Get the serviceId from the request body
  let serviceId: string;
  try {
    const body = await request.json();
    serviceId = body.serviceId;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!serviceId || typeof serviceId !== "string") {
    return NextResponse.json(
      { error: "serviceId is required." },
      { status: 400 },
    );
  }

  // Create the admin client (bypasses RLS)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify the requesting user actually owns this service
  const { data: service, error: fetchError } = await supabaseAdmin
    .from("services")
    .select("id, user_id")
    .eq("id", serviceId)
    .single();

  if (fetchError || !service) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  if (service.user_id !== user.id) {
    return NextResponse.json(
      { error: "Forbidden. You do not own this service." },
      { status: 403 },
    );
  }

  // Explicitly delete related records first to avoid foreign key constraint violations
  // (ON DELETE CASCADE may be blocked by RLS on some tables even with service_role)

  // 1. Delete service analytics
  const { error: analyticsErr } = await supabaseAdmin
    .from("service_analytics")
    .delete()
    .eq("service_id", serviceId);

  if (analyticsErr) {
    console.error("[delete-service] Failed to delete analytics:", analyticsErr);
    return NextResponse.json(
      { error: "Failed to delete service analytics. Please try again." },
      { status: 500 },
    );
  }

  // 2. Delete service likes
  const { error: likesErr } = await supabaseAdmin
    .from("service_likes")
    .delete()
    .eq("service_id", serviceId);

  if (likesErr) {
    console.error("[delete-service] Failed to delete likes:", likesErr);
    return NextResponse.json(
      { error: "Failed to delete service likes. Please try again." },
      { status: 500 },
    );
  }

  // 3. Delete service ratings
  const { error: ratingsErr } = await supabaseAdmin
    .from("service_ratings")
    .delete()
    .eq("service_id", serviceId);

  if (ratingsErr) {
    console.error("[delete-service] Failed to delete ratings:", ratingsErr);
    return NextResponse.json(
      { error: "Failed to delete service ratings. Please try again." },
      { status: 500 },
    );
  }

  // 4. Now delete the service itself
  const { error: deleteError } = await supabaseAdmin
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (deleteError) {
    console.error("[delete-service] Delete failed:", deleteError);
    return NextResponse.json(
      { error: deleteError.message || "Failed to delete service." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, message: "Service deleted successfully." },
    { status: 200 },
  );
}
