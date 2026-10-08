"use client";

import React from "react";
import {
  Sparkles,
  Clock,
  Globe,
  Laptop,
  ShieldCheck,
  CheckCircle,
  Award,
  Zap,
  Tag,
  Check,
} from "lucide-react";

interface PortfolioInfoProps {
  description: string;
  serviceModes: string[];
  languages: string[];
  availability: string[];
  startingPrice?: number | null;
  priceUnit?: string | null;
  darkMode?: boolean;
}

export default function PortfolioInfo({
  description,
  serviceModes,
  languages,
  availability,
  startingPrice,
  priceUnit,
  darkMode = true,
}: PortfolioInfoProps) {
  return (
    <div className="space-y-6">
      {/* Main Service Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden space-y-6 ${
          darkMode
            ? "bg-slate-900/90 border-slate-800 text-white shadow-xl shadow-slate-950/40"
            : "bg-white border-slate-200/90 text-slate-900 shadow-md"
        }`}
      >
        {/* Subtle decorative background gradient pill */}
        <div
          className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            darkMode ? "bg-blue-600/10" : "bg-blue-500/10"
          }`}
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl border ${
                darkMode
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-blue-50 border-blue-200 text-blue-600"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  About This Service
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Ad Showcase
                </span>
              </div>
              <p
                className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Comprehensive details, scope of work &amp; service
                specifications
              </p>
            </div>
          </div>

          {startingPrice && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                darkMode
                  ? "bg-slate-950/60 border-slate-800 text-emerald-400"
                  : "bg-slate-50 border-slate-200 text-emerald-700"
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-500" />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold block text-slate-400">
                  Starting Rate
                </span>
                <span className="text-sm font-extrabold font-mono">
                  ₹{startingPrice}
                  {priceUnit && (
                    <span className="text-xs font-normal text-slate-400">
                      {" "}
                      / {priceUnit.replace(/^per\s+/i, "").toLowerCase()}
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Highlight Feature Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {serviceModes && serviceModes.length > 0 && (
            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                darkMode
                  ? "bg-slate-950/50 border-slate-800/80"
                  : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  Mode
                </span>
                <span className="text-xs font-bold truncate block">
                  {serviceModes[0]}
                </span>
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                darkMode
                  ? "bg-slate-950/50 border-slate-800/80"
                  : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  Languages
                </span>
                <span className="text-xs font-bold truncate block">
                  {languages.slice(0, 2).join(", ")}
                </span>
              </div>
            </div>
          )}

          {availability && availability.length > 0 && (
            <div
              className={`p-3 rounded-2xl border flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
                darkMode
                  ? "bg-slate-950/50 border-slate-800/80"
                  : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  Availability
                </span>
                <span className="text-xs font-bold truncate block">
                  {availability.slice(0, 2).join(", ")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description Body */}
        <div className="space-y-3">
          <h3
            className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            Service Overview
          </h3>
          <div
            className={`p-5 rounded-2xl border text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
              darkMode
                ? "bg-slate-950/40 border-slate-800/60 text-slate-300"
                : "bg-slate-50/70 border-slate-200/70 text-slate-800"
            }`}
          >
            {description}
          </div>
        </div>

        {/* Expanded Specs: Service Modes & Availability Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          {/* Service Modes */}
          {serviceModes && serviceModes.length > 0 && (
            <div className="space-y-3">
              <h4
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Laptop className="w-4 h-4 text-blue-500" />
                Service Fulfillment Modes
              </h4>
              <div className="flex flex-wrap gap-2">
                {serviceModes.map((mode) => (
                  <span
                    key={mode}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      darkMode
                        ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Spoken */}
          {languages && languages.length > 0 && (
            <div className="space-y-3">
              <h4
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                Languages Supported
              </h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      darkMode
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GullyGig Direct Trust Guarantee */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode
              ? "bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border-blue-900/40"
              : "bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border-blue-200/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                <span>GullyGig Verified Guarantee</span>
                <Award className="w-3.5 h-3.5 text-amber-500" />
              </h4>
              <p
                className={`text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Direct client connect. Zero commission markup. 100% verified
                portfolio listing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Service Provider
          </div>
        </div>
      </div>
    </div>
  );
}
