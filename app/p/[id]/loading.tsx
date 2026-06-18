"use client";

import React from "react";

export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 animate-pulse">
      {/* Navbar skeleton */}
      <div className="bg-white border-b border-slate-100 h-16 w-full" />

      {/* Content wrapper skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Card Skeleton */}
        <div className="bg-slate-200 h-64 rounded-3xl w-full" />

        {/* Info Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-200 h-56 rounded-3xl" />
          <div className="bg-slate-200 h-56 rounded-3xl" />
        </div>

        {/* Contact Skeleton */}
        <div className="bg-slate-200 h-44 rounded-3xl w-full" />

        {/* Provider Bio Skeleton */}
        <div className="bg-slate-200 h-48 rounded-3xl w-full" />

        {/* Reviews Skeleton */}
        <div className="bg-slate-200 h-64 rounded-3xl w-full" />
      </div>
    </div>
  );
}
