"use client";

import React from "react";
import { Info, Clock, Globe, Laptop } from "lucide-react";

interface PortfolioInfoProps {
  description: string;
  serviceModes: string[];
  languages: string[];
  availability: string[];
}

export default function PortfolioInfo({
  description,
  serviceModes,
  languages,
  availability,
}: PortfolioInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 columns - About Service */}
      <div className="lg:col-span-2 bg-[#FFFFFF] rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-[#E5E7EB]">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-60 h-60 opacity-[0.03] pointer-events-none text-[#2563EB]">
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

        {/* Gold dotted pattern */}
        <div
          className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #D4AF37 2px, transparent 2px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div className="relative z-10 space-y-5">
          {/* About Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#2563EB]/10 rounded-2xl border border-[#2563EB]/20 shadow-[0_4px_12px_rgba(37,99,235,0.08)]">
              <Info className="h-6 w-6 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-xl font-['Poppins'] font-semibold text-[#111827]">
                About Service
              </h3>
              <p className="text-sm font-['Inter'] text-[#6B7280]">
                Service description and details
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[16px] font-['Inter'] font-normal leading-relaxed text-[#374151] whitespace-pre-wrap">
            {description}
          </p>

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-[11px] font-['Inter'] font-semibold text-[#6B7280] uppercase tracking-[1.5px] flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#14B8A6]" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-4 py-1.5 bg-[#14B8A6]/5 text-[#374151] text-[13px] font-['Inter'] font-medium rounded-2xl border border-[#14B8A6]/10 hover:border-[#14B8A6]/30 transition-all duration-200 shadow-[0_2px_8px_rgba(20,184,166,0.06)] hover:shadow-[0_4px_16px_rgba(20,184,166,0.12)]"
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
                    className="px-4 py-1.5 bg-[#D4AF37]/5 text-[#374151] text-[13px] font-['Inter'] font-medium rounded-2xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-200 shadow-[0_2px_8px_rgba(212,175,55,0.06)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.12)]"
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
      <div className="bg-[#FFFFFF] rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.02] space-y-6 border border-[#E5E7EB]">
        {serviceModes && serviceModes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#2563EB]/10 rounded-xl border border-[#2563EB]/10 shadow-[0_2px_8px_rgba(37,99,235,0.06)]">
                <Laptop className="h-5 w-5 text-[#2563EB]" />
              </div>
              <h4 className="text-[11px] font-['Inter'] font-semibold text-[#6B7280] uppercase tracking-[1.5px]">
                Service Modes
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceModes.map((mode) => (
                <span
                  key={mode}
                  className="px-4 py-2.5 bg-[#2563EB]/5 text-[#374151] text-[13px] font-['Inter'] font-medium rounded-2xl border border-[#2563EB]/10 hover:border-[#2563EB]/30 transition-all duration-200 w-full text-center shadow-[0_2px_8px_rgba(37,99,235,0.06)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.12)]"
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Premium trust indicators */}
        <div className="pt-4 border-t border-[#D4AF37]/20 space-y-3">
          <div className="flex items-center justify-between text-sm text-[#6B7280] group hover:bg-[#F8FAFC] p-2 rounded-xl transition-all duration-200">
            <span className="font-['Inter']">Satisfaction</span>
            <span className="font-['Space_Grotesk'] font-bold text-[#D4AF37]">
              100%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#6B7280] group hover:bg-[#F8FAFC] p-2 rounded-xl transition-all duration-200">
            <span className="font-['Inter']">Support</span>
            <span className="font-['Space_Grotesk'] font-bold text-[#D4AF37]">
              24/7
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#6B7280] group hover:bg-[#F8FAFC] p-2 rounded-xl transition-all duration-200">
            <span className="font-['Inter']">Verified</span>
            <span className="font-['Space_Grotesk'] font-bold text-[#D4AF37]">
              ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
