"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioInfo from "@/components/portfolio/PortfolioInfo";
import PortfolioContact from "@/components/portfolio/PortfolioContact";
import PortfolioReviews from "@/components/portfolio/PortfolioReviews";
import PortfolioProvider from "@/components/portfolio/PortfolioProvider";
import PortfolioQR from "@/components/portfolio/PortfolioQR";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ServiceData {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  service_modes: string[];
  city: string;
  area: string | null;
  availability: string[];
  languages: string[];
  starting_price: number | null;
  price_unit: string | null;
  rating_average: number;
  reviews_count: number;
  contact_numbers?: string[];
  users?: {
    full_name: string;
    location: string | null;
    about: string | null;
    phone_no: string | null;
  };
}

interface ReviewItem {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  users?: {
    full_name: string;
  };
}

export default function PublicPortfolioPage({ params }: PageProps) {
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [service, setService] = useState<ServiceData | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap route params
  useEffect(() => {
    params.then((res) => setServiceId(res.id)).catch(() => setError("Invalid portfolio URL"));
  }, [params]);

  // Load service details
  useEffect(() => {
    if (!serviceId) return;

    async function loadPortfolioData() {
      try {
        setLoading(true);
        if (!supabase) throw new Error("Supabase is not configured.");

        // Fetch service and user profile
        const { data: serviceData, error: serviceError } = await supabase
          .from("services")
          .select("*, users:user_id(full_name, location, about, phone_no)")
          .eq("id", serviceId)
          .single();

        if (serviceError) {
          throw new Error("Service not found or has been deleted.");
        }

        setService(serviceData as ServiceData);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("service_ratings")
          .select("*, users:user_id(full_name)")
          .eq("service_id", serviceId)
          .order("created_at", { ascending: false });

        if (!reviewsError && reviewsData) {
          setReviews(reviewsData as ReviewItem[]);
        }
      } catch (err: any) {
        console.error("Error loading portfolio:", err);
        setError(err.message || "Failed to load portfolio details.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, [serviceId]);

  // Daily Unique View Tracking
  useEffect(() => {
    if (!serviceId) return;

    const key = `portfolio_view_${serviceId}`;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const lastViewed = localStorage.getItem(key);

    if (lastViewed !== today) {
      fetch("/api/portfolio-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem(key, today);
          }
        })
        .catch((err) => console.error("Error logging portfolio view:", err));
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading portfolio details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-slate-800">Portfolio Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {error || "The service portfolio you are looking for does not exist or has been deactivated."}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    );
  }

  // Get current hostname for QR code URL
  const currentHost = typeof window !== "undefined" ? window.location.origin : "https://kaamao.com";
  const portfolioUrl = `${currentHost}/p/${service.id}`;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">Kaamao</span>
          </a>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
            Public Profile
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. Hero Block */}
        <PortfolioHero
          title={service.title}
          category={service.category}
          city={service.city}
          area={service.area}
          ratingAverage={service.rating_average || 0}
          reviewsCount={service.reviews_count || 0}
          startingPrice={service.starting_price}
          priceUnit={service.price_unit}
        />

        {/* 2. Info Cards Block */}
        <PortfolioInfo
          description={service.description}
          serviceModes={service.service_modes}
          languages={service.languages}
          availability={service.availability}
        />

        {/* 3. Contact Details Block */}
        <PortfolioContact
          contactNumbers={service.contact_numbers || []}
          fallbackPhone={service.users?.phone_no || null}
          serviceTitle={service.title}
          startingPrice={service.starting_price}
          location={[service.area, service.city].filter(Boolean).join(", ")}
          portfolioUrl={portfolioUrl}
        />

        {/* 4. Provider Bio Block */}
        {service.users && (
          <PortfolioProvider
            fullName={service.users.full_name}
            location={service.users.location}
            about={service.users.about}
          />
        )}

        {/* 5. Reviews Block */}
        <PortfolioReviews
          reviews={reviews}
          ratingAverage={service.rating_average || 0}
          reviewsCount={service.reviews_count || 0}
        />

        {/* 6. Footer QR Block */}
        <PortfolioQR portfolioUrl={portfolioUrl} />
      </main>
    </div>
  );
}
