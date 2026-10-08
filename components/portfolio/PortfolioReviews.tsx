"use client";

import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Award,
  Calendar,
  Plus,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  darkMode?: boolean;
  serviceId?: string;
  token?: string | null;
  onReviewAdded?: (newReview: ReviewItem) => void;
  onRequestAuth?: () => void;
}

export default function PortfolioReviews({
  reviews: initialReviews,
  ratingAverage,
  reviewsCount,
  darkMode = true,
  serviceId,
  token,
  onReviewAdded,
  onRequestAuth,
}: PortfolioReviewsProps) {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(initialReviews);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const matchCount = reviewsList.filter(
      (r) => Math.round(r.rating) === stars,
    ).length;
    const percentage = reviewsCount > 0 ? (matchCount / reviewsCount) * 100 : 0;
    return { stars, percentage, count: matchCount };
  });

  const handleOpenReviewModal = () => {
    if (!token) {
      if (onRequestAuth) {
        onRequestAuth();
      } else {
        setShowModal(true);
      }
      return;
    }
    setShowModal(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;

    if (!token) {
      if (onRequestAuth) {
        setShowModal(false);
        onRequestAuth();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Failed to submit review. Please try again.",
        );
      }

      const createdReview: ReviewItem = {
        id: data.review?.id || Math.random().toString(),
        rating,
        review: comment.trim() || null,
        created_at: new Date().toISOString(),
        users: {
          full_name: "You (Verified User)",
        },
      };

      setReviewsList((prev) => [createdReview, ...prev]);
      if (onReviewAdded) {
        onReviewAdded(createdReview);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowModal(false);
        setComment("");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to post review.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 space-y-6 ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-white shadow-xl"
          : "bg-white border-slate-200/90 text-slate-900 shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              darkMode
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                : "bg-blue-50 border-blue-200 text-blue-600"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Client Reviews
            </h3>
            <p
              className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Genuine feedback from verified clients
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {serviceId && (
            <button
              onClick={handleOpenReviewModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/15 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          )}

          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
              darkMode
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {reviewsList.length}{" "}
            {reviewsList.length === 1 ? "Review" : "Reviews"}
          </span>
        </div>
      </div>

      {reviewsList.length === 0 ? (
        <div
          className={`text-center py-10 px-4 border border-dashed rounded-2xl space-y-2 ${
            darkMode
              ? "border-slate-800 text-slate-400 bg-slate-950/30"
              : "border-slate-200 text-slate-500 bg-slate-50/50"
          }`}
        >
          <MessageSquare className="w-8 h-8 mx-auto text-blue-500 opacity-60 mb-1" />
          <p className="text-sm font-bold">No Reviews Yet</p>
          <p className="text-xs max-w mx-auto">
            Be the first to share your experience with this service provider!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating Summary Card */}
          <div
            className={`md:col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center border ${
              darkMode
                ? "bg-slate-950/60 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="relative">
              <span
                className={`text-5xl sm:text-6xl font-extrabold font-mono leading-none ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {ratingAverage ? ratingAverage.toFixed(1) : "5.0"}
              </span>
              <div className="absolute -top-1 -right-5 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center my-2 text-amber-400 gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(ratingAverage || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "opacity-25"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs font-medium ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Based on {reviewsList.length} client feedback
            </span>

            {/* Rating Distribution */}
            <div
              className={`w-full mt-4 pt-4 border-t space-y-1.5 ${
                darkMode ? "border-slate-800" : "border-slate-200"
              }`}
            >
              {ratingDistribution.map((row) => (
                <div
                  key={row.stars}
                  className={`flex items-center gap-2 text-xs font-semibold ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <span className="w-3 text-right">{row.stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div
                    className={`flex-1 h-2 rounded-full overflow-hidden ${
                      darkMode ? "bg-slate-800" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="w-5 text-right font-mono font-medium">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* List of Reviews */}
          <div className="md:col-span-2 space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className={`p-4 rounded-2xl space-y-2 border transition-all duration-200 ${
                  darkMode
                    ? "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        darkMode
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {(rev.users?.full_name || "Client")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          darkMode ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {rev.users?.full_name || "Verified Client"}
                      </span>
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? "fill-amber-400" : "opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[11px] ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(rev.created_at)}</span>
                  </div>
                </div>

                {rev.review && (
                  <p
                    className={`text-xs sm:text-sm leading-relaxed pt-1 ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {rev.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`max-w border rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-5 ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Share your genuine experience with this provider
                </p>
              </div>

              {submitSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm">Review Submitted!</p>
                  <p className="text-xs text-emerald-400">
                    Thank you for your valuable feedback.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-semibold">Select Rating</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-400 opacity-40"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">
                      Your Feedback (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was the service quality, communication, and punctuality?"
                      className={`w-full p-3 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none border ${
                        darkMode
                          ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs font-semibold text-red-400 text-center">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    <span>
                      {isSubmitting ? "Submitting Review..." : "Submit Review"}
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
