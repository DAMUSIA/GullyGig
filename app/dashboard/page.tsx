"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Eye, 
  Heart, 
  Star, 
  MessageSquare, 
  Briefcase, 
  Edit, 
  BarChart3, 
  ExternalLink, 
  Loader2, 
  AlertCircle,
  X,
  Check,
  Globe,
  Home,
  Calendar,
  MapPin
} from "lucide-react";
import { getCurrentUser, supabase } from "@/lib/supabase";

interface ServiceUser {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    phone_no?: string;
  };
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
  is_active: boolean;
  created_at: string;
}

interface ServiceReview {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  services?: { title: string };
  users?: { full_name: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<ServiceUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [recentReviews, setRecentReviews] = useState<ServiceReview[]>([]);

  // Edit Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState<number | null>(null);
  const [editPriceUnit, setEditPriceUnit] = useState("Per Hour");
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // View Listing Modal State
  const [viewingService, setViewingService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const { user } = (await getCurrentUser()) as { user: ServiceUser | null };
        if (!user) {
          router.push("/login");
          return;
        }
        setCurrentUser(user);

        if (!supabase) {
          throw new Error("Supabase service is not configured on your environment");
        }

        // Fetch owned services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData as ServiceItem[] || []);

        // Fetch recent reviews on owner's services
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("service_ratings")
          .select("*, services!inner(title, user_id), users:user_id(full_name)")
          .eq("services.user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!reviewsError && reviewsData) {
          setRecentReviews(reviewsData as ServiceReview[] || []);
        }
      } catch (err: unknown) {
        console.error("Dashboard loading error:", err);
        setError("Could not retrieve dashboard information. Try reloading.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  // Edit Action
  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditDescription(service.description);
    setEditPrice(service.starting_price);
    setEditPriceUnit(service.price_unit || "Per Hour");
    setEditIsActive(service.is_active);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!editingService) return;

    if (editTitle.trim().length < 3) {
      alert("Title must be at least 3 characters.");
      return;
    }
    if (editDescription.trim().length < 20) {
      alert("Description must be at least 20 characters.");
      return;
    }

    setIsSavingEdit(true);

    try {
      const { error: updateError } = await supabase
        .from("services")
        .update({
          title: editTitle.trim(),
          description: editDescription.trim(),
          starting_price: editPrice,
          price_unit: editPrice ? editPriceUnit : null,
          is_active: editIsActive,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingService.id);

      if (updateError) throw updateError;

      // Update state locally
      setServices(prev => prev.map(s => s.id === editingService.id ? {
        ...s,
        title: editTitle.trim(),
        description: editDescription.trim(),
        starting_price: editPrice,
        price_unit: editPrice ? editPriceUnit : null,
        is_active: editIsActive
      } : s));

      setEditingService(null);
      alert("Service updated successfully!");
    } catch (err: unknown) {
      console.error("Failed to update service:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(errMsg || "Failed to update service.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-slate-800">Dashboard Load Error</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Analytics summaries
  const totalServices = services.length;
  const totalViews = services.reduce((sum, s) => sum + (s.views_count || 0), 0);
  const totalLikes = services.reduce((sum, s) => sum + (s.likes_count || 0), 0);
  const ratedServices = services.filter((s) => (s.reviews_count || 0) > 0);
  const averageRating = ratedServices.length > 0
    ? parseFloat((ratedServices.reduce((sum, s) => sum + (s.rating_average || 0), 0) / ratedServices.length).toFixed(1))
    : 0.0;
  const totalReviewsCount = services.reduce((sum, s) => sum + (s.reviews_count || 0), 0);

  return (
    <div className="space-y-8 relative min-h-[calc(100vh-120px)] pb-16">
      
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome back, {currentUser?.user_metadata?.full_name || "Tutor"}!
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Here&apos;s the performance of your hyperlocal teaching services.
          </p>
        </div>
        
        <Link
          href="/dashboard/create-service"
          className="inline-flex items-center justify-center gap-1.5 px-4.5 py-3 bg-blue-600 hover:bg-blue-750 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 transition shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Services */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5 flex items-center gap-4.5 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/20">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Services</h3>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{totalServices}</p>
          </div>
        </div>

        {/* Views */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5 flex items-center gap-4.5 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/20">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Views</h3>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{totalViews}</p>
          </div>
        </div>

        {/* Likes */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5 flex items-center gap-4.5 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/20">
            <Heart className="h-5 w-5 fill-red-500/10" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Likes</h3>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{totalLikes}</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5 flex items-center gap-4.5 hover:border-slate-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/20">
            <Star className="h-5 w-5 fill-amber-500/10" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</h3>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{averageRating || "0.0"} <span className="text-xs font-semibold text-slate-400">({totalReviewsCount} reviews)</span></p>
          </div>
        </div>
      </div>

      {/* My Services Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">My Services</h2>
          <Link href="/dashboard/analytics" className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1">
            <span>Detailed Analytics</span>
            <BarChart3 className="h-3.5 w-3.5" />
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col items-center gap-3">
            <p className="text-xs text-slate-450 font-medium">You haven&apos;t listed any teaching services yet.</p>
            <Link
              href="/dashboard/create-service"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
            >
              List your first service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-5 relative hover:border-blue-150 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-100/30">
                      {service.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      service.is_active ? "bg-green-50 text-green-600 border border-green-100/35" : "bg-slate-100 text-slate-400 border border-slate-200/50"
                    }`}>
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-3">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{service.rating_average || "0.0"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{service.views_count || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{service.likes_count || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{service.reviews_count || 0}</span>
                    </span>
                  </div>
                </div>

                {/* Dashboard buttons */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(service)}
                    className="flex items-center justify-center gap-1 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/analytics")}
                    className="flex items-center justify-center gap-1 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <BarChart3 className="h-3 w-3" />
                    <span>Stats</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingService(service)}
                    className="flex items-center justify-center gap-1 py-2 bg-blue-50 border border-blue-150 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>View</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Grid */}
      {recentReviews.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-6 max-w-3xl">
          <h2 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-blue-500" />
            <span>Recent Reviews Left By Students</span>
          </h2>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">{review.users?.full_name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">on &quot;{review.services?.title}&quot;</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 my-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                {review.review && <p className="text-slate-600 leading-relaxed font-sans font-medium">{review.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        href="/dashboard/create-service"
        aria-label="Create service"
        title="Create service"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-blue-600/30 border border-white/20 z-30 group cursor-pointer"
      >
        <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
      </Link>

      {/* Inline Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div onClick={() => setEditingService(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
          
          <form
            onSubmit={handleSaveEdit}
            style={{ width: "min(560px, calc(100vw - 32px))", maxHeight: "calc(100vh - 48px)" }}
            className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 overflow-y-auto animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 leading-tight">Edit Service</h3>
                <p className="text-xs text-slate-500 mt-1">Update your listing details and visibility.</p>
              </div>
              <button type="button" onClick={() => setEditingService(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 shrink-0">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1.5 text-xs mb-4">
              <label htmlFor="edit-title" className="font-bold text-slate-500 uppercase">Title</label>
              <input
                id="edit-title"
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs mb-4">
              <label htmlFor="edit-desc" className="font-bold text-slate-500 uppercase">Description</label>
              <textarea
                id="edit-desc"
                rows={4}
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-850 leading-relaxed font-sans resize-y min-h-28"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="space-y-1.5">
                <label htmlFor="edit-price" className="font-bold text-slate-500 uppercase">Starting Price</label>
                <input
                  id="edit-price"
                  type="number"
                  value={editPrice || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEditPrice(v === "" ? null : Number(v));
                  }}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="edit-unit" className="font-bold text-slate-500 uppercase">Price Unit</label>
                <select
                  id="edit-unit"
                  value={editPriceUnit}
                  onChange={(e) => setEditPriceUnit(e.target.value)}
                  disabled={editPrice === null}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="Per Hour">Per Hour</option>
                  <option value="Per Session">Per Session</option>
                  <option value="Per Day">Per Day</option>
                  <option value="Per Month">Per Month</option>
                </select>
              </div>
            </div>

            {/* Toggle Status */}
            <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs mb-5">
              <div className="min-w-0">
                <span className="font-bold text-slate-700 block">Service Active Status</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Toggle whether this service is discoverable on marketplace.</span>
              </div>
              <input
                type="checkbox"
                checked={editIsActive}
                onChange={(e) => setEditIsActive(e.target.checked)}
                className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-extrabold text-sm rounded-xl hover:bg-slate-50 active:scale-98 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-xs active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listing Detail Modal */}
      {viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div onClick={() => setViewingService(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

          <div
            style={{ width: "min(680px, calc(100vw - 32px))", maxHeight: "calc(100vh - 48px)" }}
            className="bg-white border border-slate-100 rounded-3xl shadow-2xl relative z-10 overflow-y-auto animate-in zoom-in-95 duration-200"
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 sm:px-8 py-5 flex items-start justify-between gap-4 z-10 rounded-t-3xl">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase border border-blue-100/30">
                  {viewingService.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight mt-2 break-words">
                  {viewingService.title}
                </h2>
              </div>
              <button type="button" onClick={() => setViewingService(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-sm">
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Description</h3>
                <p className="text-slate-650 font-medium leading-7 bg-blue-50/20 rounded-2xl p-4 border border-blue-100/10 whitespace-pre-line break-words">
                  {viewingService.description}
                </p>
              </div>

              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-3.5">
                <h3 className="font-extrabold text-slate-700 border-b border-slate-200/50 pb-2">Specifications</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-1 sm:gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-blue-500" />
                    Teaching Modes
                  </span>
                  <p className="font-semibold text-slate-600 break-words">
                    {viewingService.service_modes.join(", ") || "No modes selected"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-1 sm:gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    Availability
                  </span>
                  <p className="font-semibold text-slate-600 break-words">
                    {viewingService.availability.join(", ") || "Flexible"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-1 sm:gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-blue-500" />
                    Languages
                  </span>
                  <p className="font-semibold text-slate-600 break-words">
                    {viewingService.languages.join(", ") || "English"}
                  </p>
                </div>

                {viewingService.area && viewingService.city && (
                  <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-1 sm:gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      Location
                    </span>
                    <p className="font-semibold text-slate-600 break-words">
                      {viewingService.area}, {viewingService.city}
                    </p>
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
