"use client";

import React from "react";
import { User, MapPin, Calendar, Award, ShieldCheck, Globe, Clock, Star, Briefcase } from "lucide-react";

interface PortfolioProviderProps {
  fullName: string;
  location: string | null;
  about: string | null;
  memberSince?: string;
  isVerified?: boolean;
  languages?: string[];
  availability?: string[];
  rating?: number;
  totalReviews?: number;
  totalServices?: number;
}

export default function PortfolioProvider({
  fullName,
  location,
  about,
  memberSince = "2024",
  isVerified = true,
  languages = [],
  availability = [],
  rating = 4.8,
  totalReviews = 0,
  totalServices = 1,
}: PortfolioProviderProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-250 space-y-6 border border-[#E5E7EB]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20">
          <User className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-xl font-['Poppins'] font-semibold text-[#111827]">
            Service Provider
          </h3>
          <p className="text-sm font-['Inter'] text-[#6B7280]">
            Verified professional on GullyGig
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="relative p-6 bg-[#F8FAFC] rounded-2xl border border-[#D4AF37]/10">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar with gradient ring */}
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-['Poppins'] font-bold text-[#2563EB]">
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
            )}
          </div>

          {/* Name */}
          <h4 className="text-xl font-['Poppins'] font-semibold text-[#111827]">
            {fullName}
          </h4>

          {/* Location */}
          {location && (
            <div className="flex items-center justify-center gap-1.5 text-sm font-['Inter'] text-[#6B7280] mt-0.5">
              <MapPin className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-['Space_Grotesk'] font-bold text-[#111827]">{rating.toFixed(1)}</span>
            </div>
            {totalReviews > 0 && (
              <span className="text-xs font-['Inter'] text-[#6B7280]">
                ({totalReviews} reviews)
              </span>
            )}
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-1.5 mt-2 text-xs font-['Inter'] text-[#6B7280]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* About */}
      {about && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-['Inter'] font-semibold text-[#6B7280] uppercase tracking-[1.5px] flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#2563EB]" />
            About the Provider
          </h4>
          <p className="text-sm font-['Inter'] text-[#374151] leading-relaxed whitespace-pre-wrap">
            {about}
          </p>
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-['Inter'] font-semibold text-[#6B7280] uppercase tracking-[1.5px] flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#14B8A6]" />
            Languages Spoken
          </h4>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className="px-4 py-1.5 bg-[#14B8A6]/5 text-[#374151] text-[13px] font-['Inter'] font-medium rounded-2xl border border-[#14B8A6]/10 hover:border-[#14B8A6]/30 transition-all duration-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {availability && availability.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-['Inter'] font-semibold text-[#6B7280] uppercase tracking-[1.5px] flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D4AF37]" />
            Availability
          </h4>
          <div className="flex flex-wrap gap-2">
            {availability.map((opt) => (
              <span
                key={opt}
                className="px-4 py-1.5 bg-[#D4AF37]/5 text-[#374151] text-[13px] font-['Inter'] font-medium rounded-2xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-200"
              >
                {opt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="pt-4 border-t border-[#D4AF37]/20 grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="font-['Space_Grotesk'] font-bold text-lg text-[#D4AF37]">
            {totalServices}
          </div>
          <div className="text-[10px] font-['Inter'] font-medium text-[#6B7280] uppercase tracking-[0.5px]">
            Services
          </div>
        </div>
        <div className="text-center border-x border-[#D4AF37]/20">
          <div className="font-['Space_Grotesk'] font-bold text-lg text-[#D4AF37]">
            {totalReviews}
          </div>
          <div className="text-[10px] font-['Inter'] font-medium text-[#6B7280] uppercase tracking-[0.5px]">
            Reviews
          </div>
        </div>
        <div className="text-center">
          <div className="font-['Space_Grotesk'] font-bold text-lg text-[#D4AF37]">
            {isVerified ? "✓" : "—"}
          </div>
          <div className="text-[10px] font-['Inter'] font-medium text-[#6B7280] uppercase tracking-[0.5px]">
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}