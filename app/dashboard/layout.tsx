"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  MapPin,
  BarChart3,
  User,
  Settings as SettingsIcon,
  Bell,
  ChevronLeft,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";
import { signOut, onAuthStateChange, getCurrentUser } from "@/lib/supabase";

// ============================================
// Types
// ============================================
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

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

// ============================================
// Constants
// ============================================
const MENU_ITEMS: MenuItem[] = [
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
    id: "portfolio",
    label: "My Portfolio",
    icon: Globe,
    href: "/dashboard/portfolio",
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

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const ANIMATION_DURATION = 0.3;

// ============================================
// Custom Hook: useMediaQuery (Fixed)
// ============================================
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
      media.addEventListener("change", listener);

      return () => {
        media.removeEventListener("change", listener);
      };
    });

    return () => cancelAnimationFrame(rafId);
  }, [query]);

  return mounted ? matches : false;
}

// ============================================
// Desktop Sidebar Component
// ============================================
function DesktopSidebar({
  collapsed,
  setCollapsed,
  currentPath,
  onLogout,
  profileName,
  profileEmail,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  currentPath: string;
  onLogout: () => void;
  profileName: string;
  profileEmail: string;
}) {
  return (
    <motion.aside
      className="hidden md:flex fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-30 shadow-2xl overflow-hidden flex-col"
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      transition={{ duration: ANIMATION_DURATION, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
    >
      {/* Logo Area */}
      <div className="flex items-center h-20 px-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="logo-expanded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center flex-shrink-0"
              >
                <div className="relative h-12 w-26 sm:h-28 sm:w-28 overflow-hidden flex-shrink-0">
                  <Image
                    src="/logo_light.png"
                    alt="Logo"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mx-auto"
              >
                <div className="relative h-12 w-12 overflow-hidden">
                  <Image
                    src="/logo_light.png"
                    alt="Logo"
                    fill
                    className="object-contain object-center"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? currentPath === "/dashboard"
              : currentPath === item.href ||
                currentPath?.startsWith(item.href + "/");

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
            >
              <Link
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-white/15 shadow-lg text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-white" : "group-hover:text-white"
                  }`}
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute right-2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile & Logout - Instant Logout */}
      <div className="p-3 border-t border-white/5 flex-shrink-0">
        <motion.div
          animate={{
            padding: collapsed ? "8px" : "12px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20 flex-shrink-0">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-white truncate">
                  {profileName}
                </p>
                <p className="text-xs text-white/40 truncate">{profileEmail}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instant Logout Button - No loading state */}
        <button
          onClick={onLogout}
          className={`w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-white/50 hover:text-red-200 hover:bg-red-500/20 ${
            collapsed ? "justify-center" : ""
          }`}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logout"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

// ============================================
// Mobile Sidebar Component
// ============================================
function MobileSidebar({
  isOpen,
  onClose,
  currentPath,
  onLogout,
  profileName,
  profileEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onLogout: () => void;
  profileName: string;
  profileEmail: string;
}) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.aside
        initial={{ x: -SIDEBAR_WIDTH }}
        animate={{ x: isOpen ? 0 : -SIDEBAR_WIDTH }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-full w-[280px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 shadow-2xl md:hidden overflow-hidden"
      >
        <div className="flex flex-col h-full w-[280px]">
          {/* Logo Area */}
          <div className="flex items-center h-20 px-4 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center flex-1">
              <div className="relative h-12 w-26 sm:h-28 sm:w-28 overflow-hidden flex-shrink-0">
                <Image
                  src="/logo_light.png"
                  alt="Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {MENU_ITEMS.map((item) => {
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
                  onClick={onClose}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-white/15 shadow-lg text-white"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-white" : "group-hover:text-white"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout - Instant Logout */}
          <div className="p-3 border-t border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20 flex-shrink-0">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {profileName}
                </p>
                <p className="text-xs text-white/40 truncate">{profileEmail}</p>
              </div>
            </div>

            {/* Instant Logout Button - No loading state */}
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-white/50 hover:text-red-200 hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// ============================================
// Main Layout
// ============================================
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

  const isMobile = useMediaQuery("(max-width: 767px)");

  // ============================================
  // Auth check with proper session validation
  // ============================================
  const checkAuth = useCallback(async () => {
    try {
      const { user, session } = await getCurrentUser();

      if (!user || !session) {
        router.replace("/login");
        return;
      }

      const typedUser = user as User;
      const name =
        typedUser?.user_metadata?.full_name ||
        typedUser?.email?.split("@")[0] ||
        "User";
      const email = typedUser?.email || "";

      setProfileName(name);
      setProfileEmail(email);
      setIsLoading(false);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // ============================================
  // Auth state listener (Fixed)
  // ============================================
  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState
    const rafId = requestAnimationFrame(() => {
      checkAuth();
    });

    const unsubscribe = onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setIsLoading(false);
        router.replace("/login");
      } else if (event === "SIGNED_IN") {
        checkAuth();
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (unsubscribe) unsubscribe();
    };
  }, [checkAuth, router]);

  // ============================================
  // ULTRA FAST: Instant Logout Handler (No delays)
  // ============================================
  const handleLogout = () => {
    // Step 1: Clear local state immediately (instant UI feedback)
    setProfileName("User");
    setProfileEmail("");
    setIsLoading(false);

    // Step 2: Navigate to login page instantly (no await, no refresh delay)
    router.push("/login");

    // Step 3: Sign out in the background (doesn't block UI)
    // Use void to explicitly ignore the promise
    void signOut().catch(() => {
      // Silent error handling - user is already redirected
    });
  };

  // Close mobile sidebar on route change (Fixed)
  useEffect(() => {
    if (isMobile) {
      const rafId = requestAnimationFrame(() => {
        setMobileSidebarOpen(false);
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [pathname, isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileSidebarOpen]);

  // Get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/create-service":
        return "Create Service";
      case "/dashboard/portfolio":
        return "My Portfolio";
      case "/dashboard/nearby-service":
        return "Nearby Providers";
      case "/dashboard/analytics":
        return "Analytics";
      case "/dashboard/profile":
        return "My Profile";
      case "/dashboard/setting":
        return "Settings";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  const contentMarginLeft = isMobile
    ? 0
    : sidebarCollapsed
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_WIDTH;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Desktop Sidebar */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentPath={pathname || ""}
        onLogout={handleLogout}
        profileName={profileName}
        profileEmail={profileEmail}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        currentPath={pathname || ""}
        onLogout={handleLogout}
        profileName={profileName}
        profileEmail={profileEmail}
      />

      {/* Main Content */}
      <motion.main
        animate={{
          marginLeft: contentMarginLeft,
        }}
        transition={{
          duration: ANIMATION_DURATION,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="min-h-screen"
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/50 text-slate-600 transition active:scale-95 flex-shrink-0 focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </motion.button>

            {/* Page Title */}
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1"
            >
              <h1 className="text-xl font-bold text-slate-800 truncate">
                {getPageTitle()}
              </h1>
            </motion.div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl hover:bg-white/50 transition focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-pulse"></span>
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 cursor-pointer"
                onClick={() => router.push("/dashboard/profile")}
              >
                {profileName.charAt(0).toUpperCase()}
              </motion.div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </motion.main>
    </div>
  );
}
