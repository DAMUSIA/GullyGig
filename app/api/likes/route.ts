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

// Track in-flight requests to prevent duplicates
const pendingRequests = new Map<string, Promise<any>>();

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ liked: false });
    }
    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ liked: false });
    }

    const url = new URL(request.url);
    const serviceId = url.searchParams.get("serviceId");
    if (!serviceId) {
      return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
    }

    const { data } = await supabaseAdmin
      .from("service_likes")
      .select("id")
      .eq("service_id", serviceId)
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({ liked: !!data });
  } catch {
    return NextResponse.json({ liked: false });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, action } = body;
    
    if (!serviceId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Validate action
    if (action !== "like" && action !== "unlike") {
      return NextResponse.json({ error: "Invalid action. Use 'like' or 'unlike'" }, { status: 400 });
    }

    // Create a unique key for this request
    const requestKey = `${user.id}-${serviceId}-${action}`;
    
    // Check if there's already a pending request for this user+service
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    // Create the promise for this request
    const requestPromise = handleLikeAction(user.id, serviceId, action);
    pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      pendingRequests.delete(requestKey);
    }
  } catch (error: unknown) {
    console.error("Likes API error:", error);
    const err = error as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

async function handleLikeAction(userId: string, serviceId: string, action: string) {
  // Check if user already liked this service
  const { data: existingLike, error: checkError } = await supabaseAdmin
    .from("service_likes")
    .select("id")
    .eq("service_id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();

  // If trying to like but already liked
  if (action === "like" && existingLike) {
    const { count } = await supabaseAdmin
      .from("service_likes")
      .select("*", { count: "exact", head: true })
      .eq("service_id", serviceId);
    
    return NextResponse.json({ 
      success: true, 
      liked: true,
      alreadyLiked: true,
      likesCount: count || 0,
      message: "You already liked this service" 
    });
  }

  // If trying to unlike but not liked
  if (action === "unlike" && !existingLike) {
    const { count } = await supabaseAdmin
      .from("service_likes")
      .select("*", { count: "exact", head: true })
      .eq("service_id", serviceId);
    
    return NextResponse.json({ 
      success: true, 
      liked: false,
      alreadyUnliked: true,
      likesCount: count || 0,
      message: "You haven't liked this service" 
    });
  }

  // Perform the action
  if (action === "like") {
    const { error: insertError } = await supabaseAdmin
      .from("service_likes")
      .insert({ 
        service_id: serviceId, 
        user_id: userId 
      });

    if (insertError) {
      // Check for unique constraint violation (Postgres error code 23505)
      if (insertError.code === "23505") {
        const { count } = await supabaseAdmin
          .from("service_likes")
          .select("*", { count: "exact", head: true })
          .eq("service_id", serviceId);
        
        return NextResponse.json({ 
          success: true, 
          liked: true,
          alreadyLiked: true,
          likesCount: count || 0,
          message: "You already liked this service" 
        });
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  } else {
    // Unlike - delete the like
    const { error: deleteError } = await supabaseAdmin
      .from("service_likes")
      .delete()
      .eq("service_id", serviceId)
      .eq("user_id", userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  // Get current exact count
  const { count } = await supabaseAdmin
    .from("service_likes")
    .select("*", { count: "exact", head: true })
    .eq("service_id", serviceId);

  const totalLikes = count || 0;

  // Update services table
  await supabaseAdmin
    .from("services")
    .update({ 
      likes_count: totalLikes,
      updated_at: new Date().toISOString()
    })
    .eq("id", serviceId);

  // Update service_analytics table
  const { data: analyticsRow } = await supabaseAdmin
    .from("service_analytics")
    .select("*")
    .eq("service_id", serviceId)
    .maybeSingle();

  if (analyticsRow) {
    await supabaseAdmin
      .from("service_analytics")
      .update({
        total_likes: totalLikes,
        updated_at: new Date().toISOString()
      })
      .eq("service_id", serviceId);
  } else {
    await supabaseAdmin
      .from("service_analytics")
      .insert({
        service_id: serviceId,
        total_likes: totalLikes,
        total_views: 0,
        unique_visitors: 0,
        total_contacts: 0,
        total_reviews: 0,
        average_rating: 0,
        portfolio_views: 0,
        updated_at: new Date().toISOString()
      });
  }

  return NextResponse.json({ 
    success: true, 
    liked: action === "like",
    likesCount: totalLikes 
  });
}