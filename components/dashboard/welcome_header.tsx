"use client";

import React from "react";
import { Plus } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  onAddService: () => void;
}

export function WelcomeHeader({ userName, onAddService }: WelcomeHeaderProps) {
  return (
    <div className="relative bg-blue-600 rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-500/20">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 text-white tracking-tight font-sans">
            Welcome back, <span className="text-blue-100">{userName}</span>!
          </h1>
          <p className="text-blue-100/70 mt-1 text-sm">
            Here&apos;s what&apos;s happening with your teaching services.
          </p>
        </div>

        <button
          onClick={onAddService}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>
    </div>
  );
}
