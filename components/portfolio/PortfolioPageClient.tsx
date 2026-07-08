"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Sun,
  Moon,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Copy,
  Check,
  QrCode,
  Send,
  Download,
  ShieldCheck,
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getBaseUrl, getPortfolioUrl } from "@/lib/url";
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
  // Theme state - default to dark mode
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Use useLayoutEffect to avoid setState warning
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Use a timeout to avoid the setState warning
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

  // Reviews States - keep these for future use
  const [reviews] = useState<ReviewItem[]>(initialReviews);
  const [reviewsCount] = useState(initialService.reviews_count || 0);
  const [ratingAverage] = useState(initialService.rating_average || 0);

  // UI helpers
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  // Generate portfolio URL
  const portfolioUrl = getPortfolioUrl(portfolioId, initialService.title);

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

  // Generate QR code URL with useMemo
  const qrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portfolioUrl)}`;
  }, [portfolioUrl]);

  // Share text with useMemo
  const shareText = useMemo(() => {
    const baseUrl = getBaseUrl();
    const fullPortfolioUrl = `${baseUrl}/p/${initialService.id}`;

    const providerName = initialService.users?.full_name || "Verified Provider";
    const location =
      [initialService.area, initialService.city].filter(Boolean).join(", ") ||
      "Available online";
    const price = initialService.starting_price
      ? `₹${initialService.starting_price}${initialService.price_unit ? ` / ${initialService.price_unit.toLowerCase()}` : ""}`
      : "Contact for pricing";
    const rating = ratingAverage ? `${ratingAverage.toFixed(1)} ⭐` : "New";
    const reviewsText = reviewsCount
      ? `${reviewsCount} reviews`
      : "No reviews yet";

    const modes =
      initialService.service_modes.length > 0
        ? `\n📍 Service Modes: ${initialService.service_modes.join(", ")}`
        : "";

    const availabilityText =
      initialService.availability.length > 0
        ? `\n📅 Availability: ${initialService.availability.join(", ")}`
        : "";

    const languagesText =
      initialService.languages.length > 0
        ? `\n🌐 Languages: ${initialService.languages.join(", ")}`
        : "";

    const description = initialService.description
      ? `\n\n📝 "${initialService.description.substring(0, 120)}${initialService.description.length > 120 ? "..." : ""}"`
      : "";

    return `🔹 *${initialService.title}* 🔹
