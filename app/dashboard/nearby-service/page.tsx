"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  MapPin,
  Heart,
  Eye,
  MessageSquare,
  Star,
  Globe,
  Home,
  Calendar,
  Navigation,
  X,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getCurrentUser, supabase } from "@/lib/supabase";

interface UserProfile {
  full_name: string;
  about: string | null;
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
  users?: UserProfile;
}

interface ServiceReview {
  id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
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

interface ServiceUser {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    phone_no?: string;
  };
}

export default function NearbyServicePage() {
  const [currentUser, setCurrentUser] = useState<ServiceUser | null>(null);

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  // CRITICAL: This stores which service IDs the current user has liked
  const [likedServiceIds, setLikedServiceIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track which service IDs are currently being liked/unliked
  const [likingServiceIds, setLikingServiceIds] = useState<Set<string>>(
    new Set(),
  );

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedCity, setSelectedCity] = useState("All");

  // Modal Details
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState("");
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // ============================================
  // FIXED: Use useMemo instead of useEffect for derived state
  // This avoids the ESLint error about setState in useEffect
  // ============================================
  const availableCities = useMemo(() => {
    if (services.length === 0) return [];
    const cities = [...new Set(services.map((s) => s.city).filter(Boolean))];
    return cities.sort();
  }, [services]);

  // ============================================
  // CRITICAL FIX: Load user's likes from database
  // This runs on every page load to restore liked state
  // ============================================
  // Load user's likes from database with debug logging
  const loadUserLikes = useCallback(async (userId: string) => {
    if (!supabase) return new Set<string>();

    try {
      console.log("🔍 Loading likes for user:", userId);

      // First, check if we can read the table at all
      const { data: allLikes, error: allError } = await supabase
        .from("service_likes")
        .select("*");

      console.log("📊 All likes in table:", allLikes);
      console.log("📊 All likes error:", allError);

      // Now get user-specific likes
      const { data: likesData, error: likesError } = await supabase
        .from("service_likes")
        .select("service_id")
        .eq("user_id", userId);

      console.log("🔍 Query result:", likesData);
      console.log("🔍 Query error:", likesError);

      if (likesError) {
        console.error("❌ Error loading likes:", likesError);
        return new Set<string>();
      }

      const ids = new Set<string>(likesData?.map((l) => l.service_id) || []);
      console.log(`✅ Loaded ${ids.size} liked services:`, [...ids]);
      return ids;
    } catch (err) {
      console.error("❌ Failed to load likes:", err);
      return new Set<string>();
    }
  }, []);

  // ============================================
  // Initial Fetch - Load services AND user's likes
  // ============================================
  useEffect(() => {
    let isMounted = true;

    async function initPage() {
      try {
        setLoading(true);
        console.log("🚀 Initializing page...");

        // Get current user
        const { user } = (await getCurrentUser()) as {
          user: ServiceUser | null;
        };
        setCurrentUser(user);
        console.log("👤 Current user:", user?.id || "Not logged in");

        if (!supabase) {
          throw new Error(
            "Supabase service is not configured on your environment",
          );
        }

        // Fetch services with user profiles
        console.log("📦 Fetching services...");
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*, users:user_id(full_name, about)")
          .eq("is_active", true);

        if (servicesError) throw servicesError;

        if (isMounted) {
          setServices((servicesData as ServiceItem[]) || []);
          console.log(`📦 Loaded ${servicesData?.length || 0} services`);
        }

        // ============================================
        // CRITICAL: Load user's likes from database
        // This restores the liked state on page refresh
        // ============================================
        if (user) {
          const likedIds = await loadUserLikes(user.id);
          if (isMounted) {
            setLikedServiceIds(likedIds);
            console.log(`❤️ Restored ${likedIds.size} likes from database`);
          }
        } else {
          // If no user, ensure likes are empty
          if (isMounted) {
            setLikedServiceIds(new Set());
            console.log("👤 No user logged in, likes set to empty");
          }
        }
      } catch (err: unknown) {
        console.error("❌ Error loading marketplace:", err);
        if (isMounted) {
          setError("Failed to retrieve service listings. Please reload.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log("✅ Page initialization complete");
        }
      }
    }

    initPage();

    return () => {
      isMounted = false;
    };
  }, [loadUserLikes]);

  // Fetch reviews via the admin API endpoint (bypasses RLS so reviews always show)
  const loadReviews = async (serviceId: string) => {
    setReviewsLoading(true);
    setHasReviewed(false);
    try {
      const res = await fetch(
        `/api/reviews?serviceId=${encodeURIComponent(serviceId)}`,
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load reviews");

      const data: ServiceReview[] = json.reviews || [];
      setReviews(data);

      if (currentUser && data.length > 0) {
        const reviewed = data.some((r) => r.user_id === currentUser.id);
        setHasReviewed(reviewed);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Open Details Modal and increment view count
  const handleOpenDetails = async (service: ServiceItem) => {
    if (!supabase) return;
    setSelectedService(service);
    setUserRating(0);
    setUserComment("");
    setReviewError(null);
    setReviewSuccess(false);
    loadReviews(service.id);

    // Optimistic Update View Count
    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id ? { ...s, views_count: s.views_count + 1 } : s,
      ),
    );

    try {
      await supabase
        .from("services")
        .update({ views_count: service.views_count + 1 })
        .eq("id", service.id);

      const { data: analyticsRow } = await supabase
        .from("service_analytics")
        .select("*")
        .eq("service_id", service.id)
        .maybeSingle();

      if (analyticsRow) {
        await supabase
          .from("service_analytics")
          .update({
            total_views: (analyticsRow.total_views || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("service_id", service.id);
      } else {
        await supabase.from("service_analytics").insert({
          service_id: service.id,
          total_views: 1,
          unique_visitors: 1,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error tracking view count:", err);
    }
  };

  // ============================================
  // Toggle Like - Fixed with functional updates
  // ============================================
  const handleToggleLike = async (
    e: React.MouseEvent,
    service: ServiceItem,
  ) => {
    e.stopPropagation();
    if (!supabase) return;
    if (!currentUser) {
      alert("Please log in to like service listings.");
      return;
    }

    // Use a local variable to check current state
    const isCurrentlyLiked = likedServiceIds.has(service.id);
    console.log(
      `🔄 Toggling like for service ${service.id}: currently ${isCurrentlyLiked ? "liked" : "unliked"}`,
    );

    // Prevent multiple rapid clicks for this specific service
    if (likingServiceIds.has(service.id)) return;

    // Mark this service as being processed
    setLikingServiceIds((prev) => new Set(prev).add(service.id));

    // Store previous state for rollback
    const previousLikedIds = new Set(likedServiceIds);
    const previousServices = [...services];

    // ============================================
    // OPTIMISTIC UPDATE - Using functional updates
    // ============================================
    setLikedServiceIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(service.id);
      } else {
        next.add(service.id);
      }
      return next;
    });

    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id
          ? { ...s, likes_count: s.likes_count + (isCurrentlyLiked ? -1 : 1) }
          : s,
      ),
    );

    try {
      // Get session token for authorization
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("Authentication required");
      }

      // Call the API endpoint
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service.id,
          action: isCurrentlyLiked ? "unlike" : "like",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update like");
      }

      if (data.success) {
        const finalLiked = data.liked || false;
        const finalCount = data.likesCount || 0;

        console.log(
          `✅ Like toggled successfully: ${finalLiked ? "liked" : "unliked"}, count: ${finalCount}`,
        );

        // ============================================
        // UPDATE WITH SERVER STATE - Using functional updates
        // ============================================
        setLikedServiceIds((prev) => {
          const next = new Set(prev);
          if (finalLiked) {
            next.add(service.id);
          } else {
            next.delete(service.id);
          }
          return next;
        });

        setServices((prev) =>
          prev.map((s) =>
            s.id === service.id ? { ...s, likes_count: finalCount } : s,
          ),
        );
      } else {
        throw new Error(data.error || "Failed to update like");
      }
    } catch (err) {
      console.error("❌ Like toggle failed:", err);

      // ============================================
      // ROLLBACK ON ERROR
      // ============================================
      setLikedServiceIds(previousLikedIds);
      setServices(previousServices);

      alert(err instanceof Error ? err.message : "Failed to update like");
    } finally {
      setLikingServiceIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(service.id);
        return newSet;
      });
    }
  };

  // Google Maps Redirection
  const handleOpenMap = (e: React.MouseEvent, service: ServiceItem) => {
    e.stopPropagation();
    if (service.latitude && service.longitude) {
      window.open(
        `https://www.google.com/maps?q=${service.latitude},${service.longitude}`,
        "_blank",
      );
    } else {
      alert("No exact coordinates attached to this service listing.");
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!currentUser || !selectedService) return;

    setReviewSubmitLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("You must be logged in to submit a review.");
      }

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          rating: userRating,
          comment: userComment,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit review.");
      }

      const { averageRating, totalReviews } = result;

      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedService.id
            ? {
                ...s,
                rating_average: averageRating,
                reviews_count: totalReviews,
              }
            : s,
        ),
      );
      setSelectedService((prev) =>
        prev
          ? {
              ...prev,
              rating_average: averageRating,
              reviews_count: totalReviews,
            }
          : null,
      );

      // Reload reviews via API so the new review appears immediately
      await loadReviews(selectedService.id);
      setUserComment("");
      setUserRating(0);
      setReviewSuccess(true);
      setHasReviewed(true);
    } catch (err: unknown) {
      console.error("Failed to submit review:", err);
      const errorObj = err as { message?: string } | null;
      let errMsg =
        errorObj?.message || (err instanceof Error ? err.message : String(err));
      if (errMsg && errMsg.includes("service_ratings_user_service_unique")) {
        errMsg = "You have already submitted a review for this tutor/service.";
      }
      setReviewError(errMsg || "Failed to submit review. Try again.");
    } finally {
      setReviewSubmitLoading(false);
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
        s.city.toLowerCase().includes(text) ||
        (s.area || "").toLowerCase().includes(text) ||
        (s.users?.full_name || "").toLowerCase().includes(text);

      const matchCategory = matchesCategoryFilter(s.category, selectedCategory);
      const matchCity = selectedCity === "All" || s.city === selectedCity;

      return matchText && matchCategory && matchCity;
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
      if (sortBy === "Most Viewed") {
        return b.views_count - a.views_count;
      }
      if (sortBy === "Most Liked") {
        return b.likes_count - a.likes_count;
      }
      if (sortBy === "Lowest Price") {
        return (a.starting_price || 0) - (b.starting_price || 0);
      }
      if (sortBy === "Highest Price") {
        return (b.starting_price || 0) - (a.starting_price || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Search and Filter Panel */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Titles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Nearby Providers & Tutors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Discover verified local instructors, academic tutors, and yoga
              coaches right in your neighborhood.
            </p>
          </div>
        </div>

        {/* Search Bar & Sort Grid */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200/60 shadow-xs flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutors, guitar, yoga, dance..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-inner text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold placeholder:text-slate-400"
              aria-label="Search services"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto shrink-0">
            <label
              htmlFor="city-dropdown"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1"
            >
              <MapPin className="h-3.5 w-3.5" />
              City:
            </label>
            <select
              id="city-dropdown"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-48 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
              aria-label="Filter by city"
            >
              <option value="All">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto shrink-0">
            <label
              htmlFor="sort-dropdown"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0"
            >
              Sort By:
            </label>
            <select
              id="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-56 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
              aria-label="Sort services by"
            >
              <option value="Newest">Newest Listed</option>
              <option value="Highest Rated">Highest Rated ⭐</option>
              <option value="Most Viewed">Most Viewed 👁</option>
              <option value="Most Liked">Most Liked ❤️</option>
              <option value="Lowest Price">Lowest Price (₹)</option>
              <option value="Highest Price">Highest Price (₹)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips with Clear Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_CHIPS.map((chip) => {
              const isSelected = selectedCategory === chip;
              return (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setSelectedCategory(chip)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all active:scale-95 cursor-pointer shadow-2xs ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  aria-label={`Filter by ${chip}`}
                  aria-pressed={isSelected}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Clear Filters Button */}
          {(searchQuery ||
            selectedCategory !== "All" ||
            selectedCity !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedCity("All");
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1"
              aria-label="Clear all filters"
            >
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Loader State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500 font-bold">
              Scanning local database...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center gap-3 max-w-lg mx-auto">
            <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs max-w mx-auto">
            <div className="w-16 h-16 bg-blue-50/50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100/50">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">
              No Services Found
            </h3>
            <p className="text-xs text-slate-400 max-w mx-auto mt-1 leading-relaxed">
              We couldn&apos;t find any services matching &quot;{searchQuery}
              &quot; under &quot;{selectedCategory}&quot;
              {selectedCity !== "All" ? ` in &quot;${selectedCity}&quot;` : ""}.
              Try adjusting your search query or filters.
            </p>
          </div>
        )}

        {/* Services Listings Grid */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              // ============================================
              // CRITICAL: Check if this service is liked
              // Uses the Set populated from database on load
              // ============================================
              const isOwnService = currentUser?.id === service.user_id;
              const isLiked = likedServiceIds.has(service.id);
              const isLikingThis = likingServiceIds.has(service.id);
              const priceLabel = service.starting_price
                ? `Starts from ₹${service.starting_price}/${(service.price_unit || "hour").toLowerCase().replace("per ", "")}`
                : "Price on Enquiry";

              return (
                <div
                  key={service.id}
                  onClick={() => handleOpenDetails(service)}
                  className="bg-white border border-slate-200/80 hover:border-blue-150 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between gap-5 relative"
                >
                  <div className="space-y-3">
                    {/* Category, Actions Header */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100/30">
                        {service.category}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Map Button */}
                        {service.latitude && service.longitude && (
                          <button
                            type="button"
                            onClick={(e) => handleOpenMap(e, service)}
                            className="p-1.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-105 active:scale-95"
                            aria-label={`Open ${service.title} in Google Maps`}
                            title={`Open ${service.title} in Google Maps`}
                          >
                            <Navigation className="h-4 w-4 fill-blue-600/10" />
                          </button>
                        )}
                        {/* ============================================
                            LIKE BUTTON - Instagram Style
                            Heart fills if service.id is in likedServiceIds
                            ============================================ */}
                        {!isOwnService && (
                          <button
                            type="button"
                            onClick={(e) => handleToggleLike(e, service)}
                            disabled={isLikingThis}
                            className={`p-1.5 border rounded-xl transition-all hover:scale-105 active:scale-95 ${
                              isLiked
                                ? "bg-red-50 border-red-200 text-red-500"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50/50"
                            } ${isLikingThis ? "opacity-50 cursor-not-allowed" : ""}`}
                            aria-label={
                              isLiked
                                ? `Unlike ${service.title}`
                                : `Like ${service.title}`
                            }
                            title={
                              isLiked
                                ? `Unlike ${service.title}`
                                : `Like ${service.title}`
                            }
                          >
                            {isLikingThis ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Heart
                                className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`}
                              />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-slate-400">
                        By {service.users?.full_name || "Verified Tutor"}
                      </h4>
                      <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Stats Icons Panel */}
                    <div className="flex items-center gap-3.5 text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-slate-600">
                          {service.rating_average || "0.0"}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        <span>{service.views_count || 0}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-slate-400" />
                        <span>{service.likes_count || 0}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        <span>{service.reviews_count || 0}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Area */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1 text-slate-400 font-semibold text-[11px] max-w-[50%]">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {[service.area, service.city]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 shrink-0">
                      {priceLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Dialog Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedService(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase border border-blue-100/30">
                  {selectedService.category}
                </span>
                <h2 className="text-lg font-extrabold text-slate-800 line-clamp-1 mt-1">
                  {selectedService.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                aria-label="Close details"
                title="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Tutor & Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Details Section */}
                <div className="md:col-span-8 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Instructor Profile
                    </h3>
                    <h4 className="text-base font-extrabold text-slate-800">
                      {selectedService.users?.full_name || "Verified Tutor"}
                    </h4>
                    {selectedService.users?.about && (
                      <p className="text-xs text-slate-500 font-medium leading-relaxed italic bg-slate-50 rounded-xl p-3 border border-slate-100">
                        &quot;{selectedService.users.about}&quot;
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      About the Service
                    </h3>
                    <p className="text-xs text-slate-650 font-medium leading-relaxed whitespace-pre-line bg-blue-50/20 border border-blue-100/10 rounded-2xl p-4">
                      {selectedService.description}
                    </p>
                  </div>
                </div>

                {/* Badges / Specifications Card */}
                <div className="md:col-span-4 bg-slate-50/70 border border-slate-100 rounded-2xl p-4.5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 border-b border-slate-200/60 pb-1.5">
                    Specifications
                  </h3>

                  {/* Mode */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Home className="h-3.5 w-3.5 text-blue-500" />
                      Teaching Modes
                    </span>
                    <p className="text-xs font-semibold text-slate-600 pl-4.5">
                      {selectedService.service_modes.join(", ") ||
                        "No modes selected"}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      Availability
                    </span>
                    <p className="text-xs font-semibold text-slate-600 pl-4.5">
                      {selectedService.availability.join(", ") || "Flexible"}
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      Languages
                    </span>
                    <p className="text-xs font-semibold text-slate-600 pl-4.5">
                      {selectedService.languages.join(", ") || "English"}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-blue-500" />
                      Starting Price
                    </span>
                    <p className="text-xs font-extrabold text-blue-600 pl-4.5">
                      {selectedService.starting_price
                        ? `₹${selectedService.starting_price} / ${(selectedService.price_unit || "hour").toLowerCase()}`
                        : "Price on Enquiry"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-slate-100 pt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <span>
                      Customer Reviews ({selectedService.reviews_count || 0})
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {selectedService.rating_average || "0.0"}
                    </span>
                  </h3>
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-bold">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Loading reviews list...</span>
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic">
                    No reviews have been written for this service yet.
                  </p>
                ) : (
                  <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">
                            {review.users?.full_name || "Customer Reviewer"}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 my-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                        {review.review && (
                          <p className="text-slate-600 leading-relaxed font-sans">
                            {review.review}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Review Panel */}
                {/* Determine if the current user is the provider of this service */}
                {currentUser &&
                selectedService &&
                currentUser.id === selectedService.user_id ? (
                  /* Provider cannot review their own service */
                  <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        This is your listing
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        You cannot like or review your own service listing.
                      </p>
                    </div>
                  </div>
                ) : currentUser ? (
                  hasReviewed || reviewSuccess ? (
                    /* Already reviewed — success banner */
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-800">
                          Review submitted!
                        </p>
                        <p className="text-[11px] text-green-700 mt-0.5 leading-relaxed">
                          Thank you for your feedback. You can only submit one
                          review per service. Your review is now visible below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmitReview}
                      className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-4 space-y-4"
                    >
                      <h4 className="text-xs font-extrabold text-slate-700">
                        Write a Review
                      </h4>

                      {/* Inline error banner */}
                      {reviewError && (
                        <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-[11px] font-semibold text-red-700 leading-relaxed">
                            {reviewError}
                          </p>
                        </div>
                      )}

                      {/* Star Selection */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                          Your Rating <span className="text-red-400">*</span>
                        </span>
                        <div className="flex gap-1 items-center">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const starVal = idx + 1;
                            const isFilled = starVal <= userRating;
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => setUserRating(starVal)}
                                className="p-0.5 hover:scale-110 transition cursor-pointer"
                                aria-label={`Rate ${starVal} star${starVal > 1 ? "s" : ""}`}
                                title={`Rate ${starVal} star${starVal > 1 ? "s" : ""}`}
                              >
                                <Star
                                  className={`h-6 w-6 ${isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"}`}
                                />
                              </button>
                            );
                          })}
                          {userRating > 0 && (
                            <span className="ml-1 text-[10px] font-bold text-amber-500">
                              {userRating}/5
                            </span>
                          )}
                        </div>
                        {userRating === 0 && (
                          <p className="text-[10px] text-slate-400">
                            Click a star to rate
                          </p>
                        )}
                      </div>

                      {/* Comment textarea */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="review-textarea"
                          className="block text-[10px] font-bold text-slate-400 uppercase"
                        >
                          Your Review (Optional)
                        </label>
                        <textarea
                          id="review-textarea"
                          rows={3}
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="Tell other Customers about your experience learning with this tutor..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed font-sans resize-none"
                          aria-label="Your review comment"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={reviewSubmitLoading || userRating === 0}
                        className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Submit review"
                      >
                        {reviewSubmitLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-white" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>Post Review</span>
                          </>
                        )}
                      </button>
                    </form>
                  )
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700 font-bold text-center">
                    Please login to leave a review for this tutor.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
