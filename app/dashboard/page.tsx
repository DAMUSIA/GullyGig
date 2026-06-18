"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ServiceUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [viewingService, setViewingService] = useState<ServiceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { user: currentUser } = (await getCurrentUser()) as { user: ServiceUser | null };
        if (!currentUser) {
          router.push("/login");
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
        setServices(servicesData as ServiceItem[] || []);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("service_ratings")
          .select("*, services!inner(title, user_id), users:user_id(full_name)")
          .eq("services.user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!reviewsError && reviewsData) {
          setReviews(reviewsData as ServiceReview[] || []);
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
      alert("Title must be at least 3 characters.");
      return;
    }
    if (data.description.trim().length < 20) {
      alert("Description must be at least 20 characters.");
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
            : s
        )
      );

      setEditingService(null);
      alert("Service updated successfully!");
    } catch (err) {
      console.error("Failed to update service:", err);
      alert(err instanceof Error ? err.message : "Failed to update service.");
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
          ).toFixed(1)
        )
      : 0.0;
  const totalReviews = services.reduce((sum, s) => sum + (s.reviews_count || 0), 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500 mt-3">Loading your dashboard...</p>
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
          isSaving={isSaving}
        />
      )}

      {viewingService && (
        <ViewServiceModal
          service={viewingService}
          onClose={() => setViewingService(null)}
        />
      )}
    </div>
  );
}