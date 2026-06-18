"use client";

import React from "react";
import { Star, MessageSquare } from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  users?: {
    full_name: string;
  };
}

interface PortfolioReviewsProps {
  reviews: ReviewItem[];
  ratingAverage: number;
  reviewsCount: number;
}

export default function PortfolioReviews({
  reviews,
  ratingAverage,
  reviewsCount,
}: PortfolioReviewsProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-extrabold text-slate-800">Student Reviews</h3>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {reviewsCount}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
          <MessageSquare className="h-8 w-8 text-slate-350 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Reviews Yet</p>
          <p className="text-xs text-slate-400 mt-0.5">Be the first to leave a review after your session!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating Summary Card */}
          <div className="md:col-span-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-slate-850">{ratingAverage.toFixed(1)}</span>
            <div className="flex items-center text-amber-400 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(ratingAverage) ? "fill-amber-400" : "opacity-30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">Based on {reviewsCount} reviews</span>
          </div>

          {/* List of Reviews */}
          <div className="md:col-span-2 space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 border border-slate-100 rounded-2xl space-y-2.5 bg-white shadow-xs hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {(rev.users?.full_name || "Anonymous").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {rev.users?.full_name || "Anonymous"}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating ? "fill-amber-400" : "opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                {rev.review && (
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {rev.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
