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
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          About Service
        </h3>
        <p className="text-slate-650 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
          {description}
        </p>
      </div>

      {/* Right column - Modes, Languages, Availability */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        {/* Service Modes */}
        {serviceModes && serviceModes.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Laptop className="h-4 w-4 text-blue-600" />
              Service Modes
            </h4>
            <div className="flex flex-wrap gap-2">
              {serviceModes.map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-xl border border-blue-100/50"
                >
                  ✓ {mode}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-purple-600" />
              Languages Spoken
            </h4>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 bg-purple-50 text-purple-750 text-xs font-extrabold rounded-xl border border-purple-100/50"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {availability && availability.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-600" />
              Availability
            </h4>
            <div className="flex flex-wrap gap-2">
              {availability.map((opt) => (
                <span
                  key={opt}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-xl border border-emerald-100/50"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
