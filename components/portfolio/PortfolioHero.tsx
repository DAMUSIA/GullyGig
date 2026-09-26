"use client";

import React, { useState } from "react";
import { Star, MapPin, Tag, ShieldCheck, Eye, Heart } from "lucide-react";

interface PortfolioHeroProps {
  title: string;
  category: string;
  city: string;
  area: string | null;
  ratingAverage: number;
  reviewsCount: number;
  startingPrice: number | null;
  priceUnit: string | null;
  viewsCount?: number;
  likesCount?: number;
  darkMode?: boolean;
}

export default function PortfolioHero({
  title,
  category,
  city,
  area,
  ratingAverage,
  reviewsCount,
  viewsCount = 0,
  likesCount = 0,
  darkMode = false,
}: PortfolioHeroProps) {
  const fullRating = Math.floor(ratingAverage);
  const hasHalfStar = ratingAverage % 1 !== 0;

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop();
  const firstWords = titleParts.join(" ");

  // Generate random positions once on mount
  const [starPositions] = useState(() =>
    Array.from({ length: 20 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.2,
      duration: 2 + Math.random() * 3,
    })),
  );

  const [goldPositions] = useState(() =>
    Array.from({ length: 8 }, () => ({
      top: 10 + Math.random() * 80,
      right: 10 + Math.random() * 80,
      opacity: 0.1 + Math.random() * 0.15,
      duration: 4 + Math.random() * 4,
    })),
  );

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] h-[420px] transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-r from-[#071A35] via-[#0F2D5C] to-[#174A88] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-r from-[#FFFFFF] via-[#EEF6FF] to-[#DCEEFF] border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(37,99,235,0.12)]"
      }`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large flowing wave */}
        <svg
          className={`absolute -bottom-20 -right-20 w-[600px] h-[600px] ${
            darkMode ? "opacity-[0.08]" : "opacity-[0.04]"
          }`}
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M400 0C178.7 0 0 178.7 0 400C0 621.3 178.7 800 400 800C621.3 800 800 621.3 800 400C800 178.7 621.3 0 400 0Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={darkMode ? "#5BE7FF" : "#2563EB"} />
              <stop offset="50%" stopColor={darkMode ? "#27C7C5" : "#14B8A6"} />
              <stop
                offset="100%"
                stopColor={darkMode ? "#D6B36A" : "#D4AF37"}
                stopOpacity="0.5"
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Glass curves with shadow */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            darkMode
              ? "bg-[#5BE7FF] opacity-[0.03]"
              : "bg-[#2563EB] opacity-[0.04]"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl ${
            darkMode
              ? "bg-[#D6B36A] opacity-[0.03]"
              : "bg-[#D4AF37] opacity-[0.03]"
          }`}
        />

        {/* Tiny stars with glow */}
        {starPositions.map((pos, i) => (
          <div
            key={i}
            className={`absolute w-[2px] h-[2px] rounded-full ${
              darkMode ? "bg-white" : "bg-[#2563EB]"
            }`}
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              opacity: pos.opacity,
              animation: `twinkle ${pos.duration}s infinite alternate`,
              boxShadow: darkMode
                ? "0 0 4px rgba(255,255,255,0.1)"
                : "0 0 4px rgba(37,99,235,0.1)",
            }}
          />
        ))}

        {/* Gold sparkle particles with glow */}
        {goldPositions.map((pos, i) => (
          <div
            key={`gold-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              darkMode ? "bg-[#D6B36A]" : "bg-[#D4AF37]"
            }`}
            style={{
              top: `${pos.top}%`,
              right: `${pos.right}%`,
              opacity: pos.opacity,
              boxShadow: darkMode
                ? "0 0 10px rgba(214,179,106,0.2)"
                : "0 0 10px rgba(212,175,55,0.15)",
              animation: `float ${pos.duration}s infinite alternate`,
            }}
          />
        ))}

        {/* Gradient blobs */}
        <div
          className={`absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl ${
            darkMode
              ? "bg-[#5BE7FF] opacity-[0.04]"
              : "bg-[#3B82F6] opacity-[0.04]"
          }`}
        />
        <div
          className={`absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl ${
            darkMode
              ? "bg-[#27C7C5] opacity-[0.04]"
              : "bg-[#14B8A6] opacity-[0.03]"
          }`}
        />

        {/* Subtle dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, ${
              darkMode ? "white" : "#2563EB"
            } 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center p-8 sm:p-10 md:p-12">
        <div className="flex-1 space-y-6 max-w-4xl">
          {/* Premium Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                darkMode
                  ? "bg-white/10 backdrop-blur-sm border-white/20 text-[#C9D5E7] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  : "bg-white/80 backdrop-blur-sm border-[#E5E7EB] text-[#374151] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.1)]"
              }`}
            >
              <Tag
                className={`h-3.5 w-3.5 ${darkMode ? "text-[#5BE7FF]" : "text-[#2563EB]"}`}
              />
              {category}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-[#D6B36A]/20 to-[#C89A3D]/20 backdrop-blur-sm border-[#D6B36A]/30 text-[#D6B36A] shadow-[0_2px_8px_rgba(214,179,106,0.15)]"
                  : "bg-gradient-to-r from-[#D4AF37]/10 to-[#C89A3D]/10 backdrop-blur-sm border-[#D4AF37]/30 text-[#C89A3D] shadow-[0_2px_8px_rgba(212,175,55,0.08)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.15)]"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Partner
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`font-['DM_Serif_Display'] text-[72px] leading-[1.1] font-bold tracking-tight transition-all duration-300 ${
              darkMode ? "text-white" : "text-[#111827]"
            }`}
          >
            {firstWords}{" "}
            <span
              className={`bg-clip-text text-transparent ${
                darkMode
                  ? "bg-gradient-to-r from-[#D6B36A] via-[#C89A3D] to-[#B98C4A]"
                  : "bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
              }`}
            >
              {lastWord}
            </span>
          </h1>

          {/* Location & Rating */}
          <div
            className={`flex flex-wrap items-center gap-6 text-[15px] font-medium transition-all duration-300 ${
              darkMode ? "text-[#C9D5E7]" : "text-[#374151]"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                className={`h-5 w-5 flex-shrink-0 ${
                  darkMode ? "text-[#5BE7FF]" : "text-[#2563EB]"
                }`}
              />
              <span>{[area, city].filter(Boolean).join(", ")}</span>
            </div>

            <div
              className={`h-8 w-[1px] ${darkMode ? "bg-white/10" : "bg-[#E5E7EB]"}`}
            />

            <div
              className={`flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all duration-300 ${
                darkMode
                  ? "bg-white/5 backdrop-blur-sm border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                  : "bg-white/80 backdrop-blur-sm border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.1)]"
              }`}
            >
              <div
                className={`flex items-center ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"}`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < fullRating
                        ? `fill-current ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"}`
                        : i === fullRating && hasHalfStar
                          ? `fill-current ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"} opacity-70`
                          : darkMode
                            ? "opacity-30"
                            : "opacity-20"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`font-bold ${darkMode ? "text-white" : "text-[#111827]"}`}
              >
                {ratingAverage.toFixed(1)}
              </span>
              <span className={darkMode ? "text-[#94A7C4]" : "text-[#6B7280]"}>
                ({reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-[26px] font-['Inter'] font-normal leading-[1.4] max-w-3xl line-clamp-3 transition-all duration-300 ${
              darkMode ? "text-[#C9D5E7]" : "text-[#374151]"
            }`}
          >
            Expert {category.toLowerCase()} with {reviewsCount}+ satisfied
            clients
          </p>

          {/* Divider with gradient */}
          <div
            className={`h-[2px] w-32 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${
              darkMode
                ? "bg-gradient-to-r from-[#5BE7FF] via-[#D6B36A] to-transparent"
                : "bg-gradient-to-r from-[#2563EB] via-[#D4AF37] to-transparent"
            }`}
          />

          {/* Statistics */}
          <div
            className={`flex items-center gap-8 text-sm transition-all duration-300 ${
              darkMode ? "text-[#94A7C4]" : "text-[#6B7280]"
            }`}
          >
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span
                className={`font-semibold ${darkMode ? "text-white" : "text-[#111827]"}`}
              >
                {viewsCount}
              </span>
              <span>Views</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            >
              <Heart className="h-4 w-4" />
              <span
                className={`font-semibold ${darkMode ? "text-white" : "text-[#111827]"}`}
              >
                {likesCount}
              </span>
              <span>Likes</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            >
              <Star
                className={`h-4 w-4 ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"}`}
              />
              <span
                className={`font-semibold ${darkMode ? "text-white" : "text-[#111827]"}`}
              >
                {reviewsCount}
              </span>
              <span>Reviews</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: ${darkMode ? "0.1" : "0.05"};
          }
          50% {
            opacity: ${darkMode ? "0.3" : "0.15"};
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
