"use client";

import React from "react";
import { Star, MessageSquare, Award, Calendar } from "lucide-react";

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
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const matchCount = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = reviewsCount > 0 ? (matchCount / reviewsCount) * 100 : 0;
    return { stars, percentage, count: matchCount };
  });

  return (
    <div className="bg-[#FFFFFF] rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-all duration-250 space-y-8 border border-[#E5E7EB]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20">
            <MessageSquare className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-xl font-['Poppins'] font-semibold text-[#111827]">
              Client Reviews
            </h3>
            <p className="text-sm font-['Inter'] text-[#6B7280]">
              Real feedback from verified clients
            </p>
          </div>
        </div>
        <span className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-['Inter'] font-semibold rounded-full border border-[#D4AF37]/20">
          {reviewsCount} Reviews
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[#D4AF37]/20 rounded-2xl">
          <MessageSquare className="h-12 w-12 text-[#D4AF37]/30 mx-auto mb-3" />
          <p className="text-base font-['Poppins'] font-semibold text-[#111827]">
            No Reviews Yet
          </p>
          <p className="text-sm font-['Inter'] text-[#6B7280] mt-1">
            Be the first to leave a review after your session!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Average Rating Summary Card */}
          <div className="md:col-span-1 bg-[#F8FAFC] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-[#D4AF37]/10">
            <div className="relative">
              <span className="text-[72px] font-['Space_Grotesk'] font-bold text-[#111827] leading-none">
                {ratingAverage.toFixed(1)}
              </span>
              <div className="absolute -top-2 -right-4 text-[#D4AF37]">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center text-[#D4AF37] my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(ratingAverage)
                      ? "fill-[#D4AF37] text-[#D4AF37]"
                      : "opacity-30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-['Inter'] font-medium text-[#6B7280]">
              Based on {reviewsCount} reviews
            </span>

            {/* Rating Distribution */}
            <div className="w-full mt-4 pt-4 border-t border-[#D4AF37]/10 space-y-1.5">
              {ratingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs font-['Inter'] font-semibold text-[#6B7280]">
                  <span className="w-3 text-right">{row.stars}</span>
                  <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                  <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-medium">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* List of Reviews */}
          <div className="md:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white border border-[#D4AF37]/10 rounded-2xl space-y-3 hover:border-[#D4AF37]/30 transition-all duration-200 shadow-sm hover:shadow-[0_4px_16px_rgba(212,175,55,0.08)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center font-['Poppins'] font-bold text-[#D4AF37] text-sm border border-[#D4AF37]/20">
                      {(rev.users?.full_name || "Anonymous").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-['Poppins'] font-semibold text-[#111827] block">
                        {rev.users?.full_name || "Anonymous"}
                      </span>
                      <div className="flex items-center text-[#D4AF37] gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-['Inter'] font-medium text-[#6B7280]">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(rev.created_at)}</span>
                  </div>
                </div>

                {rev.review && (
                  <p className="text-sm font-['Inter'] text-[#374151] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-[#D4AF37]/5">
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