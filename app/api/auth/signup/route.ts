import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { rateLimit, getIdentifier } from "../../../../lib/rate-limit";
import { SignupSchema, formatZodError } from "../../../../lib/validation";

export async function POST(request: Request) {
  // Rate limiting — strict for auth endpoints
  const identifier = getIdentifier(request);
  const limitResult = rateLimit("auth", identifier);

  if (!limitResult.success) {
    return NextResponse.json(
      {
        error: `Too many signup attempts. Please wait before trying again.`,
      },
      { status: 429, headers: limitResult.headers },
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Zod validation
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 },
      );
    }

    const { fullName, phoneNo, password, email, dob, location } = parsed.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Service unavailable. Please try again later." },
        { status: 503 },
      );
    }

    // Generate pseudo-email if none provided (Supabase requires email for auth)
    const phoneDigits = phoneNo.replace(/\D/g, "");
    const finalEmail = email || `phone_${phoneDigits}@kaamao.com`;

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: finalEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          phone_no: phoneNo,
        },
      });

    if (authError) {
      if (
        authError.message.includes("User already registered") ||
        authError.message.includes("email already exists")
      ) {
        return NextResponse.json(
          {
            error:
              "This phone number or email is already registered. Please login instead.",
          },
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

    const { error: insertError } = await supabaseAdmin.from("users").upsert({
      id: authData.user.id,
      full_name: fullName,
      email: null,
      phone_no: phoneNo,
      dob: dob || null,
      location: location || null,
      about: null,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      // Roll back the created auth user to avoid orphan accounts
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch {
        // Rollback failure is logged server-side by the platform
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
      } else if (
        insertError.message?.toLowerCase().includes("not-null") ||
        insertError.message?.toLowerCase().includes("not_null") ||
        insertError.code === "23502"
      ) {
        errorMessage = `Database constraint error: ${insertError.message}. Please run the SQL migration queries in supabase_schema.sql in your Supabase SQL Editor.`;
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Account created successfully! Please login." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 },
    );
  }
}
