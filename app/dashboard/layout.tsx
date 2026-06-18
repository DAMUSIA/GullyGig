"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  profileEmail,
  onCloseMobile,
  mobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  currentPath: string;
  onLogout: () => void;
  profileName: string;
  profileEmail: string;
  onCloseMobile: () => void;
  mobileOpen: boolean;
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "create-service",
      label: "Create Service",
      icon: Briefcase,
      href: "/dashboard/create-service",
    },
    {
      id: "nearby",
      label: "Nearby Providers",
      icon: MapPin,
      href: "/dashboard/nearby-service",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      href: "/dashboard/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      href: "/dashboard/setting",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-brand-primary text-white transition-all duration-300 z-30 shadow-xl w-64 md:translate-x-0 ${
        collapsed ? "md:w-20" : "md:w-64"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div
          className={`flex items-center h-20 px-6 border-b border-white/10 ${
            collapsed ? "md:justify-center" : "justify-between"
          }`}
        >
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Kaamao</span>
            </div>
          )}
          {collapsed && !mobileOpen && (
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
          )}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                onCloseMobile();
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform duration-300 ${
                collapsed ? "md:rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? currentPath === "/dashboard"
                : currentPath === item.href ||
                  currentPath?.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-white/20 shadow-lg text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  ${collapsed ? "md:justify-center" : ""}
                `}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : ""}`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`p-4 border-t border-white/10 flex items-center gap-2 ${
            collapsed ? "md:justify-center" : "justify-between"
          }`}
        >
          {/* Profile Name & Avatar on the left */}
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left overflow-hidden flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-white">
                  {profileName}
                </p>
                <p className="text-[9px] text-white/60 truncate">
                  {profileEmail}
                </p>
              </div>
            </div>
          )}

          {/* Logout on the right */}
          <button
            onClick={onLogout}
            title="Log Out"
            className="flex items-center gap-2 p-2 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all active:scale-95 flex-shrink-0"
          >
            {(!collapsed || mobileOpen) && (
              <span className="text-xs font-semibold">Log Out</span>
            )}
            <LogOut className="h-5 w-5 flex-shrink-0" />
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState("User");
  const [profileEmail, setProfileEmail] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getCurrentUser } = await import("@/lib/supabase");
        const result = await getCurrentUser();
        const user = result.user as User | null;
        const session = result.session as { access_token?: string } | null;

        if (!user) {
          router.push("/login");
          return;
        }

        const name =
          user.user_metadata?.full_name ||
          (user.email ? user.email.split("@")[0] : null) ||
          "User";
        const email = user.email || "";

        setProfileName(name);
        setProfileEmail(email);

        // Sync profile to public.users if token is available
        const token = session?.access_token;
        if (user.id && token) {
          try {
            await fetch("/api/auth/sync-profile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: user.id,
                fullName: name,
                email: email,
                phoneNo: user.user_metadata?.phone_no || "",
              }),
            });
          } catch (syncError) {
            console.error("Failed to sync profile:", syncError);
          }
        }
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
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentPath={pathname || ""}
        onLogout={() => setShowLogoutConfirm(true)}
        profileName={profileName}
        profileEmail={profileEmail}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        mobileOpen={mobileSidebarOpen}
      />

      <main
        className={`transition-all duration-300 min-h-screen ml-0 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm">
          <div className="px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
            {/* Hamburger Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition active:scale-95 flex-shrink-0"
              aria-label="Open sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {pathname !== "/dashboard/create-service" ? (
              <div className="relative flex-1 max-w-md sm:max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>
            ) : (
              <div className="flex-1" />
            )}

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

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-[90%] max-w-2xl bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl relative z-10 text-center"
            >
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-extrabold text-slate-800 mb-2">
                Log Out of Kaamao?
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Are you sure you want to log out? You will need to enter your
                email and password to access your dashboard again.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-750 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
