"use client";

import React from "react";
import { Star, MapPin, Tag, IndianRupee } from "lucide-react";

interface PortfolioHeroProps {
  title: string;
  category: string;
  city: string;
  area: string | null;
  ratingAverage: number;
  reviewsCount: number;
  startingPrice: number | null;
  priceUnit: string | null;
}

export default function PortfolioHero({
  title,
  category,
  city,
  area,
  ratingAverage,
  reviewsCount,
  startingPrice,
  priceUnit,
}: PortfolioHeroProps) {
  const fullRating = Math.floor(ratingAverage);
  const hasHalfStar = ratingAverage % 1 !== 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-white/5">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          {/* Category Tag */}
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/20">
            <Tag className="h-3 w-3" />
            {category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {title}
          </h1>

          {/* Location & Rating row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span>{[area, city].filter(Boolean).join(", ")}</span>
            </div>

            <span className="h-3 w-[1px] bg-white/10 hidden sm:inline" />

            <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < fullRating
                        ? "fill-amber-400"
                        : i === fullRating && hasHalfStar
                          ? "fill-amber-400 opacity-70"
                          : "opacity-30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-extrabold text-white text-xs">
                {ratingAverage.toFixed(1)}
              </span>
              <span className="text-slate-400">({reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Pricing badge */}
        {startingPrice && (
          <div className="flex-shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center min-w-[150px] shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Starting Price
            </span>
            <div className="flex items-baseline text-white">
              <span className="text-2xl font-black flex items-center">
                <IndianRupee className="h-5 w-5 shrink-0" />
                {startingPrice}
              </span>
              {priceUnit && (
                <span className="text-xs text-slate-400 font-medium ml-1">
                  / {priceUnit.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
