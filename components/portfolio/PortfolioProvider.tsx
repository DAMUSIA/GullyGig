"use client";

import React from "react";
import {
  User,
  MapPin,
  Calendar,
  ShieldCheck,
  Globe,
  Clock,
  Star,
  Briefcase,
} from "lucide-react";

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
  darkMode?: boolean;
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
  darkMode = true,
}: PortfolioProviderProps) {
  return (
    <div
      className={`rounded-[26px] p-8 transition-all duration-300 space-y-6 ${
        darkMode
          ? "bg-[#0F2344] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "bg-white border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-2xl border ${
            darkMode
              ? "bg-[#D6B36A]/10 text-[#D6B36A] border-[#D6B36A]/20"
              : "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20"
          }`}
        >
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3
            className={`text-xl font-['Poppins'] font-semibold ${
              darkMode ? "text-white" : "text-[#111827]"
            }`}
          >
            Service Provider
          </h3>
          <p
            className={`text-sm font-['Inter'] ${
              darkMode ? "text-white/50" : "text-[#6B7280]"
            }`}
          >
            Verified professional on GullyGig
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div
        className={`relative p-6 rounded-2xl border transition-all duration-300 text-center ${
          darkMode
            ? "bg-white/5 border-white/10"
            : "bg-[#F8FAFC] border-[#E5E7EB]"
        }`}
      >
        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar with ring */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-['Poppins'] font-bold text-white">
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Name */}
          <h4
            className={`text-xl font-['Poppins'] font-bold ${
              darkMode ? "text-white" : "text-[#111827]"
            }`}
          >
            {fullName}
          </h4>

          {/* Location */}
          {location && (
            <div
              className={`flex items-center justify-center gap-1.5 text-xs font-['Inter'] mt-1 ${
                darkMode ? "text-white/60" : "text-[#6B7280]"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {/* Member Since */}
          <div
            className={`flex items-center gap-1.5 mt-2 text-xs font-['Inter'] ${
              darkMode ? "text-white/40" : "text-[#6B7280]"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* About */}
      {about && (
        <div className="space-y-2">
          <h4
            className={`text-[11px] font-['Inter'] font-semibold uppercase tracking-[1.5px] flex items-center gap-2 ${
              darkMode ? "text-white/60" : "text-[#6B7280]"
            }`}
          >
            <Briefcase className="h-4 w-4 text-blue-500" />
            About the Provider
          </h4>
          <p
            className={`text-xs sm:text-sm font-['Inter'] leading-relaxed whitespace-pre-wrap ${
              darkMode ? "text-slate-300" : "text-[#374151]"
            }`}
          >
            {about}
          </p>
        </div>
      )}
    </div>
  );
}
