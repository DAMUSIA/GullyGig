"use client";

import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Header Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl" />
                <div className="flex-1 w-full space-y-3">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40 mx-auto sm:mx-0" />
                  <div className="flex justify-center sm:justify-start gap-2">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-16 sm:w-20" />
                    <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-14 sm:w-16" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-40 sm:w-48 mx-auto sm:mx-0" />
                </div>
              </div>
            </div>

            {/* About Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-20 sm:w-24 mb-3 sm:mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-24 sm:w-28 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
