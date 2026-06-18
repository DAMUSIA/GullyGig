"use client";

import React from "react";
import {
  MapPin,
  Home,
  Calendar,
  Globe,
  IndianRupee,
  BookOpen,
} from "lucide-react";
import { TutorServiceFormData } from "@/lib/service.types";

interface LivePreviewCardProps {
  data: TutorServiceFormData;
}

export default function LivePreviewCard({ data }: LivePreviewCardProps) {
  // Compute display category
  const displayCategory =
    data.category === "Other"
      ? data.customCategory || "Custom Category"
      : data.category || "Select Teaching Category";

  // Compute display title
  const displayTitle = data.title || "Your Service Title";

  // Compute location
  const displayLocation =
    data.city || data.area
      ? [data.area, data.city].filter(Boolean).join(", ")
      : "Location not set";

  // Compute teaching modes
  const modesText =
    data.service_modes.length > 0
      ? data.service_modes.join(" • ")
      : "No modes selected";

  // Compute availability
  const availabilityText =
    data.availability.length > 0
      ? data.availability.join(" • ")
      : "No availability selected";

  // Compute languages
  const languagesText =
    data.languages.length > 0
      ? data.languages.join(" • ")
      : "No languages selected";

  // Compute price
  const showPrice =
    data.starting_price !== null && data.starting_price !== undefined;
  const priceUnitLabel = data.price_unit
    ? data.price_unit.toLowerCase()
    : "hour";

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-100 flex flex-col gap-5 w-full">
      {/* Header Banner badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50/80 text-blue-600 text-[10px] font-bold tracking-wider uppercase rounded-full border border-blue-100">
          <BookOpen className="h-3 w-3" />
          Live Preview
        </span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      </div>

      {/* Main Details */}
      <div className="space-y-4">
        <div>
          {/* Category */}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {displayCategory}
          </span>
          {/* Title */}
          <h3 className="text-xl font-bold text-slate-800 leading-snug mt-1 font-sans line-clamp-2">
            {displayTitle}
          </h3>
        </div>

        {/* Info Grid */}
        <div className="space-y-2.5 text-xs text-slate-600">
          {/* Location */}
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{displayLocation}</span>
          </div>

          {/* Modes */}
          <div className="flex items-start gap-2.5">
            <Home className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{modesText}</span>
          </div>

          {/* Availability */}
          <div className="flex items-start gap-2.5">
            <Calendar className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{availabilityText}</span>
          </div>

          {/* Languages */}
          <div className="flex items-start gap-2.5">
            <Globe className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{languagesText}</span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Pricing Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline text-slate-800">
            {showPrice ? (
              <>
                <span className="text-xs font-semibold text-slate-500 mr-1">
                  Starts from
                </span>
                <IndianRupee className="h-4.5 w-4.5 self-center font-bold text-blue-600" />
                <span className="text-2xl font-extrabold text-blue-600">
                  {data.starting_price}
                </span>
                <span className="text-xs font-semibold text-slate-500 ml-1">
                  / {priceUnitLabel}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-400 italic">
                Price on enquiry
              </span>
            )}
          </div>
        </div>

        {/* Description / About */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            About Teaching
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-4 whitespace-pre-line">
            {data.description ||
              "Describe what you teach and who you help. Your description will appear here..."}
          </p>
        </div>
      </div>
    </div>
  );
}
