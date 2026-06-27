"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ExternalLink,
  Share2,
  Heart,
  Star,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Navigation,
  Inbox,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Components
import Footer from "@/components/layout/Footer";
import Icon from "@/components/Icon";

interface UserProfile {
  id: string;
  full_name: string;
  location: string | null;
  about: string | null;
  phone_no: string | null;
  social_links: Record<string, string> | null;
}

interface ServiceItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  service_modes: string[];
  availability: string[];
  languages: string[];
  starting_price: number | null;
  price_unit: string | null;
  views_count: number;
  likes_count: number;
  reviews_count: number;
  rating_average: number;
  created_at: string;
  contact_numbers: string[] | null;
  users?: UserProfile;
}

const CATEGORY_CHIPS = [
  "All",
  "Yoga",
  "Dance",
  "Guitar",
  "Gym",
  "Tuition",
  "Fitness",
  "Music",
  "Other",
];

const ITEMS_PER_PAGE = 5;

/**
 * Displays the services directory with search, filters, sorting, pagination, and live viewer presence.
 */
export default function ServicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Live viewer count via Supabase Realtime Presence
  const [liveViewers, setLiveViewers] = useState(0);

  // Auto-scroll to first service when page changes
  const isFirstRender = React.useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const element = document.getElementById("services-list");
    if (element) {
      const offset = 100; // Account for fixed header height (72px) plus spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  // Geolocation auto detect loading
  const [detectingLoc, setDetectingLoc] = useState(false);

  // Show Toast
  const showToast = (message: string) => {
    setToast(null);
    setTimeout(() => {
      setToast(message);
    }, 10);
  };

  // Toast listener
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Dark Mode detection & syncing
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const hasDarkClass = document.documentElement.classList.contains("dark");

    let activeDark = false;
    if (savedTheme === "dark") {
      activeDark = true;
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      activeDark = false;
      document.documentElement.classList.remove("dark");
    } else {
      activeDark = hasDarkClass;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(activeDark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Supabase Realtime Presence for live viewer count
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel("services-page-presence", {
      config: { presence: { key: Math.random().toString(36).slice(2) } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).reduce(
          (sum, key) => sum + state[key].length,
          0,
        );
        setLiveViewers(count);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.untrack();
      if (supabase) supabase.removeChannel(channel);
    };
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  // Fetch all active services on load
  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        const { data, error: fetchError } = await supabase
          .from("services")
          .select(
            "*, users:user_id(id, full_name, location, about, phone_no, social_links)",
          )
          .eq("is_active", true);

        if (fetchError) throw fetchError;

        if (isMounted) {
          setServices((data as ServiceItem[]) || []);
        }
      } catch (err: unknown) {
        console.error("Error fetching services:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to retrieve service listings. Please reload.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto GPT Location detection
  const handleAutoDetectLocation = async () => {
    setDetectingLoc(true);
    showToast("Detecting your location...");
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.city) {
        setLocationQuery(data.city);
        showToast(`Location set to ${data.city}`);
      } else {
        throw new Error();
      }
    } catch {
      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const geoRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                );
                if (!geoRes.ok) throw new Error();
                const geoData = await geoRes.json();
                const city =
                  geoData.address?.city ||
                  geoData.address?.town ||
                  geoData.address?.village ||
                  geoData.address?.suburb ||
                  "Mumbai";
                setLocationQuery(city);
                showToast(`Location set to ${city}`);
              } catch {
                setLocationQuery("Mumbai");
                showToast("Location set to Mumbai (default)");
              } finally {
                resolve();
              }
            },
            () => {
              showToast("Location access denied. Please type manually.");
              resolve();
            },
          );
        });
      } else {
        showToast("Geolocation not supported by browser.");
      }
    } finally {
      setDetectingLoc(false);
    }
  };

  // Utility to generate Initials for User Profile Image
  const getInitials = (name?: string) => {
    if (!name) return "SP";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper matching logic for category chips
  const matchesCategoryFilter = (category: string, filter: string) => {
    if (filter === "All") return true;
    const catLower = category.toLowerCase();
    const filtLower = filter.toLowerCase();

    if (filter === "Yoga") return catLower.includes("yoga");
    if (filter === "Dance") return catLower.includes("dance");
    if (filter === "Guitar") return catLower.includes("guitar");
    if (filter === "Gym")
      return (
        catLower.includes("gym") ||
        catLower.includes("fitness") ||
        catLower.includes("personal trainer")
      );
    if (filter === "Tuition")
      return (
        catLower.includes("tutor") ||
        catLower.includes("teacher") ||
        catLower.includes("coach") ||
        catLower.includes("academic") ||
        catLower.includes("math") ||
        catLower.includes("science") ||
        catLower.includes("english") ||
        catLower.includes("coding") ||
        catLower.includes("language") ||
        catLower.includes("exam")
      );
    if (filter === "Fitness")
      return (
        catLower.includes("fitness") ||
        catLower.includes("trainer") ||
        catLower.includes("yoga") ||
        catLower.includes("gym")
      );
    if (filter === "Music")
      return (
        catLower.includes("music") ||
        catLower.includes("guitar") ||
        catLower.includes("singing") ||
        catLower.includes("piano")
      );
    if (filter === "Other") {
      const keys = [
        "yoga",
        "dance",
        "guitar",
        "gym",
        "fitness",
        "personal trainer",
        "tutor",
        "teacher",
        "coach",
        "academic",
        "math",
        "science",
        "english",
        "coding",
        "language",
        "exam",
        "music",
        "singing",
        "piano",
      ];
      return !keys.some((k) => catLower.includes(k));
    }
    return catLower.includes(filtLower);
  };

  // Search, Filter, Sort Logic
  const filteredServices = services
    .filter((s) => {
      const text = searchQuery.toLowerCase();
      const matchText =
        s.title.toLowerCase().includes(text) ||
        s.category.toLowerCase().includes(text) ||
        s.description.toLowerCase().includes(text) ||
        (s.users?.full_name || "").toLowerCase().includes(text);

      const locText = locationQuery.toLowerCase();
      const matchLocation =
        s.city.toLowerCase().includes(locText) ||
        (s.area || "").toLowerCase().includes(locText);

      const matchCategory = matchesCategoryFilter(s.category, selectedCategory);

      return matchText && matchLocation && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "Newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sortBy === "Highest Rated") {
        return b.rating_average - a.rating_average;
      }
      if (sortBy === "Lowest Price") {
        const aVal = a.starting_price;
        const bVal = b.starting_price;
        const aNull = aVal === null || aVal === undefined;
        const bNull = bVal === null || bVal === undefined;
        if (aNull && bNull) return 0;
        if (aNull) return 1;
        if (bNull) return -1;
        return aVal - bVal;
      }
      if (sortBy === "Highest Price") {
        const aVal = a.starting_price;
        const bVal = b.starting_price;
        const aNull = aVal === null || aVal === undefined;
        const bNull = bVal === null || bVal === undefined;
        if (aNull && bNull) return 0;
        if (aNull) return 1;
        if (bNull) return -1;
        return bVal - aVal;
      }
      return 0;
    });

  // Handle Share Button click (Copy URL to Clipboard)
  const handleShare = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/p/${serviceId}`
        : `https://gullygig.in/p/${serviceId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verify this Service Portfolio on GullyGig",
          url: url,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast("Portfolio link copied to clipboard!");
      } catch {
        showToast("Failed to copy link. Please manually copy URL.");
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ITEMS_PER_PAGE),
  );
  const currentServicesList = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div
      className={`min-h-screen font-[Manrope,sans-serif] text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col ${
        isDark ? "dark" : ""
      }`}
    >
      <header className="fixed inset-x-0 top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 py-1">
        <div className="mx-auto flex h-[72px] max-w-[1140px] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center group z-50">
            {/* 
               LOGO SIZE CONFIGURATION (Mobile Responsive):
               - Mobile: h-8 w-28 (32px height, 112px width)
               - Tablet/Desktop (sm and up): h-10 w-36 (40px height, 144px width)
               You can adjust these classes (e.g. h-8, w-28, sm:h-10, sm:w-36) to fit your logo's dimensions.
            */}
            <div className="relative h-22 w-32 sm:h-22 sm:w-48 flex-shrink-0">
              <Image
                src={isDark ? "/logo_light.png" : "/logo_dark.png"}
                alt="Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-4 z-50">
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand-primary border border-slate-200/50 dark:border-slate-750/50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs active:scale-95"
              aria-label="Toggle Theme"
            >
              <Icon
                name={isDark ? "light_mode" : "dark_mode"}
                className="text-lg"
              />
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1140px] w-full mx-auto px-6 pt-28 pb-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-3">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Services & Expertise Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse verified local services, view portfolios, check average
              ratings, and contact neighbors directly.
            </p>
          </div>
          {!loading && services.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs shrink-0 self-center md:self-start">
              <div className="w-7 h-7 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-800 dark:text-white leading-none">
                  {services.length}
                </span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Services
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-md shadow-blue-500/5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="relative md:col-span-5">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search keywords, title, or provider name..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="relative md:col-span-4 flex items-center">
              <div className="relative w-full">
                <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by city or locality..."
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={detectingLoc}
                  title="Auto Detect Location"
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-primary dark:hover:text-blue-450 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {detectingLoc ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                  ) : (
                    <Navigation className="h-4 w-4 fill-brand-primary/10" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 md:col-span-3">
              <label
                htmlFor="service-sort"
                className="text-[10px] md:text-xs font-bold text-slate-450 uppercase tracking-wider shrink-0"
              >
                Sort:
              </label>
              <select
                id="service-sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="Newest">Newest Listed</option>
                <option value="Highest Rated">Highest Rated ⭐</option>
                <option value="Lowest Price">Price: Low to High</option>
                <option value="Highest Price">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mr-2">
              Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_CHIPS.map((chip) => {
                const isSelected = selectedCategory === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => {
                      setSelectedCategory(chip);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                      isSelected
                        ? "bg-brand-primary text-white border border-transparent shadow-md shadow-blue-500/15"
                        : "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                </div>
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-2.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-3">
                  <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-250 dark:border-red-900 rounded-3xl flex items-center justify-center gap-3 max-w-lg mx-auto shadow-md">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="w-full text-center py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl px-4 sm:px-6 md:px-8 max-w-4xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-blue-50/50 dark:bg-blue-950/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100/50 dark:border-blue-900/30">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">
              No Services Available
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 max-w-[384px] mx-auto mt-2 leading-relaxed">
              We couldn&apos;t find any service listings matching your queries
              or categories. Try clearing filters or resetting the search text.
            </p>
          </div>
        )}

        {/* 1-Column Service Listing (UI Improved & Height Slightly Decreased) */}
        {!loading && !error && currentServicesList.length > 0 && (
          <div
            id="services-list"
            className="flex flex-col gap-5 max-w-4xl mx-auto"
          >
            {currentServicesList.map((service) => {
              const contacts = service.contact_numbers || [];
              const phoneFallback = service.users?.phone_no;
              const directPhone = contacts[0] || phoneFallback;
              const hasContacts = contacts.length > 0 || !!phoneFallback;

              const priceLabel = service.starting_price
                ? `Starts at ₹${service.starting_price}/${(service.price_unit || "hour").toLowerCase().replace("per ", "")}`
                : "Price on Enquiry";

              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:shadow-lg dark:hover:shadow-blue-500/2 transition-all duration-300 flex flex-col justify-between gap-3.5 relative group"
                >
                  {/* Top Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Initials Avatar */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-indigo-650 dark:from-brand-primary-dark dark:to-indigo-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
                        {getInitials(service.users?.full_name)}
                      </div>

                      <div className="space-y-0.5 text-left min-w-0">
                        <span
                          className="text-[9px] font-bold text-brand-primary dark:text-blue-400 bg-brand-bg-light dark:bg-slate-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-blue-100/30 dark:border-blue-900/30 truncate max-w-[120px] inline-block align-bottom"
                          title={service.category}
                        >
                          {service.category}
                        </span>
                        <h4 className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                          Made by{" "}
                          <span
                            className="font-semibold text-slate-650 dark:text-slate-400 truncate max-w-[120px] sm:max-w-[180px] inline-block align-bottom"
                            title={
                              service.users?.full_name || "Verified Provider"
                            }
                          >
                            {service.users?.full_name || "Verified Provider"}
                          </span>
                        </h4>
                      </div>
                    </div>

                    {/* Likes & Rating Read-only Indicators */}
                    <div className="flex items-center gap-2 self-start sm:self-center bg-slate-50/80 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-850 shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {service.rating_average
                            ? Number(service.rating_average).toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">
                          ({service.reviews_count || 0})
                        </span>
                      </div>
                      <div className="h-2 w-[1px] bg-slate-200 dark:border-slate-850" />
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 fill-red-500 text-red-500 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {service.likes_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Content */}
                  <div className="space-y-3 text-left">
                    <h3
                      className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors break-words line-clamp-2"
                      title={service.title}
                    >
                      {service.title}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-650 dark:text-slate-355 leading-relaxed whitespace-pre-line bg-blue-50/10 dark:bg-slate-950/30 p-3 rounded-xl border border-blue-100/10 dark:border-blue-900/10 break-words">
                      {service.description}
                    </p>

                    {/* Horizontal badges (More compact, consistent height, padding, and spacing) */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {service.service_modes &&
                        service.service_modes.length > 0 && (
                          <div className="inline-flex items-center gap-1 h-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2 rounded-md">
                            <Icon
                              name="home"
                              className="text-[10px] text-slate-400 shrink-0"
                            />
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Modes:
                            </span>
                            <span
                              className="text-[9px] font-extrabold text-slate-750 dark:text-slate-300 truncate max-w-[80px] sm:max-w-[120px]"
                              title={service.service_modes.join(", ")}
                            >
                              {service.service_modes.join(", ")}
                            </span>
                          </div>
                        )}

                      {service.availability &&
                        service.availability.length > 0 && (
                          <div className="inline-flex items-center gap-1 h-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2 rounded-md">
                            <Icon
                              name="calendar_today"
                              className="text-[10px] text-slate-400 shrink-0"
                            />
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Availability:
                            </span>
                            <span
                              className="text-[9px] font-extrabold text-slate-750 dark:text-slate-300 truncate max-w-[80px] sm:max-w-[120px]"
                              title={service.availability.join(", ")}
                            >
                              {service.availability.join(", ")}
                            </span>
                          </div>
                        )}

                      {service.languages && service.languages.length > 0 && (
                        <div className="inline-flex items-center gap-1 h-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2 rounded-md">
                          <Icon
                            name="language"
                            className="text-[10px] text-slate-400 shrink-0"
                          />
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Languages:
                          </span>
                          <span
                            className="text-[9px] font-extrabold text-slate-750 dark:text-slate-300 truncate max-w-[80px] sm:max-w-[120px]"
                            title={service.languages.join(", ")}
                          >
                            {service.languages.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Row: Location & Price */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3 gap-2">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-xs min-w-0 flex-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-450 shrink-0" />
                      <span
                        className="truncate block"
                        title={[service.area, service.city]
                          .filter(Boolean)
                          .join(", ")}
                      >
                        {[service.area, service.city]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>

                    {/* Noticeable Price Tag */}
                    {service.starting_price ? (
                      <div className="flex items-baseline gap-1 bg-blue-50/50 dark:bg-blue-950/30 px-2.5 py-1 rounded-lg border border-blue-100/20 dark:border-blue-900/10 shrink-0">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                          Starts at
                        </span>
                        <span className="text-xs font-black text-brand-primary dark:text-blue-400">
                          ₹{service.starting_price}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">
                          /
                          {(service.price_unit || "hour")
                            .toLowerCase()
                            .replace("per ", "")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50/80 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-150/60 dark:border-slate-850 shrink-0 uppercase tracking-wider">
                        Price on Enquiry
                      </span>
                    )}
                  </div>

                  {/* Actions Row: Phone field and action buttons visually grouped (UI Improved) */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150/60 dark:border-slate-850/60 rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Left: Contact Info (always visible) */}
                    <div className="flex-1 flex flex-col items-start gap-1.5 min-w-0">
                      {hasContacts ? (
                        contacts.length > 0 ? (
                          contacts.map((num, i) => (
                            <a
                              key={i}
                              href={`tel:${num}`}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-850 dark:text-slate-205 hover:text-brand-primary dark:hover:text-blue-400 hover:underline min-w-0 max-w-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-md px-1 py-0.5"
                            >
                              <Icon
                                name="call"
                                className="text-xs text-emerald-500 shrink-0"
                                fill
                              />
                              <span className="font-mono truncate" title={num}>
                                {num}
                              </span>
                            </a>
                          ))
                        ) : (
                          <a
                            href={`tel:${phoneFallback}`}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-850 dark:text-slate-205 hover:text-brand-primary dark:hover:text-blue-400 hover:underline min-w-0 max-w-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-md px-1 py-0.5"
                          >
                            <Icon
                              name="call"
                              className="text-xs text-emerald-500 shrink-0"
                              fill
                            />
                            <span
                              className="font-mono truncate"
                              title={phoneFallback || undefined}
                            >
                              {phoneFallback}
                            </span>
                          </a>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic">
                          No direct contact numbers.
                        </span>
                      )}
                    </div>

                    {/* Right: Actions (direct Call green button, Share) */}
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      {/* Share Button */}
                      <button
                        id={`service-share-${service.id}`}
                        onClick={(e) => handleShare(e, service.id)}
                        title="Share Service Link"
                        className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>

                      {/* DIRECT GREEN CALL BUTTON */}
                      {hasContacts && directPhone && (
                        <a
                          id={`service-call-${service.id}`}
                          href={`tel:${directPhone}`}
                          title={`Call direct at ${directPhone}`}
                          className="h-8 inline-flex items-center justify-center gap-1.5 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-sm shadow-emerald-500/20 hover:shadow-md transition active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                        >
                          <Icon
                            name="call"
                            className="text-xs text-white"
                            fill
                          />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Row */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10 border-t border-slate-200/60 dark:border-slate-850 pt-6 max-w-4xl mx-auto">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-650 dark:text-slate-350 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-850 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            {/* Page indicators */}
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-650 dark:text-slate-350 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-850 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer component */}
      <Footer onShowToast={showToast} />

      {/* Toast Banner Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl text-sm font-semibold"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Viewers Badge */}
      {liveViewers > 0 && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Users className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-300">
            {liveViewers} viewing
          </span>
        </div>
      )}
    </div>
  );
}
