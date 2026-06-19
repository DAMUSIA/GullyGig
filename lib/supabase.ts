import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "mockKeyPart1.mockKeyPart2.mockKeyPart3";

export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "Supabase env missing. Dynamic operations will run in degraded/direct-fail mode.",
  );
}

// Client initialization with proper typing
const globalForSupabase = globalThis as unknown as {
  supabaseClient: SupabaseClient | null;
};
let supabaseClient: SupabaseClient | null =
  globalForSupabase.supabaseClient || null;

if (!supabaseClient) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    if (process.env.NODE_ENV !== "production") {
      globalForSupabase.supabaseClient = supabaseClient;
    }
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
}

// Types
export interface UserRegistrationData {
  fullName: string;
  phoneNo: string;
  password: string;
  email?: string;
  dob?: string;
  location?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone_no: string | null;
  dob: string | null;
  gender?: string | null;
  location: string | null;
  about: string | null;
  created_at: string;
}

export interface SignUpResponse {
  success: boolean;
  error?: string;
  rateLimited?: boolean;
  message?: string;
  warning?: string;
  user?: unknown;
  session?: unknown;
}

export interface SignInResponse {
  success: boolean;
  error?: string;
  session?: unknown;
  user?: unknown;
}

// Rate limiting storage
const signupAttempts = new Map<string, number[]>();

function checkRateLimit(email: string): { allowed: boolean; waitTime: number } {
  const now = Date.now();
  const attempts = signupAttempts.get(email) || [];
  const recentAttempts = attempts.filter((time) => now - time < 600000);

  if (recentAttempts.length >= 3) {
    const oldestAttempt = Math.min(...recentAttempts);
    const waitTime = 600000 - (now - oldestAttempt);
    return { allowed: false, waitTime: Math.ceil(waitTime / 1000) };
  }

  recentAttempts.push(now);
  signupAttempts.set(email, recentAttempts);
  return { allowed: true, waitTime: 0 };
}

// ==================== USER AUTHENTICATION ====================

