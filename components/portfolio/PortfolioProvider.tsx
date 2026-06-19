"use client";

import React from "react";
import { User, MapPin } from "lucide-react";

interface PortfolioProviderProps {
  fullName: string;
  location: string | null;
  about: string | null;
}

export default function PortfolioProvider({
  fullName,
  location,
  about,
}: PortfolioProviderProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
      <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        About the Provider
      </h3>

      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        {/* Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/10 shrink-0">
          {fullName.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="text-base font-extrabold text-slate-800 truncate">
            {fullName}
          </h4>
          {location && (
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {about && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Provider Bio
          </h4>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed whitespace-pre-wrap font-medium">
            {about}
          </p>
        </div>
      )}
    </div>
  );
}
