"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
  LogOut,
} from "lucide-react";

// Define proper types
interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  [key: string]: string | undefined;
}

interface User {
  id?: string;
  email?: string;
  user_metadata?: UserMetadata;
}

// Simple Sidebar Component
function Sidebar({ 
  collapsed, 
  setCollapsed, 
  currentPath,
  onLogout,
  profileName,
  profileEmail 
}: { 
  collapsed: boolean; 
  setCollapsed: (val: boolean) => void; 
  currentPath: string;
  onLogout: () => void;
  profileName: string;
  profileEmail: string;
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "create-service", label: "Create Service", icon: Briefcase, href: "/dashboard/create-service" },
    { id: "find-services", label: "Find Services", icon: Search, href: "/dashboard/find-service" },
    { id: "nearby", label: "Nearby Providers", icon: MapPin, href: "/dashboard/nearby-service" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { id: "profile", label: "My Profile", icon: User, href: "/dashboard/profile" },
    { id: "settings", label: "Settings", icon: SettingsIcon, href: "/dashboard/setting" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white transition-all duration-300 z-20 shadow-2xl ${
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
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Kaamao</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || currentPath?.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-white/20 shadow-lg text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="text-left overflow-hidden flex-1">
                <p className="text-xs font-medium truncate">{profileName}</p>
                <p className="text-[10px] text-white/60 truncate">{profileEmail}</p>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

// Main Layout Export
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState("User");
  const [profileEmail, setProfileEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getCurrentUser } = await import("@/lib/supabase");
        const result = await getCurrentUser();
        const user = result.user as User | null;
        
        if (!user) {
          router.push("/login");
          return;
        }
        
        const name = user.user_metadata?.full_name || 
                    (user.email ? user.email.split("@")[0] : null) || 
                    "User";
        const email = user.email || "";
        
        setProfileName(name);
        setProfileEmail(email);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { signOut } = await import("@/lib/supabase");
      const result = await signOut();
      if (result.success) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentPath={pathname || ""}
        onLogout={handleLogout}
        profileName={profileName}
        profileEmail={profileEmail}
      />

      <main
        className={`transition-all duration-300 min-h-screen ${sidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm">
          <div className="px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md sm:max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-md flex items-center justify-center text-white font-medium">
                {profileName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}