export async function signUp(
  userData: UserRegistrationData,
): Promise<SignUpResponse> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return {
      success: false,
      error:
        "Supabase is not configured. Please check your environment variables.",
    };
  }

  const cleanPhone = userData.phoneNo.replace(/\D/g, "");
  const finalEmail = userData.email || `phone_${cleanPhone}@kaamao.com`;

  const rateLimit = checkRateLimit(finalEmail);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many signup attempts. Please wait ${rateLimit.waitTime} seconds before trying again.`,
      rateLimited: true,
    };
  }

  try {
    const { data: authData, error: authError } =
      await supabaseClient.auth.signUp({
        email: finalEmail,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone_no: userData.phoneNo,
          },
        },
      });

    if (authError) {
      console.error("Auth signup error:", authError);

      if (authError.message.includes("rate limit")) {
        return {
          success: false,
          error:
            "Too many signup attempts. Please wait 10 minutes before trying again.",
          rateLimited: true,
        };
      }

      if (
        authError.message.includes("User already registered") ||
        authError.message.includes("email already exists")
      ) {
        return {
          success: false,
          error:
            "This phone number or email is already registered. Please login instead.",
        };
      }

      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    const userId = authData.user.id;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { error: profileError } = await supabaseClient.from("users").upsert({
      id: userId,
      full_name: userData.fullName,
      email: null,
      phone_no: userData.phoneNo,
      dob: userData.dob || null,
      location: userData.location || null,
      about: null,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return {
        success: false,
        error:
          "Account created but profile setup failed. Please contact support.",
      };
    }

    console.log("User registered successfully:", userId);

    return {
      success: true,
      user: authData.user,
      session: authData.session,
    };
  } catch (err) {
    console.error("Signup exception:", err);
    const message = err instanceof Error ? err.message : "Signup failed";
    return { success: false, error: message };
  }
}

export async function signIn(
  credentials: UserLoginData,
): Promise<SignInResponse> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return {
      success: false,
      error:
        "Supabase is not configured. Please check your environment variables.",
    };
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error("Login error:", error);

      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      if (error.message.includes("Email not confirmed")) {
        return {
          success: false,
          error: "Please confirm your email before logging in",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (err) {
    console.error("Login exception:", err);
    const message = err instanceof Error ? err.message : "Login failed";
    return { success: false, error: message };
  }
}

// ==================== FIXED SIGNOUT ====================
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    console.log("🔄 Attempting to sign out...");

    // Step 1: Call Supabase signOut
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("❌ SignOut error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Supabase signOut successful");

    // Step 2: Clear all local storage (client-side cleanup)
    if (typeof window !== "undefined") {
      try {
        // Clear Supabase auth storage
        localStorage.removeItem("sb-auth-token");
        localStorage.removeItem("supabase.auth.token");

        // Clear all application data
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/",
            );
        });

        console.log("🗑️ Local storage and cookies cleared");
      } catch (storageError) {
        console.warn("⚠️ Storage cleanup warning:", storageError);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Signout error:", err);
    return { success: false, error: "Failed to sign out" };
  }
}

// ==================== AUTH LISTENER ====================
export function onAuthStateChange(
  callback: (event: string, session: any) => void,
) {
  if (!supabaseClient) {
    console.error("Supabase client not available for auth listener");
    return () => {};
  }

  const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("🔐 Auth state changed:", event);
    callback(event, session);
  });

  return data?.subscription?.unsubscribe || (() => {});
}

// ==================== GET CURRENT USER ====================
export async function getCurrentUser(): Promise<{
  user: unknown | null;
  session: unknown | null;
}> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return { user: null, session: null };
  }

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Get session error:", error);
      return { user: null, session: null };
    }
    return { user: data.session?.user || null, session: data.session };
  } catch (err) {
    console.error("Get current user error:", err);
    return { user: null, session: null };
  }
}

export async function getSession() {
  if (!isSupabaseConfigured || !supabaseClient) {
    return { session: null };
  }

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Get session error:", error);
      return { session: null };
    }
    return { session: data.session };
  } catch (err) {
    console.error("Get session error:", err);
    return { session: null };
  }
}

export async function getUserProfile(userId: string): Promise<{
  success: boolean;
  error?: string;
  profile: UserProfile | null;
}> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return {
      success: false,
      error: "Supabase not configured",
      profile: null,
    };
  }

  try {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Get profile error:", error);
      return { success: false, error: error.message, profile: null };
    }

    return { success: true, profile: data as UserProfile, error: undefined };
  } catch (err) {
    console.error("Get profile exception:", err);
    return {
      success: false,
      error: "Failed to fetch profile",
      profile: null,
    };
  }
}

export async function logClick(
  visitorId: string,
  projectId: string,
  clickedJoin: boolean = true,
): Promise<void> {
  if (!isSupabaseConfigured || !supabaseClient) {
    console.warn(
      `Click analytics log bypassed (unconfigured db) for: ${projectId}`,
    );
    return;
  }

  try {
    console.log("Analytics Event:", {
      visitorId,
      projectId,
      clickedJoin,
    });
  } catch (err) {
    console.error("Supabase analytics logging error:", err);
  }
}

// ==================== API-BASED SIGNUP (Bypasses Rate Limits) ====================

export async function signupWithAPI(
  userData: UserRegistrationData,
): Promise<SignUpResponse> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        phoneNo: userData.phoneNo,
        dob: userData.dob,
        location: userData.location,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message,
      };
    } else {
      return {
        success: false,
        error: result.error || "Signup failed",
      };
    }
  } catch (err) {
    console.error("Signup API error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Network error. Please try again.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ==================== EXPORTS ====================

export const supabase = supabaseClient;

export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getCurrentUser();
  return !!session;
}

export async function getUserMetadata(): Promise<unknown | null> {
  const { user } = await getCurrentUser();
  if (user && typeof user === "object" && "user_metadata" in user) {
    return (user as { user_metadata: unknown }).user_metadata;
  }
  return null;
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabaseClient
      .from("users")
      .update(profileData)
      .eq("id", userId);

    if (error) {
      console.error("Update profile error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Update profile exception:", err);
    return { success: false, error: "Failed to update profile" };
  }
}
