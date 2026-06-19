"use client";

import React from "react";
import { MessageSquare, Star } from "lucide-react";

interface ServiceReview {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  services?: { title: string };
  users?: { full_name: string };
}

interface RecentReviewsProps {
  reviews: ServiceReview[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h2 className="text-sm font-extrabold text-slate-800">
          Recent Reviews
        </h2>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {reviews.length}
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {review.users?.full_name?.charAt(0) || "U"}
                </div>
                <span className="font-bold text-slate-700 text-sm">
                  {review.users?.full_name}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  on &ldquo;{review.services?.title}&rdquo;
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            {review.review && (
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                {review.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
