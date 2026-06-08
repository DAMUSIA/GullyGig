"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserProfile,
  supabase,
  UserProfile,
  signOut,
} from "@/lib/supabase";
import type { UserProfile as SupabaseUserProfile } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Briefcase,
  Search,
  MapPin,
  BarChart3,
  User,
  Settings as SettingsIcon,
  Bell,
  ChevronLeft,
  Plus,
  LogOut,
} from "lucide-react";
import Image from "next/image";

// --- Types ---
type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
};

// --- Sidebar Component ---
const Sidebar: React.FC<{
  menuItems: MenuItem[];
  onSelect: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  profileName: string;
  profileEmail: string;
  onLogout: () => void;
}> = ({
  menuItems,
  onSelect,
  collapsed,
  setCollapsed,
  profileName,
  profileEmail,
  onLogout,
}) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-brand-primary-dark via-brand-primary to-brand-primary-muted text-white transition-all duration-300 z-20 shadow-2xl ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div
          className={`flex items-center h-20 px-6 border-b border-white/10 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.svg"
                  alt="ServiceHub Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">
                ServiceHub
              </span>
            </div>
          )}
          {collapsed && (
            <div className="relative w-8 h-8">
              <Image
                src="/logo.svg"
                alt="ServiceHub Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${
                    item.active
                      ? "bg-white/20 shadow-lg text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${item.active ? "text-white" : ""}`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {!collapsed && item.active && (
                  <div className="ml-auto w-1.5 h-5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="text-left max-w-[150px] overflow-hidden">
                <p className="text-xs font-medium truncate" title={profileName}>
                  {profileName}
                </p>
                <p
                  className="text-[10px] text-white/60 truncate"
                  title={profileEmail}
                >
                  {profileEmail}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-white/70 hover:bg-red-500/20 hover:text-red-200 group ${
              collapsed ? "justify-center" : ""
            }`}
            title="Log Out"
          >
            <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

// --- Main Content: Dashboard Overview (Completely Blank) ---
const DashboardOverview: React.FC = () => {
  return (
    <div className="w-full h-full">
      {/* Absolutely nothing - completely blank */}
    </div>
  );
};

// --- Placeholder Pages for Other Menu Items (All Blank) ---
const CreateService: React.FC = () => <div className="w-full h-full"></div>;

const FindServices: React.FC = () => <div className="w-full h-full"></div>;

const NearbyProviders: React.FC = () => <div className="w-full h-full"></div>;

const Analytics: React.FC = () => <div className="w-full h-full"></div>;

const Profile: React.FC = () => <div className="w-full h-full"></div>;

const SettingsPage: React.FC = () => <div className="w-full h-full"></div>;

// --- Floating Action Button ---
const FloatingActionButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Create service"
    title="Create service"
    className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-brand-primary-dark to-brand-primary text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-brand-primary/30 backdrop-blur-sm border border-white/20 z-30 group"
  >
    <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
  </button>
);

// --- Main App Component ---
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(
    null,
  );
  const [userInitials, setUserInitials] = useState<string>("AM");

  // Get initials from user name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch current user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        const userId = (user as { id?: string })?.id;
        if (!userId) {
          console.error("User ID not available");
          return;
        }

        const result = await getUserProfile(userId);
        if (result.success && result.profile) {
          setUserProfile(result.profile);
          const initials = getInitials(result.profile.full_name || "User");
          setUserInitials(initials);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle navigation with special routing for Profile
  const handleMenuSelect = (id: string) => {
    if (id === "profile") {
      router.push("/dashboard/profile");
    } else {
      setCurrentPage(id);
    }
  };

  useEffect(() => {
    async function checkAuthAndProfile() {
      try {
        const { user: authUser } = await getCurrentUser();
        if (!authUser) {
          router.push("/login");
          return;
        }

        const authUserObj = authUser as SupabaseUser;
        setUser(authUserObj);

        if (supabase) {
          // Check if profile exists in public.users
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUserObj.id)
            .maybeSingle();

          if (userProfile) {
            setProfile(userProfile as UserProfile);
          } else {
            // Profile doesn't exist (e.g. third-party login or failed insert during signup)
            // Save user details safely via the backend API using JWT
            const fullName =
              authUserObj.user_metadata?.full_name ||
              authUserObj.user_metadata?.name ||
              authUserObj.email?.split("@")[0] ||
              "User";
            const email = authUserObj.email || "";
            const phoneNo =
              authUserObj.user_metadata?.phone_no ||
              `google_${authUserObj.id.slice(0, 8)}`;

            // Get session token for authentication
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;

            if (token) {
              const response = await fetch("/api/auth/sync-profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  id: authUserObj.id,
                  fullName,
                  email,
                  phoneNo,
                }),
              });

              const result = await response.json();
              if (response.ok && result.success) {
                // Fetch the newly created profile
                const { data: newProfile } = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", authUserObj.id)
                  .maybeSingle();
                if (newProfile) {
                  setProfile(newProfile as UserProfile);
                }
              } else {
                console.error(
                  "Failed to automatically save profile in database via API:",
                  result.error || result,
                );
              }
            } else {
              console.error(
                "No active session JWT token found to sync profile.",
              );
            }
          }
        }
      } catch (err) {
        console.error("Auth and profile loading failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthAndProfile();
  }, [router]);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: currentPage === "dashboard",
    },
    {
      id: "create-service",
      label: "Create Service",
      icon: Briefcase,
      active: currentPage === "create-service",
    },
    {
      id: "find-services",
      label: "Find Services",
      icon: Search,
      active: currentPage === "find-services",
    },
    {
      id: "nearby",
      label: "Nearby Providers",
      icon: MapPin,
      active: currentPage === "nearby",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      active: currentPage === "analytics",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      active: currentPage === "profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      active: currentPage === "settings",
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />;
      case "create-service":
        return <CreateService />;
      case "find-services":
        return <FindServices />;
      case "nearby":
        return <NearbyProviders />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        router.push("/login");
      } else {
        console.error("Signout failed:", result.error);
      }
    } catch (err) {
      console.error("Logout exception:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg-light flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const pName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const pEmail = user?.email || "";
  const initials =
    pName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <div className="min-h-screen bg-brand-bg-light font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        onSelect={handleMenuSelect}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        profileName={pName}
        profileEmail={pEmail}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        {/* Top Header - Glassmorphism */}
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Left: Search Bar - Increased Length */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/50 border border-gray-200/80 focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
              />
            </div>

            {/* Right: Notifications & Avatar */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                className="p-2 rounded-xl hover:bg-white/60 transition relative"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Notifications</span>
                <span
                  className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"
                  aria-hidden="true"
                ></span>
              </button>
              <div
                className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-teal shadow-md flex items-center justify-center text-white font-medium"
                title={pName}
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Completely Blank */}
        <div className="p-8">{renderPage()}</div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setCurrentPage("create-service")} />
    </div>
  );
}
