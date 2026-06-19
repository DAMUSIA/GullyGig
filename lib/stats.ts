import { supabase } from "./supabase";

export interface PlatformStats {
  users: number;
  services: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  if (!supabase) {
    console.warn("Supabase client not available");
    return {
      users: 0,
      services: 0,
    };
  }

  try {
    // Get total users from users table
    const { count: usersCount, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (usersError) {
      console.error("Error fetching users count:", usersError);
    }

    // Get services count using the admin client or RLS bypass
    // Try multiple approaches
    let servicesCount = 0;

    // Approach 1: Count all services (no filter)
    const { count: allServices, error: error1 } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true });

    if (!error1) {
      servicesCount = allServices || 0;
      console.log("Services count (all):", servicesCount);
    } else {
      console.error("Error fetching all services:", error1);

      // Approach 2: Try with is_active filter
      const { count: activeServices, error: error2 } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      if (!error2) {
        servicesCount = activeServices || 0;
        console.log("Services count (active):", servicesCount);
      } else {
        console.error("Error fetching active services:", error2);

        // Approach 3: Try using the service_analytics table as a proxy
        const { count: analyticsCount, error: error3 } = await supabase
          .from("service_analytics")
          .select("*", { count: "exact", head: true });

        if (!error3) {
          console.log("Service analytics count:", analyticsCount);
          // If analytics has data, use that as a proxy
          if (analyticsCount && analyticsCount > 0) {
            servicesCount = analyticsCount;
          }
        }
      }
    }

    return {
      users: usersCount || 0,
      services: servicesCount || 0,
    };
  } catch (error) {
    console.error("Failed to fetch platform stats:", error);
    return {
      users: 0,
      services: 0,
    };
  }
}
