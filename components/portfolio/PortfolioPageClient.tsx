"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Phone, Heart, ShieldCheck, ArrowLeft } from "lucide-react";

import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import PortfolioHero from "./PortfolioHero";
import PortfolioInfo from "./PortfolioInfo";
import PortfolioContact from "./PortfolioContact";
import PortfolioReviews from "./PortfolioReviews";
import PortfolioProvider from "./PortfolioProvider";

interface ReviewItem {
  id: string;
  user_id?: string;
  rating: number;
  review: string | null;
  created_at: string;
  users?: {
    full_name: string;
  };
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
  likes_count: number;
  contact_numbers?: string[];
  created_at: string;
  users?: {
    full_name: string;
    location: string | null;
    about: string | null;
    phone_no: string | null;
    created_at?: string;
    social_links?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      youtube?: string;
      website?: string;
    };
  };
  service_analytics?: {
    total_views: number;
    total_likes: number;
    total_contacts: number;
  } | null;
}

interface PortfolioPageClientProps {
  initialService: ServiceData;
  initialReviews: ReviewItem[];
  portfolioId: string;
}

export default function PortfolioPageClient({
  initialService,
  initialReviews,
  portfolioId,
}: PortfolioPageClientProps) {
  void portfolioId;
  // Theme state - default to dark mode
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Use useLayoutEffect to avoid setState warning
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          setDarkMode(savedTheme === "dark");
        } else {
          setDarkMode(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  // Auth & Interactions
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState("");

  // DB Sync States
  const [likesCount, setLikesCount] = useState(
    initialService.service_analytics?.total_likes ??
      initialService.likes_count ??
      0,
  );
  const [viewsCount, setViewsCount] = useState(
    initialService.service_analytics?.total_views ?? 0,
  );
  const [isLiked, setIsLiked] = useState(false);

  // Reviews States
  const [reviews] = useState<ReviewItem[]>(initialReviews);
  const [reviewsCount] = useState(initialService.reviews_count || 0);
  const [ratingAverage] = useState(initialService.rating_average || 0);

  // Get contact numbers with useMemo
  const activeNumbers = useMemo(() => {
    const numbers = initialService.contact_numbers;
    const phoneNo = initialService.users?.phone_no;

    if (numbers?.length) {
      return numbers;
    }
    if (phoneNo) {
      return [phoneNo];
    }
    return [];
  }, [initialService.contact_numbers, initialService.users]);

  // Theme toggle function
  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  // Check if liked
  const checkIfLiked = useCallback(
    async (accessToken: string) => {
      try {
        const res = await fetch(`/api/likes?serviceId=${initialService.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setIsLiked(data.liked);
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    },
    [initialService.id],
  );

  // Auth Check
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setToken(session.access_token);
        checkIfLiked(session.access_token);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setToken(session.access_token);
        checkIfLiked(session.access_token);
      } else {
        setUser(null);
        setToken(null);
        setIsLiked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkIfLiked]);

  // Log View count
  useEffect(() => {
    const key = `portfolio_view_${initialService.id}`;
    const today = new Date().toISOString().split("T")[0];
    const lastViewed = localStorage.getItem(key);

    if (lastViewed !== today) {
      fetch("/api/portfolio-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: initialService.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem(key, today);
            setViewsCount((prev) => prev + 1);
          }
        })
        .catch((err) => console.error("Error logging portfolio view:", err));
    }
  }, [initialService.id]);

  // Toggle Like
  const handleLikeToggle = async () => {
    if (!user || !token) {
      setAuthModalReason("save this service to your favorites list");
      setShowAuthModal(true);
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: initialService.id,
          action: nextState ? "like" : "unlike",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLikesCount(data.likesCount);
      } else {
        setIsLiked(!nextState);
        setLikesCount((prev) =>
          !nextState ? prev + 1 : Math.max(0, prev - 1),
        );
      }
    } catch (err) {
      console.error("Like toggle error:", err);
      setIsLiked(!nextState);
      setLikesCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const cleanNumber = (num: string) => num.replace(/\D/g, "");

  return (
    <div
      className={`min-h-screen font-sans pb-28 transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Header Navigation */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
          darkMode
            ? "bg-slate-900/90 border-slate-800 text-white"
            : "bg-white/90 border-slate-200 text-slate-900"
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Left: Big Visible GullyGig Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src={darkMode ? "/logo_light.png" : "/logo_dark.png"}
                alt="GullyGig"
                width={74}
                height={74}
                className="object-contain w-full h-full"
                priority
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-500 font-bold text-xs uppercase px-3 py-1.5 rounded-full border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Portfolio Showcase
            </span>

            <button
              onClick={handleLikeToggle}
              className={`border font-semibold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                isLiked
                  ? "text-red-500 border-red-500/30 bg-red-500/10"
                  : darkMode
                    ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
              title={isLiked ? "Saved" : "Save"}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="hidden sm:inline">
                {isLiked ? "Saved" : "Save"}
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className={`border font-semibold text-xs sm:text-sm p-2.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Theme"
            >
              {mounted ? (
                darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            <Link
              href="/explore"
              className={`border font-semibold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shadow-sm ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Explore Gigs</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        {/* HERO SECTION */}
        <PortfolioHero
          title={initialService.title}
          category={initialService.category}
          city={initialService.city}
          area={initialService.area}
          ratingAverage={ratingAverage}
          reviewsCount={reviewsCount}
          startingPrice={initialService.starting_price}
          priceUnit={initialService.price_unit}
          viewsCount={viewsCount}
          likesCount={likesCount}
          darkMode={darkMode}
          providerName={initialService.users?.full_name}
          providerAbout={initialService.users?.about}
          contactNumbers={activeNumbers}
          languages={initialService.languages}
          availability={initialService.availability}
          isLiked={isLiked}
          onLikeToggle={handleLikeToggle}
        />

        {/* MAIN 12-COL CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Showcase & Reviews */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <PortfolioInfo
              description={initialService.description}
              serviceModes={initialService.service_modes}
              languages={initialService.languages}
              availability={initialService.availability}
              startingPrice={initialService.starting_price}
              priceUnit={initialService.price_unit}
              darkMode={darkMode}
            />

            <PortfolioReviews
              reviews={reviews}
              ratingAverage={ratingAverage}
              reviewsCount={reviewsCount}
              darkMode={darkMode}
              serviceId={initialService.id}
              token={token}
              onRequestAuth={() => {
                setAuthModalReason("write a verified client review");
                setShowAuthModal(true);
              }}
            />
          </div>

          {/* Right Column (4 cols): Direct Contact & Provider Profile */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8 sticky top-24">
            <PortfolioContact
              contactNumbers={activeNumbers}
              serviceTitle={initialService.title}
              darkMode={darkMode}
              socialLinks={initialService.users?.social_links}
            />

            {initialService.users && (
              <PortfolioProvider
                fullName={initialService.users.full_name}
                location={initialService.users.location}
                about={initialService.users.about}
                memberSince={
                  initialService.users.created_at
                    ? new Date(initialService.users.created_at)
                        .getFullYear()
                        .toString()
                    : "2024"
                }
                languages={initialService.languages}
                availability={initialService.availability}
                rating={ratingAverage}
                totalReviews={reviewsCount}
                totalServices={1}
                isVerified={true}
                darkMode={darkMode}
                socialLinks={initialService.users?.social_links}
              />
            )}
          </div>
        </div>
      </main>

      {/* STICKY MOBILE ACTION BAR */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 backdrop-blur-xl border p-3 rounded-2xl flex items-center justify-between gap-4 shadow-2xl transition-all duration-300 ${
          darkMode
            ? "bg-slate-900/95 border-slate-800 text-white"
            : "bg-white/95 border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex flex-col text-left pl-1">
          <span
            className={`text-[9px] font-extrabold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Starting Rate
          </span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
            {initialService.starting_price
              ? `₹${initialService.starting_price}`
              : "Enquire"}
            {initialService.starting_price && initialService.price_unit && (
              <span
                className={`text-[10px] font-normal ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {" "}
                /{" "}
                {initialService.price_unit
                  .replace(/^per\s+/i, "")
                  .toLowerCase()}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLikeToggle}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              isLiked
                ? "bg-red-500/10 border-red-500/20 text-red-500"
                : darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
            title="Save to Favorites"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          {activeNumbers.length > 0 && (
            <a
              href={`tel:${cleanNumber(activeNumbers[0])}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          )}
        </div>
      </div>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAuthModal(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
          />
          <div
            className={`relative w-full max-w-sm border rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 text-center ${
              darkMode
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold">Account Required</h3>
              <p
                className={`text-xs leading-relaxed ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Please log in or register a free account to {authModalReason}.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href={`/Auth?redirect=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.pathname : "",
                )}`}
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition text-center"
              >
                Log In
              </a>
              <a
                href={`/Auth?mode=register&redirect=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.pathname : "",
                )}`}
                className={`w-full py-2.5 text-xs font-bold border rounded-xl transition text-center ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                }`}
              >
                Create Account
              </a>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className={`text-xs font-semibold cursor-pointer ${
                darkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
