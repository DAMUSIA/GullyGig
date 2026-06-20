import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Kaamao] Supabase admin env vars missing — server-side DB calls will fail.",
    );
  }
}

// Singleton admin client (service role — bypasses RLS)
// NEVER expose this to the browser or client-side code.
const globalForSupabaseAdmin = globalThis as unknown as {
  supabaseAdmin: SupabaseClient | null;
};

let supabaseAdminClient: SupabaseClient | null =
  globalForSupabaseAdmin.supabaseAdmin || null;

if (!supabaseAdminClient && supabaseUrl && supabaseServiceKey) {
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Cache in dev to prevent hot-reload from creating new connections
  if (process.env.NODE_ENV !== "production") {
    globalForSupabaseAdmin.supabaseAdmin = supabaseAdminClient;
  }
}

export const supabaseAdmin = supabaseAdminClient;
