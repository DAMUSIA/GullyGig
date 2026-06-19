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
        { status: 400 },
      );
    }

    // 1. Increment views_count on services table
    const { data: serviceRow } = await supabaseAdmin
      .from("services")
      .select("views_count")
      .eq("id", serviceId)
      .single();

    if (serviceRow) {
      await supabaseAdmin
        .from("services")
        .update({ views_count: (serviceRow.views_count || 0) + 1 })
        .eq("id", serviceId);
    }

    // 2. Increment total_views and portfolio_views in service_analytics table
    const { data: analyticsRow, error: fetchError } = await supabaseAdmin
      .from("service_analytics")
      .select("total_views, portfolio_views")
      .eq("service_id", serviceId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching service analytics:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (analyticsRow) {
      const currentTotalViews = analyticsRow.total_views || 0;
      const currentPortViews = analyticsRow.portfolio_views || 0;
      const { error: updateError } = await supabaseAdmin
        .from("service_analytics")
        .update({
          total_views: currentTotalViews + 1,
          portfolio_views: currentPortViews + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("service_id", serviceId);

      if (updateError) {
        console.error("Error updating service analytics:", updateError);
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 },
        );
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("service_analytics")
        .insert({
          service_id: serviceId,
          total_views: 1,
          portfolio_views: 1,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Error inserting service analytics:", insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio view logged successfully",
    });
  } catch (error: unknown) {
    console.error("API portfolio view error:", error);
    const err = error as { message?: string } | null;
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
