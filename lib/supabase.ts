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
let supabaseClient: SupabaseClient | null = globalForSupabase.supabaseClient || null;

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
  email: string;
  phoneNo: string;
  password: string;
  dob: string;
  locationCity: string;
  neighborhood?: string;
  pincode: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_no: string;
  dob: string;
  location_city: string;
  neighborhood: string | null;
  pincode: string;
  created_at: string;
}

export interface UserSubmission {
  name: string;
  phone: string;
  gender: string;
  dob: string;
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

  const rateLimit = checkRateLimit(userData.email);
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
        email: userData.email,
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

      if (authError.message.includes("User already registered")) {
        return {
          success: false,
          error: "This email is already registered. Please login instead.",
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

    const { error: profileError } = await supabaseClient.from("users").insert({
      id: userId,
      full_name: userData.fullName,
      email: userData.email,
      phone_no: userData.phoneNo,
      dob: userData.dob,
      location_city: userData.locationCity,
      neighborhood: userData.neighborhood || null,
      pincode: userData.pincode,
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

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Signout error:", err);
    return { success: false, error: "Failed to sign out" };
  }
}

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

// ==================== WAITLIST FUNCTIONS ====================

async function ensureProjectExists(
  registrationNumber: string,
  projectName: string,
): Promise<number | null> {
  if (!isSupabaseConfigured || !supabaseClient) {
    console.warn("Supabase not configured, cannot ensure project exists");
    return null;
  }

  try {
    const { data: project } = await supabaseClient
      .from("projects")
      .select("project_id")
      .eq("registration_number", registrationNumber)
      .maybeSingle();

    if (project) {
      return project.project_id;
    }

    console.log("Project not found, creating new project...");
    const { data: newProject, error: insertError } = await supabaseClient
      .from("projects")
      .insert([
        {
          registration_number: registrationNumber,
          project_name: projectName,
          registered_people_count: 0,
        },
      ])
      .select("project_id")
      .maybeSingle();

    if (insertError) {
      console.error("Error creating project:", insertError);
      return null;
    }

    return newProject?.project_id || null;
  } catch (err) {
    console.error("Exception in ensureProjectExists:", err);
    return null;
  }
}

export async function submitWaitlist(
  data: UserSubmission,
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return {
      success: false,
      error:
        "Supabase is not configured. Please set your environment variables.",
    };
  }

  try {
    const numericProjectId = await ensureProjectExists(
      projectId,
      projectId === "damusia" ? "Damusia" : projectId,
    );

    if (!numericProjectId) {
      return {
        success: false,
        error: "Unable to create or find project.",
      };
    }

    const { data: existingUsers, error: checkError } = await supabaseClient
      .from("interested_users")
      .select("id")
      .eq("project_id", numericProjectId)
      .eq("phone_number", data.phone.trim())
      .limit(1);

    if (checkError) {
      console.error("Supabase check error:", checkError);
      return {
        success: false,
        error: "Database verification failed. Please try again.",
      };
    }

    if (existingUsers && existingUsers.length > 0) {
      return {
        success: false,
        error: "This phone number has already shown interest.",
      };
    }

    const { error: insertError } = await supabaseClient
      .from("interested_users")
      .insert([
        {
          project_id: numericProjectId,
          full_name: data.name.trim(),
          phone_number: data.phone.trim(),
          gender: data.gender,
          date_of_birth: data.dob,
        },
      ]);

    if (insertError) {
      console.error("Supabase insertion error:", insertError);
      if (insertError.code === "23505") {
        return {
          success: false,
          error: "This phone number has already shown interest.",
        };
      }
      return { success: false, error: insertError.message };
    }

    const { data: projectData } = await supabaseClient
      .from("projects")
      .select("registered_people_count")
      .eq("project_id", numericProjectId)
      .single();

    if (projectData) {
      const newCount = (projectData.registered_people_count || 0) + 1;
      await supabaseClient
        .from("projects")
        .update({ registered_people_count: newCount })
        .eq("project_id", numericProjectId);
    }

    return { success: true };
  } catch (err) {
    console.error("Supabase connection exception:", err);
    const message =
      err instanceof Error ? err.message : "Database connection failed";
    return { success: false, error: message };
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

export async function getInterestCount(projectId: string): Promise<number> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return 428;
  }

  try {
    const { data: projectData, error: projectError } = await supabaseClient
      .from("projects")
      .select("project_id, registered_people_count")
      .eq("registration_number", projectId)
      .maybeSingle();

    if (projectError || !projectData) {
      return 0;
    }

    return projectData.registered_people_count || 0;
  } catch (err) {
    console.error("Count exception:", err);
    return 0;
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
        locationCity: userData.locationCity,
        neighborhood: userData.neighborhood,
        pincode: userData.pincode,
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
    const errorMessage = err instanceof Error ? err.message : "Network error. Please try again.";
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