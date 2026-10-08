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
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token using service role
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Check user record by ID
    let { data: profile } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    let isPaid =
      profile?.is_paid === true ||
      String(profile?.is_paid) === "true" ||
      user.user_metadata?.is_paid === true;

    const rawPhone =
      user.user_metadata?.phone_no ||
      (user.phone ? user.phone.replace(/\D/g, "").slice(-10) : null);
    const email =
      user.email && !user.email.startsWith("phone_") ? user.email : null;

    // 2. If not found or not marked paid by ID, check by phone number
    if (!isPaid && rawPhone) {
      const cleanPhone = String(rawPhone).replace(/\D/g, "").slice(-10);
      const { data: profileByPhone } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("phone_no", cleanPhone)
        .maybeSingle();

      if (
        profileByPhone?.is_paid === true ||
        String(profileByPhone?.is_paid) === "true"
      ) {
        isPaid = true;
        profile = profileByPhone;
        // Sync ID to match current auth user
        try {
          await supabaseAdmin
            .from("users")
            .update({ id: user.id, is_paid: true })
            .eq("id", profileByPhone.id);
        } catch {
          // Non-critical if ID update is constrained
        }
      }
    }

    // 3. If still not found or not marked paid, check by email
    if (!isPaid && email) {
      const { data: profileByEmail } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (
        profileByEmail?.is_paid === true ||
        String(profileByEmail?.is_paid) === "true"
      ) {
        isPaid = true;
        profile = profileByEmail;
        try {
          await supabaseAdmin
            .from("users")
            .update({ id: user.id, is_paid: true })
            .eq("id", profileByEmail.id);
        } catch {
          // Non-critical
        }
      }
    }

    // If no profile existed at all, auto-create one
    if (!profile) {
      const newProfileData = {
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
      };

      const { data: createdProfile } = await supabaseAdmin
        .from("users")
        .upsert(newProfileData)
        .select()
        .maybeSingle();

      if (createdProfile) {
        profile = createdProfile;
      }
    } else if (isPaid && !profile.is_paid) {
      // Ensure DB row reflects true
      await supabaseAdmin
        .from("users")
        .update({ is_paid: true })
        .eq("id", user.id);
      profile.is_paid = true;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: rawPhone,
      },
      isPaid: !!isPaid,
      profile,
    });
  } catch (err: unknown) {
    console.error("[status API] Error checking user status:", err);
    return NextResponse.json(
      { error: "Failed to check user status" },
      { status: 500 },
    );
  }
}
