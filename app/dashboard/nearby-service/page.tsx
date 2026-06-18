"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle
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
  users?: UserProfile; // Nested from Supabase join
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
  "Other"
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
  const [likedServiceIds, setLikedServiceIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Modal Details
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState("");
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Initial Fetch
  useEffect(() => {
    async function initPage() {
      try {
        setLoading(true);
        const { user } = (await getCurrentUser()) as { user: ServiceUser | null };
        setCurrentUser(user);

        if (!supabase) {
          throw new Error("Supabase service is not configured on your environment");
        }

        // Fetch services joined with users table
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*, users:user_id(full_name, about)")
          .eq("is_active", true);

        if (servicesError) throw servicesError;
        setServices(servicesData as ServiceItem[] || []);

        // Fetch user's likes
        if (user) {
          const { data: likesData, error: likesError } = await supabase
            .from("service_likes")
            .select("service_id")
            .eq("user_id", user.id);

          if (!likesError && likesData) {
            const ids = new Set<string>(likesData.map((l) => l.service_id));
            setLikedServiceIds(ids);
          }
        }
      } catch (err: unknown) {
        console.error("Error loading marketplace:", err);
        setError("Failed to retrieve service listings. Please reload.");
      } finally {
        setLoading(false);
      }
    }

    initPage();
  }, []);

  // Fetch reviews when details modal is opened
  const loadReviews = async (serviceId: string) => {
    if (!supabase) return;
    setReviewsLoading(true);
    setHasReviewed(false);
    try {
      const { data, error } = await supabase
        .from("service_ratings")
        .select("*, users:user_id(full_name, about)")
        .eq("service_id", serviceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data as ServiceReview[] || []);

      if (currentUser && data) {
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
    // Reset review input state when opening another service details modal
    setUserRating(0);
    setUserComment("");
    loadReviews(service.id);

    // Optimistic Update View Count
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, views_count: s.views_count + 1 } : s));

    try {
      // Increment views count on services directly
      await supabase
        .from("services")
        .update({ views_count: service.views_count + 1 })
        .eq("id", service.id);
      
      // Update analytics table
      const { data: analyticsRow } = await supabase
        .from("service_analytics")
        .select("*")
        .eq("service_id", service.id)
        .single();

      if (analyticsRow) {
        await supabase
          .from("service_analytics")
          .update({
            total_views: (analyticsRow.total_views || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("service_id", service.id);
      } else {
        await supabase
          .from("service_analytics")
          .insert({
            service_id: service.id,
            total_views: 1,
            unique_visitors: 1,
            updated_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.error("Error tracking view count:", err);
      // Fallback direct update if RPC is missing
      try {
        await supabase
          .from("services")
          .update({ views_count: service.views_count + 1 })
          .eq("id", service.id);
      } catch (fallbackErr) {
        console.error("Fallback view count tracking failed:", fallbackErr);
      }
    }
  };

  // Toggle Like ❤️
  const handleToggleLike = async (e: React.MouseEvent, service: ServiceItem) => {
    e.stopPropagation();
    if (!supabase) return;
    if (!currentUser) {
      alert("Please log in to like service listings.");
      return;
    }

    const isLiked = likedServiceIds.has(service.id);
    const newLikedIds = new Set(likedServiceIds);

    // Optimistic UI updates
    if (isLiked) {
      newLikedIds.delete(service.id);
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, likes_count: Math.max(0, s.likes_count - 1) } : s));
    } else {
      newLikedIds.add(service.id);
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, likes_count: s.likes_count + 1 } : s));
    }
    setLikedServiceIds(newLikedIds);

    try {
      if (isLiked) {
        // Remove like
        await supabase
          .from("service_likes")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("service_id", service.id);

        // Update services table
        await supabase
          .from("services")
          .update({ likes_count: Math.max(0, service.likes_count - 1) })
          .eq("id", service.id);

        // Update service analytics
        const { data: analyticsRow } = await supabase
          .from("service_analytics")
          .select("*")
          .eq("service_id", service.id)
          .single();

        if (analyticsRow) {
          await supabase
            .from("service_analytics")
            .update({
              total_likes: Math.max(0, (analyticsRow.total_likes || 0) - 1),
              updated_at: new Date().toISOString(),
            })
            .eq("service_id", service.id);
        }
      } else {
        // Insert like
        await supabase
          .from("service_likes")
          .insert({ user_id: currentUser.id, service_id: service.id });

        // Update services table
        await supabase
          .from("services")
          .update({ likes_count: service.likes_count + 1 })
          .eq("id", service.id);

        // Update service analytics
        const { data: analyticsRow } = await supabase
          .from("service_analytics")
          .select("*")
          .eq("service_id", service.id)
          .single();

        if (analyticsRow) {
          await supabase
            .from("service_analytics")
            .update({
              total_likes: (analyticsRow.total_likes || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("service_id", service.id);
        } else {
          await supabase
            .from("service_analytics")
            .insert({
              service_id: service.id,
              total_likes: 1,
              updated_at: new Date().toISOString()
            });
        }
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
      // Revert if error
      setLikedServiceIds(likedServiceIds);
      setServices(services);
    }
  };

  // Google Maps Redirection
  const handleOpenMap = (e: React.MouseEvent, service: ServiceItem) => {
    e.stopPropagation();
    if (service.latitude && service.longitude) {
      window.open(`https://www.google.com/maps?q=${service.latitude},${service.longitude}`, "_blank");
    } else {
      alert("No exact coordinates attached to this service listing.");
    }
  };

  // Submit Review 📝
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!currentUser || !selectedService) return;

    setReviewSubmitLoading(true);

    try {
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error("You must be logged in to submit a review.");
      }

      // Call secure server endpoint to bypass client RLS issues
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          rating: userRating,
          comment: userComment
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit review.");
      }

      const { averageRating, totalReviews } = result;

      // Update page listing states
      setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, rating_average: averageRating, reviews_count: totalReviews } : s));
      setSelectedService(prev => prev ? { ...prev, rating_average: averageRating, reviews_count: totalReviews } : null);

      // Reload reviews list
      loadReviews(selectedService.id);
      setUserComment("");
      setUserRating(0);
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      let errMsg = err?.message || (err instanceof Error ? err.message : String(err));
      // User-friendly translation for common Supabase schema unique constraint violation error
      if (errMsg && errMsg.includes("service_ratings_user_service_unique")) {
        errMsg = "You have already submitted a review for this tutor/service.";
      }
      alert(errMsg || "Failed to submit review. Try again.");
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
    if (filter === "Gym") return catLower.includes("gym") || catLower.includes("fitness") || catLower.includes("personal trainer");
    if (filter === "Tuition") return catLower.includes("tutor") || catLower.includes("teacher") || catLower.includes("coach") || catLower.includes("academic") || catLower.includes("math") || catLower.includes("science") || catLower.includes("english") || catLower.includes("coding") || catLower.includes("language") || catLower.includes("exam");
    if (filter === "Fitness") return catLower.includes("fitness") || catLower.includes("trainer") || catLower.includes("yoga") || catLower.includes("gym");
    if (filter === "Music") return catLower.includes("music") || catLower.includes("guitar") || catLower.includes("singing") || catLower.includes("piano");
    if (filter === "Other") {
      const keys = ["yoga", "dance", "guitar", "gym", "fitness", "personal trainer", "tutor", "teacher", "coach", "academic", "math", "science", "english", "coding", "language", "exam", "music", "singing", "piano"];
      return !keys.some(k => catLower.includes(k));
    }
    return catLower.includes(filtLower);
  };

  // Search, Filter, Sort Logic
  const filteredServices = services
    .filter((s) => {
      // 1. Text Search
      const text = searchQuery.toLowerCase();
      const matchText =
        s.title.toLowerCase().includes(text) ||
        s.category.toLowerCase().includes(text) ||
        s.city.toLowerCase().includes(text) ||
        (s.area || "").toLowerCase().includes(text) ||
        (s.users?.full_name || "").toLowerCase().includes(text);

      // 2. Chip Category Selection
      const matchCategory = matchesCategoryFilter(s.category, selectedCategory);

      return matchText && matchCategory;
    })
    .sort((a, b) => {
      // 3. Sorting Options
      if (sortBy === "Newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
              Discover verified local instructors, academic tutors, and yoga coaches right in your neighborhood.
            </p>
          </div>
        </div>

        {/* Search Bar & Sort Grid */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200/60 shadow-xs flex flex-col md:flex-row gap-4 items-center">
          {/* Input Search */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutors, guitar, yoga, dance..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-inner text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-semibold placeholder:text-slate-400"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto shrink-0">
            <label htmlFor="sort-dropdown" className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Sort By:
            </label>
            <select
              id="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-56 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
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

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
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
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Loader State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500 font-bold">Scanning local database...</p>
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
            <h3 className="text-lg font-extrabold text-slate-800">No Services Found</h3>
            <p className="text-xs text-slate-400 max-w mx-auto mt-1 leading-relaxed">
              We couldn&apos;t find any services matching &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;. Try adjusting your search query or chips.
            </p>
          </div>
        )}

        {/* Services Listings Grid */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isLiked = likedServiceIds.has(service.id);
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
                            title="Open in Google Maps"
                            className="p-1.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-105 active:scale-95"
                          >
                            <Navigation className="h-4 w-4 fill-blue-600/10" />
                          </button>
                        )}
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(e, service)}
                          className={`p-1.5 border rounded-xl transition-all hover:scale-105 active:scale-95 ${
                            isLiked
                              ? "bg-red-50 border-red-200 text-red-500"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50/50"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                        </button>
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
                        <span className="text-slate-600">{service.rating_average || "0.0"}</span>
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
                      <span className="truncate">{[service.area, service.city].filter(Boolean).join(", ")}</span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 shrink-0">{priceLabel}</span>
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
          {/* Glass Backdrop */}
          <div
            onClick={() => setSelectedService(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal content dialog */}
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
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor Profile</h3>
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
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About the Service</h3>
                    <p className="text-xs text-slate-650 font-medium leading-relaxed whitespace-pre-line bg-blue-50/20 border border-blue-100/10 rounded-2xl p-4">
                      {selectedService.description}
                    </p>
                  </div>
                </div>

                {/* Badges / Specifications Card */}
                <div className="md:col-span-4 bg-slate-50/70 border border-slate-100 rounded-2xl p-4.5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 border-b border-slate-200/60 pb-1.5">Specifications</h3>
                  
                  {/* Mode */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Home className="h-3.5 w-3.5 text-blue-500" />
                      Teaching Modes
                    </span>
                    <p className="text-xs font-semibold text-slate-600 pl-4.5">
                      {selectedService.service_modes.join(", ") || "No modes selected"}
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
                    <span>Student Reviews ({selectedService.reviews_count || 0})</span>
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
                  <p className="text-xs text-slate-400 font-medium italic">No reviews have been written for this service yet.</p>
                ) : (
                  <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">
                            {review.users?.full_name || "Student Reviewer"}
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
                        {review.review && <p className="text-slate-600 leading-relaxed font-sans">{review.review}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Review Panel */}
                {currentUser ? (
                  hasReviewed ? (
                    <div className="p-3 bg-blue-50/50 border border-blue-100/30 rounded-2xl text-xs text-blue-600 font-bold text-center">
                      ✓ You have already reviewed this service. You can leave one review per service.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-4 space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-700">Write a Review</h4>
                      
                      {/* Star Selection */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Your Rating <span className="text-red-400">*</span></span>
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
                                aria-label={`Rate ${starVal} star${starVal > 1 ? 's' : ''}`}
                              >
                                <Star className={`h-6 w-6 ${isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"}`} />
                              </button>
                            );
                          })}
                          {userRating > 0 && (
                            <span className="ml-1 text-[10px] font-bold text-amber-500">{userRating}/5</span>
                          )}
                        </div>
                        {userRating === 0 && (
                          <p className="text-[10px] text-slate-400">Click a star to rate</p>
                        )}
                      </div>

                      {/* Comment textarea */}
                      <div className="space-y-1.5">
                        <label htmlFor="review-textarea" className="block text-[10px] font-bold text-slate-400 uppercase">Your Review (Optional)</label>
                        <textarea
                          id="review-textarea"
                          rows={3}
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="Tell other students about your experience learning with this tutor..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed font-sans resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={reviewSubmitLoading || userRating === 0}
                        className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
