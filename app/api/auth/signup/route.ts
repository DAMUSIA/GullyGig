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
    const {
      email,
      password,
      fullName,
      phoneNo,
      dob,
      locationCity,
      neighborhood,
      pincode,
    } = body;

    if (
      !email ||
      !password ||
      !fullName ||
      !phoneNo ||
      !dob ||
      !locationCity ||
      !pincode
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNo.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          phone_no: phoneNo,
        },
      });

    if (authError) {
      console.error("Auth error:", authError);

      if (authError.message.includes("User already registered")) {
        return NextResponse.json(
          { error: "This email is already registered. Please login instead." },
          { status: 400 },
        );
      }

      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 },
      );
    }

    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      full_name: fullName,
      email: email,
      phone_no: phoneNo,
      dob: dob,
      location_city: locationCity,
      neighborhood: neighborhood || null,
      pincode: pincode,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Insert error:", insertError);

      // Clean up the created auth user to avoid orphan accounts without database profiles
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error(
          "Cleanup error after failed profile insert:",
          cleanupError,
        );
      }

      let errorMessage = "Failed to setup user profile. Please try again.";
      if (
        insertError.message?.toLowerCase().includes("unique constraint") ||
        insertError.code === "23505"
      ) {
        if (
          insertError.message?.toLowerCase().includes("phone_no") ||
          insertError.details?.includes("phone_no")
        ) {
          errorMessage =
            "This phone number is already registered. Please use a different one.";
        } else if (
          insertError.message?.toLowerCase().includes("email") ||
          insertError.details?.includes("email")
        ) {
          errorMessage =
            "This email is already registered. Please login instead.";
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    console.log("User created successfully:", authData.user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Please login.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 },
    );
  }
}
