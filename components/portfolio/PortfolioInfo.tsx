"use client";

import React from "react";
import { Info, Clock, Globe, Laptop } from "lucide-react";

interface PortfolioInfoProps {
  description: string;
  serviceModes: string[];
  languages: string[];
  availability: string[];
  darkMode?: boolean;
}

export default function PortfolioInfo({
  description,
  serviceModes,
  languages,
  availability,
  darkMode = true,
}: PortfolioInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 columns - About Service */}
      <div
        className={`lg:col-span-2 rounded-[26px] p-8 transition-all duration-300 relative overflow-hidden ${
          darkMode
            ? "bg-[#0F2344] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[#D6B36A]/30"
            : "bg-white border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-[#2563EB]/20"
        }`}
      >
        {/* Background decoration */}
        <div
          className={`absolute -top-20 -right-20 w-60 h-60 opacity-[0.05] pointer-events-none ${
            darkMode ? "text-[#5BE7FF]" : "text-[#2563EB]"
          }`}
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="40"
              stroke="currentColor"
              strokeWidth="2"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="30"
              stroke="currentColor"
              strokeWidth="1.5"
              transform="rotate(45 100 100)"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="30"
              stroke="currentColor"
              strokeWidth="1.5"
              transform="rotate(-45 100 100)"
            />
          </svg>
        </div>

        <div className="relative z-10 space-y-5">
          {/* About Header */}
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl border ${
                darkMode
                  ? "bg-[#5BE7FF]/10 border-[#5BE7FF]/20 text-[#5BE7FF]"
                  : "bg-[#2563EB]/10 border-[#2563EB]/20 text-[#2563EB]"
              }`}
            >
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h3
                className={`text-xl font-['Poppins'] font-semibold ${
                  darkMode ? "text-white" : "text-[#111827]"
                }`}
              >
                About Service
              </h3>
              <p
                className={`text-sm font-['Inter'] ${
                  darkMode ? "text-white/50" : "text-[#6B7280]"
                }`}
              >
                Service description and details
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-[15px] sm:text-[16px] font-['Inter'] font-normal leading-relaxed whitespace-pre-wrap ${
              darkMode ? "text-slate-200" : "text-[#374151]"
            }`}
          >
            {description}
          </p>

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4
                className={`text-[11px] font-['Inter'] font-semibold uppercase tracking-[1.5px] flex items-center gap-2 ${
                  darkMode ? "text-white/60" : "text-[#6B7280]"
                }`}
              >
                <Globe
                  className={`h-4 w-4 ${darkMode ? "text-[#27C7C5]" : "text-[#14B8A6]"}`}
                />
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className={`px-4 py-1.5 text-[13px] font-['Inter'] font-medium rounded-2xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-white/5 text-white/90 border-white/10 hover:border-[#27C7C5]/30"
                        : "bg-[#14B8A6]/5 text-[#374151] border-[#14B8A6]/15 hover:border-[#14B8A6]/30"
                    }`}
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
              <h4
                className={`text-[11px] font-['Inter'] font-semibold uppercase tracking-[1.5px] flex items-center gap-2 ${
                  darkMode ? "text-white/60" : "text-[#6B7280]"
                }`}
              >
                <Clock
                  className={`h-4 w-4 ${darkMode ? "text-[#D6B36A]" : "text-[#D4AF37]"}`}
                />
                Availability
              </h4>
              <div className="flex flex-wrap gap-2">
                {availability.map((opt) => (
                  <span
                    key={opt}
                    className={`px-4 py-1.5 text-[13px] font-['Inter'] font-medium rounded-2xl border transition-all duration-200 ${
                      darkMode
                        ? "bg-[#D6B36A]/10 text-[#D6B36A] border-[#D6B36A]/20 hover:border-[#D6B36A]/40"
                        : "bg-[#D4AF37]/10 text-[#85660D] border-[#D4AF37]/20 hover:border-[#D4AF37]/40"
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right column - Service Modes */}
      <div
        className={`rounded-[26px] p-8 transition-all duration-300 space-y-6 ${
          darkMode
            ? "bg-[#0F2344] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "bg-white border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
        }`}
      >
        {serviceModes && serviceModes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl border ${
                  darkMode
                    ? "bg-[#5BE7FF]/10 text-[#5BE7FF] border-[#5BE7FF]/20"
                    : "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20"
                }`}
              >
                <Laptop className="h-5 w-5" />
              </div>
              <h4
                className={`text-[11px] font-['Inter'] font-semibold uppercase tracking-[1.5px] ${
                  darkMode ? "text-white/60" : "text-[#6B7280]"
                }`}
              >
                Service Modes
              </h4>
            </div>
            <div className="flex flex-col gap-2">
              {serviceModes.map((mode) => (
                <span
                  key={mode}
                  className={`px-4 py-3 text-[13px] font-['Inter'] font-semibold rounded-2xl border transition-all duration-200 w-full text-center ${
                    darkMode
                      ? "bg-white/5 text-white border-white/10 hover:border-white/20"
                      : "bg-[#F8FAFC] text-[#374151] border-[#E5E7EB] hover:border-[#2563EB]/20"
                  }`}
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Premium trust indicators */}
        <div
          className={`pt-4 border-t space-y-2.5 ${
            darkMode
              ? "border-white/10 text-white/60"
              : "border-[#E5E7EB] text-[#6B7280]"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold p-2 rounded-xl">
            <span>Verified Status</span>
            <span
              className={
                darkMode
                  ? "text-[#D6B36A] font-bold"
                  : "text-[#2563EB] font-bold"
              }
            >
              ✓ Verified Listing
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold p-2 rounded-xl">
            <span>Customer Protection</span>
            <span
              className={
                darkMode
                  ? "text-emerald-400 font-bold"
                  : "text-emerald-600 font-bold"
              }
            >
              100% Direct Connect
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold p-2 rounded-xl">
            <span>Support Desk</span>
            <span
              className={
                darkMode
                  ? "text-[#5BE7FF] font-bold"
                  : "text-blue-600 font-bold"
              }
            >
              GullyGig Connect
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
