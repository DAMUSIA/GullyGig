"use client";

import React, { useState } from "react";
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
}> = ({ menuItems, onSelect, collapsed, setCollapsed }) => {
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
        <div className="p-4 border-t border-white/10">
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="text-left">
                <p className="text-xs font-medium">Alex Morgan</p>
                <p className="text-[10px] text-white/60">Premium Pro</p>
              </div>
            )}
          </div>
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
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-brand-bg-light font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        onSelect={setCurrentPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
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
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-teal shadow-md flex items-center justify-center text-white font-medium">
                AM
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