━━━━━━━━━━━━━━━━━━━━━━
👤 Provider: ${providerName}
📂 Category: ${initialService.category}
📍 Location: ${location}
⭐ Rating: ${rating} (${reviewsText})
💰 Price: ${price}${modes}${availabilityText}${languagesText}${description}
━━━━━━━━━━━━━━━━━━━━━━
📞 Contact: ${activeNumbers.length > 0 ? activeNumbers[0] : "Available on portfolio"}
🔗 View Full Portfolio:
${fullPortfolioUrl}
━━━━━━━━━━━━━━━━━━━━━━
#${initialService.category.replace(/\s/g, "")} #GullyGig #LocalServices ${initialService.city ? `#${initialService.city.replace(/\s/g, "")}` : ""}`;
  }, [initialService, ratingAverage, reviewsCount, activeNumbers]);

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

  // Share handlers
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: initialService.title,
          text: shareText,
          url: portfolioUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      setShowShareDropdown(!showShareDropdown);
    }
  };

  const copyPortfolioUrl = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // QR Code Download
  const downloadQrCode = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(portfolioUrl)}`;

    img.onload = () => {
      canvas.width = 340;
      canvas.height = 400;
      if (!ctx) return;

      if (darkMode) {
        // Dark mode QR background
        const gradient = ctx.createLinearGradient(0, 0, 340, 400);
        gradient.addColorStop(0, "#0A1F3D");
        gradient.addColorStop(0.5, "#102B54");
        gradient.addColorStop(1, "#061528");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(214,179,106,0.35)";
      } else {
        // Light mode QR background
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "rgba(37,99,235,0.2)";
      }
      ctx.fillRect(0, 0, 340, 400);

      // Border
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, 310, 370);

      // QR Code
      ctx.drawImage(img, 20, 30, 300, 300);

      // Text
      ctx.fillStyle = darkMode ? "#FFFFFF" : "#111827";
      ctx.font = "bold 16px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to View Portfolio", 170, 370);
      ctx.fillStyle = darkMode
        ? "rgba(255,255,255,0.4)"
        : "rgba(107,114,128,0.6)";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillText("GullyGig Premium Service", 170, 392);

      const link = document.createElement("a");
      link.download = `${initialService.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-['Inter'] pb-28 ${
        darkMode
          ? "bg-[#061528] text-white"
          : "bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EEF5FB] text-[#111827]"
      }`}
    >
      {/* Theme Switcher */}
      <div
        className={`max-w-[1400px] mx-auto px-8 pt-6 flex justify-end gap-3 items-center transition-all duration-300`}
      >
        <span
          className={`text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs transition-all duration-300 ${
            darkMode
              ? "text-white/40 bg-white/5 backdrop-blur-sm border border-white/10"
              : "text-[#6B7280] bg-white/80 backdrop-blur-sm border border-[#E5E7EB]"
          }`}
        >
          GullyGig Service Hub
        </span>
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all duration-300 shadow-xs cursor-pointer ${
            darkMode
              ? "bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 hover:bg-white/10"
              : "bg-white/80 backdrop-blur-sm border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC]"
          }`}
          title="Toggle Theme"
        >
          {mounted ? (
            darkMode ? (
              <Sun className="h-5 w-5 text-[#D6B36A]" />
            ) : (
              <Moon className="h-5 w-5 text-[#2563EB]" />
            )
          ) : (
            <div className="h-5 w-5" />
          )}
        </button>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 mt-6 space-y-6">
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
        />

        {/* MAIN COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            {/* ABOUT SERVICE */}
            <PortfolioInfo
              description={initialService.description}
              serviceModes={initialService.service_modes}
              languages={initialService.languages}
              availability={initialService.availability}
            />

            {/* CONTACT CARDS */}
            <PortfolioContact
              contactNumbers={activeNumbers}
              serviceTitle={initialService.title}
            />

            {/* TRUST STATISTICS */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                className={`p-5 rounded-2xl text-center hover:scale-[1.02] transition duration-200 ${
                  darkMode
                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#D6B36A]/20"
                    : "bg-white/80 backdrop-blur-sm border border-[#E5E7EB] hover:border-[#2563EB]/20 shadow-sm"
                }`}
              >
                <span
                  className={`text-2xl font-['Space_Grotesk'] font-black block transition-all duration-300 ${
                    darkMode ? "text-white" : "text-[#111827]"
                  }`}
                >
                  {viewsCount}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 block transition-all duration-300 ${
                    darkMode ? "text-white/40" : "text-[#6B7280]"
                  }`}
                >
                  Views
                </span>
              </div>
              <div
                className={`p-5 rounded-2xl text-center hover:scale-[1.02] transition duration-200 ${
                  darkMode
                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#D6B36A]/20"
                    : "bg-white/80 backdrop-blur-sm border border-[#E5E7EB] hover:border-[#2563EB]/20 shadow-sm"
                }`}
              >
                <span
                  className={`text-2xl font-['Space_Grotesk'] font-black block transition-all duration-300 ${
                    darkMode ? "text-[#D6B36A]" : "text-[#2563EB]"
                  }`}
                >
                  {likesCount}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 block transition-all duration-300 ${
                    darkMode ? "text-white/40" : "text-[#6B7280]"
                  }`}
                >
                  Likes
                </span>
              </div>
              <div
                className={`p-5 rounded-2xl text-center hover:scale-[1.02] transition duration-200 ${
                  darkMode
                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#D6B36A]/20"
                    : "bg-white/80 backdrop-blur-sm border border-[#E5E7EB] hover:border-[#2563EB]/20 shadow-sm"
                }`}
              >
                <span
                  className={`text-2xl font-['Space_Grotesk'] font-black block transition-all duration-300 ${
                    darkMode ? "text-[#27C7C5]" : "text-[#14B8A6]"
                  }`}
                >
                  {reviewsCount}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 block transition-all duration-300 ${
                    darkMode ? "text-white/40" : "text-[#6B7280]"
                  }`}
                >
                  Reviews
                </span>
              </div>
              <div
                className={`p-5 rounded-2xl text-center hover:scale-[1.02] transition duration-200 ${
                  darkMode
                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#D6B36A]/20"
                    : "bg-white/80 backdrop-blur-sm border border-[#E5E7EB] hover:border-[#2563EB]/20 shadow-sm"
                }`}
              >
                <span
                  className={`text-2xl font-['Space_Grotesk'] font-black block flex items-center justify-center gap-1 transition-all duration-300 ${
                    darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"
                  }`}
                >
                  ⭐ {ratingAverage.toFixed(1)}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 block transition-all duration-300 ${
                    darkMode ? "text-white/40" : "text-[#6B7280]"
                  }`}
                >
                  Avg Rating
                </span>
              </div>
            </section>

            {/* REVIEWS */}
            <PortfolioReviews
              reviews={reviews}
              ratingAverage={ratingAverage}
              reviewsCount={reviewsCount}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* PROVIDER PROFILE */}
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
              />
            )}

            {/* QR CODE */}
            <div
              className={`relative overflow-hidden rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-250 group ${
                darkMode
                  ? "bg-gradient-to-br from-[#0A1F3D] via-[#102B54] to-[#061528] border border-[#D6B36A]/20 hover:border-[#D6B36A]/40"
                  : "bg-white border border-[#E5E7EB] hover:border-[#2563EB]/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
              }`}
            >
              {/* Background decorative elements */}
              <div
                className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                  darkMode ? "bg-[#5BE7FF]/5" : "bg-[#2563EB]/5"
                }`}
              />
              <div
                className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                  darkMode ? "bg-[#D6B36A]/5" : "bg-[#D4AF37]/5"
                }`}
              />

              {/* Thin glowing lines */}
              <div
                className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${
                  darkMode ? "[#D6B36A]" : "[#2563EB]"
                }/20 to-transparent`}
              />
              <div
                className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${
                  darkMode ? "[#5BE7FF]" : "[#14B8A6]"
                }/10 to-transparent`}
              />

              <div className="relative z-10 flex flex-col items-center gap-5">
                {/* Header */}
                <div
                  className={`flex items-center gap-2 ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"}`}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="text-xs font-['Inter'] font-semibold uppercase tracking-[1.5px]">
                    Premium QR
                  </span>
                </div>

                <h4
                  className={`text-lg font-['Poppins'] font-semibold text-center transition-all duration-300 ${
                    darkMode ? "text-white" : "text-[#111827]"
                  }`}
                >
                  Scan to View Portfolio
                </h4>

                {/* QR Code Container */}
                <div className="relative">
                  <div
                    className={`absolute -inset-1 rounded-2xl blur-sm ${
                      darkMode
                        ? "bg-gradient-to-r from-[#D6B36A]/20 via-[#5BE7FF]/10 to-[#D6B36A]/20"
                        : "bg-gradient-to-r from-[#2563EB]/20 via-[#14B8A6]/10 to-[#2563EB]/20"
                    }`}
                  />
                  <div
                    className={`relative p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
                      darkMode
                        ? "bg-white border border-[#D6B36A]/10"
                        : "bg-white border border-[#E5E7EB]"
                    }`}
                  >
                    {qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        width={160}
                        height={160}
                        className="rounded-xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-[160px] h-[160px] bg-gray-200 rounded-xl animate-pulse" />
                    )}
                  </div>
                  {/* Corner accents */}
                  <div
                    className={`absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg ${
                      darkMode ? "border-[#D6B36A]/30" : "border-[#2563EB]/30"
                    }`}
                  />
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg ${
                      darkMode ? "border-[#D6B36A]/30" : "border-[#2563EB]/30"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg ${
                      darkMode ? "border-[#D6B36A]/30" : "border-[#2563EB]/30"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 rounded-br-lg ${
                      darkMode ? "border-[#D6B36A]/30" : "border-[#2563EB]/30"
                    }`}
                  />
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadQrCode}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-['Inter'] font-semibold rounded-2xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/10 hover:shadow-[0_0_20px_rgba(214,179,106,0.15)]"
                      : "bg-[#F8FAFC] hover:bg-[#EEF5FB] text-[#111827] border-[#E5E7EB] hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Download QR
                </button>
              </div>
            </div>

            {/* SHARE SECTION */}
            <section
              className={`rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-250 space-y-5 ${
                darkMode
                  ? "bg-[#0F2344] border border-white/10"
                  : "bg-[#FFFFFF] border border-[#E5E7EB]"
              }`}
            >
              <div>
                <h3
                  className={`text-sm font-['Poppins'] font-semibold flex items-center gap-2 transition-all duration-300 ${
                    darkMode ? "text-white" : "text-[#111827]"
                  }`}
                >
                  <Share2
                    className={`h-4 w-4 ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"}`}
                  />
                  Share Portfolio
                </h3>
                <p
                  className={`text-xs mt-1 font-['Inter'] transition-all duration-300 ${
                    darkMode ? "text-[#94A7C4]" : "text-[#6B7280]"
                  }`}
                >
                  Promote this service across social networks
                </p>
              </div>

              {mounted && (
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-['Inter'] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white"
                        : "bg-[#F8FAFC] hover:bg-[#EEF5FB] border border-[#E5E7EB] text-[#374151] hover:text-[#111827]"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-['Inter'] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white"
                        : "bg-[#F8FAFC] hover:bg-[#EEF5FB] border border-[#E5E7EB] text-[#374151] hover:text-[#111827]"
                    }`}
                  >
                    <Send className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-['Inter'] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white"
                        : "bg-[#F8FAFC] hover:bg-[#EEF5FB] border border-[#E5E7EB] text-[#374151] hover:text-[#111827]"
                    }`}
                  >
                    <svg
                      className="h-4 w-4 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-['Inter'] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white"
                        : "bg-[#F8FAFC] hover:bg-[#EEF5FB] border border-[#E5E7EB] text-[#374151] hover:text-[#111827]"
                    }`}
                  >
                    <svg
                      className="h-4 w-4 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              )}

              <button
                onClick={copyPortfolioUrl}
                className={`w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-['Inter'] font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                    : "bg-[#F8FAFC] hover:bg-[#EEF5FB] text-[#374151] hover:text-[#111827] border border-[#E5E7EB]"
                }`}
              >
                {copiedUrl ? (
                  <>
                    <Check
                      className={`h-4 w-4 ${darkMode ? "text-[#27C7C5]" : "text-[#14B8A6]"}`}
                    />
                    <span
                      className={darkMode ? "text-[#27C7C5]" : "text-[#14B8A6]"}
                    >
                      Link Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Portfolio Link</span>
                  </>
                )}
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* STICKY ACTION BAR */}
      <div
        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-auto sm:max-w-2xl z-50 backdrop-blur-2xl backdrop-saturate-150 border p-3 sm:px-5 sm:py-3 rounded-full flex items-center justify-between sm:gap-6 animate-in slide-in-from-bottom duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${
          darkMode
            ? "bg-white/10 border-white/10"
            : "bg-white/80 border-[#E5E7EB]"
        }`}
      >
        <div className="flex flex-col text-left pl-2 sm:pl-0 relative z-10">
          <span
            className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
              darkMode ? "text-white/50" : "text-[#6B7280]"
            }`}
          >
            STARTING AT
          </span>
          <span
            className={`text-sm sm:text-base font-['Space_Grotesk'] font-black transition-all duration-300 ${
              darkMode ? "text-[#D6B36A]" : "text-[#2563EB]"
            }`}
          >
            {initialService.starting_price
              ? `₹${initialService.starting_price}`
              : "Enquire"}
            {initialService.starting_price && initialService.price_unit && (
              <span
                className={`text-[9px] sm:text-[10px] font-normal transition-all duration-300 ${
                  darkMode ? "text-white/40" : "text-[#6B7280]"
                }`}
              >
                {" "}
                / {initialService.price_unit.replace("per ", "").toLowerCase()}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
          <button
            onClick={handleLikeToggle}
            className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 active:scale-90 cursor-pointer backdrop-blur-sm ${
              isLiked
                ? darkMode
                  ? "bg-red-500/20 border border-red-500/30 text-red-500 hover:bg-red-500/30"
                  : "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                : darkMode
                  ? "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-red-400"
                  : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] hover:text-red-500"
            }`}
            title="Like this Service"
          >
            <Heart
              className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform duration-200 hover:scale-110 ${
                isLiked ? "fill-red-500" : ""
              }`}
            />
          </button>

          <button
            onClick={handleNativeShare}
            className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 active:scale-90 cursor-pointer relative backdrop-blur-sm ${
              darkMode
                ? "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-[#D6B36A]"
                : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            }`}
            title="Share portfolio"
          >
            <Share2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform duration-200 hover:scale-110" />

            {showShareDropdown && (
              <div
                className={`absolute bottom-14 right-0 backdrop-blur-xl border rounded-2xl p-2.5 shadow-2xl w-48 flex flex-col gap-1 z-50 text-left ${
                  darkMode
                    ? "bg-[#0A1F3D]/90 border-white/10"
                    : "bg-white/90 border-[#E5E7EB]"
                }`}
              >
                <button
                  onClick={() => {
                    copyPortfolioUrl();
                    setShowShareDropdown(false);
                  }}
                  className={`w-full text-xs font-['Inter'] font-semibold p-2 rounded-lg text-left transition-colors ${
                    darkMode
                      ? "text-white/70 hover:bg-white/5"
                      : "text-[#374151] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Copy Link
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full text-xs font-['Inter'] font-semibold p-2 rounded-lg text-left transition-colors ${
                    darkMode
                      ? "text-white/70 hover:bg-white/5"
                      : "text-[#374151] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Share to WhatsApp
                </a>
              </div>
            )}
          </button>

          {activeNumbers.length > 0 && (
            <a
              href={`tel:${cleanNumber(activeNumbers[0])}`}
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 text-xs font-['Inter'] font-bold rounded-full transition-all duration-200 active:scale-95 shadow-lg cursor-pointer backdrop-blur-sm ${
                darkMode
                  ? "bg-gradient-to-r from-[#D6B36A] to-[#C89A3D] hover:from-[#C89A3D] hover:to-[#D6B36A] text-[#061528] shadow-[#D6B36A]/20 hover:shadow-[#D6B36A]/40"
                  : "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] text-white shadow-[#2563EB]/20 hover:shadow-[#2563EB]/40"
              }`}
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-[10px] sm:text-xs">Call Now</span>
            </a>
          )}
        </div>
      </div>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAuthModal(false)}
            className={`absolute inset-0 backdrop-blur-md cursor-pointer ${
              darkMode ? "bg-[#061528]/80" : "bg-[#111827]/40"
            }`}
          />
          <div
            className={`relative w-full max-w-2xl border rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-5 text-center animate-in zoom-in-95 duration-200 ${
              darkMode
                ? "bg-[#0A1F3D] border-white/10"
                : "bg-white border-[#E5E7EB]"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
                darkMode
                  ? "bg-[#D6B36A]/10 text-[#D6B36A] border-[#D6B36A]/20"
                  : "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20"
              }`}
            >
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3
                className={`text-lg font-['Poppins'] font-black transition-all duration-300 ${
                  darkMode ? "text-white" : "text-[#111827]"
                }`}
              >
                Authentication Required
              </h3>
              <p
                className={`text-xs leading-relaxed font-['Inter'] font-medium transition-all duration-300 ${
                  darkMode ? "text-white/50" : "text-[#6B7280]"
                }`}
              >
                You must login or register a GullyGig account to{" "}
                {authModalReason}.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`/Auth?redirect=${encodeURIComponent(window.location.pathname)}`}
                className={`w-full py-3 text-xs font-['Inter'] font-bold rounded-2xl transition shadow-md cursor-pointer ${
                  darkMode
                    ? "bg-gradient-to-r from-[#D6B36A] to-[#C89A3D] hover:from-[#C89A3D] hover:to-[#D6B36A] text-[#061528] shadow-[#D6B36A]/20"
                    : "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] text-white shadow-[#2563EB]/20"
                }`}
              >
                Log In
              </a>
              <a
                href={`/Auth?mode=register&redirect=${encodeURIComponent(window.location.pathname)}`}
                className={`w-full py-3 text-xs font-['Inter'] font-bold rounded-2xl transition border cursor-pointer ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    : "bg-[#F8FAFC] hover:bg-[#EEF5FB] text-[#374151] border-[#E5E7EB]"
                }`}
              >
                Create Free Account
              </a>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className={`text-xs font-['Inter'] font-bold cursor-pointer transition-all duration-300 ${
                darkMode
                  ? "text-white/30 hover:text-white/60"
                  : "text-[#6B7280] hover:text-[#374151]"
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
