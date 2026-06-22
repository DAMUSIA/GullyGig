"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
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

  // Expanded contacts states
  const [revealedContacts, setRevealedContacts] = useState<
    Record<string, boolean>
  >({});

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
    const isDarkTheme = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(isDarkTheme);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
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
        : `https://kaamao.com/p/${serviceId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verify this Service Portfolio on Kaamao",
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

  // Toggle Contact reveal
  const handleToggleContact = (serviceId: string) => {
    setRevealedContacts((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
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
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20 transition-colors">
              <Icon name="check" fill className="text-xl text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-primary transition-colors">
              Kaamao
            </span>
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
        <div className="text-center md:text-left mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Services & Expertise Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse verified local services, view portfolios, check average
            ratings, and contact neighbors directly.
          </p>
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
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-blue-50/50 dark:bg-blue-950/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100/50 dark:border-blue-900/30">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">
              No Services Available
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
              We couldn&apos;t find any service listings matching your queries
              or categories. Try clearing filters or resetting the search text.
            </p>
          </div>
        )}

        {/* 1-Column Service Listing (UI Improved & Height Slightly Decreased) */}
        {!loading && !error && currentServicesList.length > 0 && (
          <div className="flex flex-col gap-5 max-w-4xl mx-auto">
            {currentServicesList.map((service) => {
              const contacts = service.contact_numbers || [];
              const phoneFallback = service.users?.phone_no;
              const directPhone = contacts[0] || phoneFallback;
              const hasContacts = contacts.length > 0 || !!phoneFallback;
              const isRevealed = !!revealedContacts[service.id];

              const priceLabel = service.starting_price
                ? `Starts at ₹${service.starting_price}/${(service.price_unit || "hour").toLowerCase().replace("per ", "")}`
                : "Price on Enquiry";

              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 md:p-6 hover:shadow-lg dark:hover:shadow-blue-500/2 transition-all duration-300 flex flex-col justify-between gap-4 relative group"
                >
                  {/* Top Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {/* Initials Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-650 dark:from-brand-primary-dark dark:to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
                        {getInitials(service.users?.full_name)}
                      </div>

                      <div className="space-y-0.5 text-left">
                        <span className="text-[9px] font-extrabold text-brand-primary dark:text-blue-400 bg-brand-bg-light dark:bg-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-100/30 dark:border-blue-900/30">
                          {service.category}
                        </span>
                        <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                          Made by{" "}
                          <span className="font-extrabold text-slate-700 dark:text-slate-350">
                            {service.users?.full_name || "Verified Provider"}
                          </span>
                        </h4>
                      </div>
                    </div>

                    {/* Likes & Rating Read-only Indicators */}
                    <div className="flex items-center gap-2.5 self-start sm:self-center bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {service.rating_average
                            ? Number(service.rating_average).toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">
                          ({service.reviews_count || 0})
                        </span>
                      </div>
                      <div className="h-2.5 w-[1px] bg-slate-200 dark:bg-slate-850" />
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {service.likes_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Content */}
                  <div className="space-y-3.5 text-left">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-650 dark:text-slate-355 leading-relaxed whitespace-pre-line bg-blue-50/10 dark:bg-slate-950/30 p-3.5 rounded-xl border border-blue-100/10 dark:border-blue-900/10">
                      {service.description}
                    </p>

                    {/* Horizontal badges (More compact) */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {service.service_modes &&
                        service.service_modes.length > 0 && (
                          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2.5 py-1 rounded-lg">
                            <Icon
                              name="home"
                              className="text-[10px] text-slate-400"
                            />
                            <span className="text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase">
                              Modes:
                            </span>
                            <span className="text-[9px] font-extrabold text-slate-750 dark:text-slate-300">
                              {service.service_modes.join(", ")}
                            </span>
                          </div>
                        )}

                      {service.availability &&
                        service.availability.length > 0 && (
                          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2.5 py-1 rounded-lg">
                            <Icon
                              name="calendar_today"
                              className="text-[10px] text-slate-400"
                            />
                            <span className="text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase">
                              Availability:
                            </span>
                            <span className="text-[9px] font-extrabold text-slate-750 dark:text-slate-300">
                              {service.availability.join(", ")}
                            </span>
                          </div>
                        )}

                      {service.languages && service.languages.length > 0 && (
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-2.5 py-1 rounded-lg">
                          <Icon
                            name="language"
                            className="text-[10px] text-slate-400"
                          />
                          <span className="text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase">
                            Languages:
                          </span>
                          <span className="text-[9px] font-extrabold text-slate-750 dark:text-slate-300">
                            {service.languages.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Row: Location & Price */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-xs max-w-[60%]">
                      <MapPin className="h-3.5 w-3.5 text-slate-450 shrink-0" />
                      <span className="truncate">
                        {[service.area, service.city]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>

                    <span className="text-xs font-black text-brand-primary dark:text-blue-450 shrink-0">
                      {priceLabel}
                    </span>
                  </div>

                  {/* Actions Row: Green Direct Call Button alongside Share/Portfolio (UI Improved) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    {/* Left: Contact Info Toggle (reveals number in-place) */}
                    <div className="flex-1 flex flex-col items-start gap-2">
                      {hasContacts ? (
                        <div className="w-full space-y-1.5">
                          <button
                            onClick={() => handleToggleContact(service.id)}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                              isRevealed
                                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                            }`}
                          >
                            <Phone className="h-3 w-3" />
                            <span>
                              {isRevealed
                                ? "Hide Contact Detail"
                                : "Show Numbers"}
                            </span>
                          </button>

                          <AnimatePresence>
                            {isRevealed && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden bg-slate-50 dark:bg-slate-955 border border-slate-150 dark:border-slate-850 rounded-xl p-2.5 flex flex-col gap-1.5 max-w-none"
                              >
                                {contacts.length > 0 ? (
                                  contacts.map((num, i) => (
                                    <a
                                      key={i}
                                      href={`tel:${num}`}
                                      className="flex items-center gap-1.5 text-xs font-bold text-slate-750 dark:text-slate-300 hover:text-brand-primary hover:underline"
                                    >
                                      <Icon
                                        name="call"
                                        className="text-xs text-emerald-500"
                                        fill
                                      />
                                      <span>{num}</span>
                                    </a>
                                  ))
                                ) : (
                                  <a
                                    href={`tel:${phoneFallback}`}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-750 dark:text-slate-300 hover:text-brand-primary hover:underline"
                                  >
                                    <Icon
                                      name="call"
                                      className="text-xs text-emerald-500"
                                      fill
                                    />
                                    <span>{phoneFallback}</span>
                                  </a>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold italic">
                          No direct contact numbers attached.
                        </span>
                      )}
                    </div>

                    {/* Right: Actions (direct Call green button, Share, Portfolio) */}
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      {/* Share Button */}
                      <button
                        onClick={(e) => handleShare(e, service.id)}
                        title="Share Service Link"
                        className="p-2 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-450 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>

                      {/* View Portfolio Button */}
                      <Link
                        href={`/p/${service.id}`}
                        className="inline-flex items-center justify-center gap-1 px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-750 text-white font-extrabold text-xs rounded-xl shadow-sm transition cursor-pointer active:scale-95"
                      >
                        <span>Portfolio</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>

                      {/* DIRECT GREEN CALL BUTTON */}
                      {hasContacts && directPhone && (
                        <a
                          href={`tel:${directPhone}`}
                          title={`Call direct at ${directPhone}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-sm shadow-emerald-500/20 hover:shadow-md transition active:scale-95 cursor-pointer"
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
    </div>
  );
}
