"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import all components
import { WelcomeHeader } from "@/components/dashboard/welcome_header";
import { AnalyticsCard } from "@/components/dashboard/analysis_card";
import { AllServices } from "@/components/dashboard/all_services";
import { RecentReviews } from "@/components/dashboard/recent_reviews";
import { EditServiceModal } from "@/components/dashboard/edit_modal";
import { ViewServiceModal } from "@/components/dashboard/view_modal";
import { FAB } from "@/components/dashboard/fab";

// Types
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

/**
 * Renders the tutor dashboard page.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ServiceUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null,
  );
  const [viewingService, setViewingService] = useState<ServiceItem | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { user: currentUser } = (await getCurrentUser()) as {
          user: ServiceUser | null;
        };
        if (!currentUser) {
          router.push("/Auth");
          return;
        }
        setUser(currentUser);

        if (!supabase) throw new Error("Supabase not configured");

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (servicesError) throw servicesError;
        setServices((servicesData as ServiceItem[]) || []);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("service_ratings")
          .select("*, services!inner(title, user_id), users:user_id(full_name)")
          .eq("services.user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!reviewsError && reviewsData) {
          setReviews((reviewsData as ServiceReview[]) || []);
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Could not retrieve dashboard information. Try reloading.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Handle edit save
  const handleSaveEdit = async (data: {
    title: string;
    description: string;
    price: number | null;
    priceUnit: string;
    isActive: boolean;
    contactNumbers: string[];
  }) => {
    if (!supabase || !editingService) return;

    if (data.title.trim().length < 3) {
      showToast("Title must be at least 3 characters.", "error");
      return;
    }
    if (data.description.trim().length < 20) {
      showToast("Description must be at least 20 characters.", "error");
      return;
    }

    setIsSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("services")
        .update({
          title: data.title.trim(),
          description: data.description.trim(),
          starting_price: data.price,
          price_unit: data.price ? data.priceUnit : null,
          is_active: data.isActive,
          contact_numbers: data.contactNumbers,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingService.id);

      if (updateError) throw updateError;

      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                title: data.title.trim(),
                description: data.description.trim(),
                starting_price: data.price,
                price_unit: data.price ? data.priceUnit : null,
                is_active: data.isActive,
                contact_numbers: data.contactNumbers,
              }
            : s,
        ),
      );

      setEditingService(null);
      showToast("Service listing updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update service:", err);
      showToast(
        err instanceof Error ? err.message : "Failed to update service.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle service delete
  const handleDeleteService = async (serviceId: string) => {
    if (!supabase) return;
    setIsSaving(true);

    try {
      // Get the current session token to authenticate the API request
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error("You are not logged in. Please log in and try again.");
      }

      // Call the server-side API route which uses the admin client to bypass RLS
      const response = await fetch("/api/services/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete service.");
      }

      // Update state locally to immediately reflect the deletion in the UI
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      setEditingService(null);
      showToast("Service listing deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete service:", err);
      showToast(
        err instanceof Error ? err.message : "Failed to delete service.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate stats
  const totalServices = services.length;
  const totalViews = services.reduce((sum, s) => sum + (s.views_count || 0), 0);
  const totalLikes = services.reduce((sum, s) => sum + (s.likes_count || 0), 0);
  const ratedServices = services.filter((s) => (s.reviews_count || 0) > 0);
  const avgRating =
    ratedServices.length > 0
      ? parseFloat(
          (
            ratedServices.reduce((sum, s) => sum + (s.rating_average || 0), 0) /
            ratedServices.length
          ).toFixed(1),
        )
      : 0.0;
  const totalReviews = services.reduce(
    (sum, s) => sum + (s.reviews_count || 0),
    0,
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500 mt-3">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-slate-800">Load Error</h2>
          <p className="text-sm text-slate-500 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <WelcomeHeader
        userName={user?.user_metadata?.full_name || "Tutor"}
        onAddService={() => router.push("/dashboard/create-service")}
      />

      <AnalyticsCard
        totalServices={totalServices}
        totalViews={totalViews}
        totalLikes={totalLikes}
        averageRating={avgRating}
        totalReviews={totalReviews}
      />

      <AllServices
        services={services}
        onEdit={setEditingService}
        onView={setViewingService}
        onAddService={() => router.push("/dashboard/create-service")}
      />

      <RecentReviews reviews={reviews} />

      <FAB onClick={() => router.push("/dashboard/create-service")} />

      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeleteService}
          isSaving={isSaving}
        />
      )}

      {viewingService && (
        <ViewServiceModal
          service={viewingService}
          onClose={() => setViewingService(null)}
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl text-xs font-bold whitespace-nowrap"
          >
            {toast.type === "success" ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 hover:text-slate-350 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
