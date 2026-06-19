const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("=== DB DIAGNOSTICS ===");

  // 1. Fetch ratings using admin (bypass RLS)
  const { data: adminRatings, error: adminErr } = await supabaseAdmin
    .from("service_ratings")
    .select("*, users:user_id(full_name, about)");
  
  if (adminErr) {
    console.error("Admin ratings fetch error:", adminErr);
  } else {
    console.log("Admin Client ratings data:", adminRatings);
  }

  // 2. Fetch ratings using anon client (simulate frontend client)
  const { data: anonRatings, error: anonErr } = await supabaseAnon
    .from("service_ratings")
    .select("*, users:user_id(full_name, about)");

  if (anonErr) {
    console.error("Anon Client ratings fetch error:", anonErr);
  } else {
    console.log("Anon Client ratings data:", anonRatings);
  }
}

run();
