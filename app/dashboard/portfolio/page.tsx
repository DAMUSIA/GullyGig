"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  ExternalLink,
  Sparkles,
  BarChart3,
  Loader2,
  AlertCircle,
  Eye,
  Heart,
  MessageSquare,
  Star,
  FileImage,
  CheckCircle,
  X,
} from "lucide-react";
import { getCurrentUser, supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  area: string | null;
  starting_price: number | null;
  price_unit: string | null;
  contact_numbers?: string[];
  service_analytics?: {
    total_views: number;
    total_likes: number;
    total_reviews: number;
    average_rating: number;
    portfolio_views: number;
  } | null;
}

export default function DashboardPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [posterLoading, setPosterLoading] = useState(false);
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

  useEffect(() => {
    async function loadPortfolioServices() {
      try {
        setLoading(true);
        const { user } = (await getCurrentUser()) as {
          user: { id: string } | null;
        };
        if (!user) {
          router.push("/Auth");
          return;
        }

        if (!supabase) throw new Error("Supabase is not configured.");

        const { data, error: fetchError } = await supabase
          .from("services")
          .select("*, service_analytics(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const formatted = ((data as Record<string, unknown>[]) || []).map(
          (s) => {
            let analytics = null;
            if (s.service_analytics) {
              analytics = Array.isArray(s.service_analytics)
                ? s.service_analytics[0]
                : s.service_analytics;
            }
            return {
              ...s,
              service_analytics: analytics,
            } as ServiceItem;
          },
        );

        setServices(formatted);

        if (formatted.length > 0) {
          setSelectedServiceId(formatted[0].id);
        }
      } catch (err: unknown) {
        console.error("Dashboard portfolio loading error:", err);
        setError("Failed to load your services. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioServices();
  }, [router]);

  const activeService = services.find((s) => s.id === selectedServiceId);





  if (loading) {
    return (
      <div className="space-y-6 pb-20 max-w-[1200px] mx-auto animate-pulse">
        {/* Selector and Main Head Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-3xl h-24 shadow-xs">
          <div className="h-6 bg-slate-200 rounded-lg w-48" />
          <div className="h-10 bg-slate-200 rounded-xl w-60" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shareable Link Box Skeleton */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 h-56 shadow-xs space-y-4">
              <div className="h-5 bg-slate-200 rounded-lg w-32" />
              <div className="h-4 bg-slate-200 rounded-lg w-full" />
              <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
              <div className="h-12 bg-slate-200 rounded-2xl w-full" />
            </div>
            {/* Poster Launch Box Skeleton */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 h-36 shadow-xs flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-lg w-40" />
                <div className="h-4 bg-slate-200 rounded-lg w-64" />
              </div>
              <div className="h-12 bg-slate-200 rounded-2xl w-36" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 h-[400px] shadow-xs space-y-4">
            <div className="h-5 bg-slate-200 rounded-lg w-44" />
            <div className="h-20 bg-slate-100 border border-slate-200/40 rounded-2xl" />
            <div className="h-20 bg-slate-100 border border-slate-200/40 rounded-2xl" />
            <div className="h-20 bg-slate-100 border border-slate-200/40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xl max-w-md w-full text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-slate-800">
            Unable to load Portfolio page
          </h2>
          <p className="text-sm text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-10 max-w-3xl w-full shadow-xs space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100/40">
            <Globe className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-800">
              No Services Available
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              You must create a tutoring service listing before you can generate
              public portfolios or download advertising posters.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/create-service")}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-2xl transition"
          >
            Create Your First Service
          </button>
        </div>
      </div>
    );
  }

  const stats = activeService?.service_analytics || {
    portfolio_views: 0,
    total_views: 0,
    total_likes: 0,
    total_reviews: 0,
    average_rating: 0,
  };

  return (
    <div className="space-y-6 pb-20 max-w-[1200px] mx-auto">
      {/* Selector and Main Head */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">
            My Public Portfolios
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a service to manage sharing and posters
          </p>
        </div>

        <div className="min-w-[240px]">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 cursor-pointer"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeService && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Link sharing and poster generation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Link Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <Globe className="h-4.5 w-4.5 text-blue-600" />
                Portfolio Link
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                This public, shareable URL displays your service details,
                languages, pricing, contact buttons, reviews, and a scan-to-call
                QR code. Perfect for sharing on WhatsApp status or social media.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => showToast("View Portfolio feature is currently under maintenance.", "error")}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition cursor-pointer active:scale-95 shadow-md shadow-blue-500/10"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Portfolio</span>
                </button>
              </div>
            </div>

            {/* Poster Launch Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-5 justify-between">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-600">
                  <Sparkles className="h-4.5 w-4.5" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Ad Poster Generator
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Generate Service Poster
                </h3>
                <p className="text-xs text-slate-500 max-w leading-relaxed font-medium">
                  Create a beautifully styled marketing poster of your listing
                  containing a QR code, contact information, pricing tags, and
                  operations structure. Save as PNG.
                </p>
              </div>

              <button
                onClick={() => {
                  setPosterLoading(true);
                  router.push(`/dashboard/portfolio/poster/${activeService.id}`);
                }}
                disabled={posterLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition cursor-pointer active:scale-95 shrink-0 shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posterLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileImage className="h-4 w-4" />
                )}
                <span>{posterLoading ? "Generating..." : "Generate Poster"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Analytics Metrics summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5 text-blue-600" />
              Portfolio Performance
            </h3>

            <div className="space-y-4">
              {/* Portfolio views */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Portfolio Views
                  </span>
                  <span className="text-lg font-black text-slate-850 mt-0.5">
                    {stats.portfolio_views || 0}
                  </span>
                </div>
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
              </div>

              {/* App Views */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    App/Marketplace Views
                  </span>
                  <span className="text-lg font-black text-slate-850 mt-0.5">
                    {stats.total_views || 0}
                  </span>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
              </div>

              {/* Likes */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Likes / Saves
                  </span>
                  <span className="text-lg font-black text-slate-850 mt-0.5">
                    {stats.total_likes || 0}
                  </span>
                </div>
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 fill-red-500/10" />
                </div>
              </div>

              {/* Reviews */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Reviews
                  </span>
                  <span className="text-lg font-black text-slate-850 mt-0.5">
                    {stats.total_reviews || 0}
                  </span>
                </div>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>

              {/* Rating */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Average Rating
                  </span>
                  <span className="text-lg font-black text-slate-850 mt-0.5 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 inline" />
                    {stats.average_rating
                      ? stats.average_rating.toFixed(1)
                      : "0.0"}
                  </span>
                </div>
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 fill-amber-55/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
