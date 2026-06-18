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
    const body = await request.json();
    const { serviceId } = body;

    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId is required" },
        { status: 400 }
      );
    }

    // Check if the analytics record exists
    const { data: analyticsRow, error: fetchError } = await supabaseAdmin
      .from("service_analytics")
      .select("portfolio_views")
      .eq("service_id", serviceId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching service analytics:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (analyticsRow) {
      const currentViews = analyticsRow.portfolio_views || 0;
      const { error: updateError } = await supabaseAdmin
        .from("service_analytics")
        .update({
          portfolio_views: currentViews + 1,
          updated_at: new Date().toISOString()
        })
        .eq("service_id", serviceId);

      if (updateError) {
        console.error("Error updating service analytics:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("service_analytics")
        .insert({
          service_id: serviceId,
          portfolio_views: 1,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error inserting service analytics:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio view logged successfully"
    });
  } catch (error: any) {
    console.error("API portfolio view error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
