"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Inbox,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Components
import Footer from "@/components/layout/Footer";
import Header from "@/components/public-services/Header";
import SearchFilters from "@/components/public-services/SearchFilters";
import ServiceCard from "@/components/public-services/ServiceCard";
import { ServiceItem } from "@/components/public-services/types";

const ITEMS_PER_PAGE = 10;

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
  const isFirstRender = useRef(true);
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
      {/* Extracted Header */}
      <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

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

        {/* Extracted Search & Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          detectingLoc={detectingLoc}
          handleAutoDetectLocation={handleAutoDetectLocation}
          setCurrentPage={setCurrentPage}
        />

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

        {/* 1-Column Service Listing */}
        {!loading && !error && currentServicesList.length > 0 && (
          <div
            id="services-list"
            className="flex flex-col gap-5 max-w-4xl mx-auto"
          >
            {currentServicesList.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onShowToast={showToast}
              />
            ))}
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
