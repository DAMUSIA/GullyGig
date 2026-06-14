"use client";

import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 animate-pulse">
      {/* Expanded max-w to 1536px and matching padding */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Matching gap size */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expanded Header Card Skeleton */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 p-6 sm:p-10 md:p-14 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-6 sm:gap-8 w-full">
                  {/* Expanded Avatar placeholder to match w-40 */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-3xl flex-shrink-0" />
                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="h-8 bg-gray-200 rounded-md w-1/3" />
                    <div className="flex gap-2.5">
                      <div className="h-6 bg-gray-200 rounded-full w-28" />
                      <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 w-3/4">
                      <div className="h-5 bg-gray-200 rounded-md w-20" />
                      <div className="h-5 bg-gray-200 rounded-md w-20" />
                      <div className="h-5 bg-gray-200 rounded-md w-36" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded About Me Skeleton */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-4 border border-gray-100/50">
              <div className="h-6 bg-gray-200 rounded-md w-28" />
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded-md w-full" />
                <div className="h-5 bg-gray-200 rounded-md w-full" />
                <div className="h-5 bg-gray-200 rounded-md w-2/3" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Expanded Sidebar Cards Skeleton */}
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 border border-gray-100/50">
                <div className="h-6 bg-gray-200 rounded-md w-1/3" />
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded-md w-full" />
                  <div className="h-5 bg-gray-200 rounded-md w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
