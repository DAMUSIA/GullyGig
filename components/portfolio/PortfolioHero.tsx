"use client";

import React from "react";
import Image from "next/image";
import {
  Briefcase,
  CalendarDays,
  Check,
  CircleCheck,
  Eye,
  Heart,
  Languages,
  MapPin,
  MessageSquare,
  Star,
  Wallet,
  Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

interface PortfolioHeroProps {
  title: string;
  category: string;
  city: string;
  area: string | null;
  ratingAverage: number;
  reviewsCount: number;
  startingPrice: number | null;
  priceUnit: string | null;
  viewsCount?: number;
  likesCount?: number;
  darkMode?: boolean;
  providerName?: string;
  providerAbout?: string | null;
  providerImage?: string | null;
  isVerified?: boolean;
  /** Only rendered when provided, e.g. "TOP 1%". Never invented. */
  topBadgeLabel?: string | null;
  gigsCompleted?: number | null;
  contactNumbers?: string[];
  languages?: string[];
  availability?: string[];
  isLiked?: boolean;
  onLikeToggle?: () => void;
  /** Existing hire action. Falls back to tel: link when absent. */
  onHire?: () => void;
  /** Schedule button is only rendered when this exists. */
  onScheduleCall?: () => void;
}

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

const pillClass =
  "inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700";

export default function PortfolioHero({
  title,
  category,
  city,
  area,
  ratingAverage,
  reviewsCount,
  startingPrice,
  priceUnit,
  viewsCount = 0,
  likesCount = 0,
  providerName = "Verified Provider",
  providerImage = null,
  isVerified = true,
  topBadgeLabel = null,
  gigsCompleted = null,
  languages = [],
  availability = [],
  contactNumbers = [],
  isLiked = false,
  onLikeToggle,
  onHire,
  onScheduleCall,
}: PortfolioHeroProps) {
  const locationText = [area, city].filter(Boolean).join(", ");
  const primaryNumber =
    contactNumbers.length > 0 ? contactNumbers[0].replace(/\D/g, "") : "";
  const providerInitial = providerName
    ? providerName.charAt(0).toUpperCase()
    : "P";

  const hasRating = ratingAverage > 0;
  const ratingLabel =
    ratingAverage >= 4.8
      ? "Exceptional"
      : ratingAverage >= 4.0
        ? "Excellent"
        : hasRating
          ? "Good"
          : "Awaiting reviews";

  const communityReach = formatCount(likesCount > 0 ? likesCount : viewsCount);
  const availabilityTag =
    availability.length > 0 ? availability.slice(0, 2).join(" & ") : null;

  const stats = [
    {
      icon: Star,
      value: hasRating ? `${ratingAverage.toFixed(1)}/5` : "—",
      label: "Client Rating",
      support: ratingLabel,
    },
    {
      icon: MessageSquare,
      value: String(reviewsCount),
      label: "Total Reviews",
      support: reviewsCount > 0 ? "Verified feedback" : null,
    },
    {
      icon: Heart,
      value: communityReach,
      label: "Community Reach",
      support: "Growing network",
    },
    gigsCompleted !== null && gigsCompleted !== undefined
      ? {
          icon: Briefcase,
          value: formatCount(gigsCompleted),
          label: "Gigs Completed",
          support: "On GullyGig",
        }
      : {
          icon: Eye,
          value: formatCount(viewsCount),
          label: "Profile Views",
          support: "On GullyGig",
        },
  ];

  const primaryBtn =
    "flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#1855c9] px-6 text-base font-bold text-white shadow-sm transition hover:bg-[#1448a8] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600";

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* ── Zone A: Provider identity ── */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:col-span-3 xl:p-10 sm:flex-row sm:items-start">
          {/* Image */}
          <div className="relative mx-auto shrink-0 sm:mx-0">
            {topBadgeLabel && (
              <div className="absolute -left-3 -top-3 z-10 flex -rotate-3 items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-md">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {topBadgeLabel}
              </div>
            )}

            <div className="relative h-40 w-40 overflow-hidden rounded-[24px] border border-slate-100 bg-slate-100 shadow-lg shadow-slate-900/10 sm:h-44 sm:w-44 xl:h-48 xl:w-48">
              {providerImage ? (
                <Image
                  src={providerImage}
                  alt={providerName}
                  fill
                  sizes="(min-width: 1280px) 192px, 176px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="select-none text-6xl font-extrabold text-blue-600">
                    {providerInitial}
                  </span>
                </div>
              )}
            </div>

            {isVerified && (
              <div
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow ring-4 ring-white"
                aria-label="Verified"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-3 text-center sm:pt-1 sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <h1 className="break-words text-[32px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl xl:text-5xl">
                {providerName}
              </h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-700">
                  <CircleCheck className="h-3.5 w-3.5" />
                  Verified Partner
                </span>
              )}
            </div>

            <p className="text-lg font-bold leading-snug text-blue-600 xl:text-2xl">
              {title}
            </p>

            {(locationText || languages.length > 0) && (
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 sm:justify-start xl:text-base">
                {locationText && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>{locationText}</span>
                  </div>
                )}
                {languages.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Languages className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>{languages.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
              <span className={pillClass}>
                <Zap className="h-3.5 w-3.5 fill-current text-blue-600" />
                {category}
              </span>

              {availabilityTag && (
                <span className={pillClass}>
                  <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                  {availabilityTag}
                </span>
              )}

              {startingPrice ? (
                <span className={pillClass}>
                  <Wallet className="h-3.5 w-3.5 text-blue-600" />
                  From ₹{startingPrice}
                  {priceUnit
                    ? ` / ${priceUnit.replace(/^per\s+/i, "").toLowerCase()}`
                    : ""}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Zone B: Blue action panel ── */}
        <div
          className="relative flex flex-col justify-center gap-3.5 p-6 sm:p-8 lg:col-span-2 xl:p-10"
          style={{
            backgroundColor: "#1d64ec",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="mx-auto flex w-full max-w-[350px] flex-col gap-3.5">
            {/* Hire */}
            {onHire ? (
              <button type="button" onClick={onHire} className={primaryBtn}>
                <Zap className="h-4 w-4 fill-current" />
                Hire for a Gig
              </button>
            ) : primaryNumber ? (
              <a href={`tel:${primaryNumber}`} className={primaryBtn}>
                <Zap className="h-4 w-4 fill-current" />
                Hire for a Gig
              </a>
            ) : (
              <div
                className={`${primaryBtn} cursor-not-allowed opacity-70`}
                aria-disabled="true"
              >
                <Zap className="h-4 w-4 fill-current" />
                Hire for a Gig
              </div>
            )}

            {/* WhatsApp */}
            {primaryNumber ? (
              <a
                href={`https://wa.me/91${primaryNumber}?text=${encodeURIComponent(
                  `Hello! I found your service "${title}" on GullyGig and would like to enquire.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#e2edff] px-6 text-base font-bold text-blue-700 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FaWhatsapp className="h-5 w-5" />
                WhatsApp chat
              </a>
            ) : (
              <div
                className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#e2edff] px-6 text-base font-bold text-blue-700 opacity-60"
                aria-disabled="true"
              >
                <FaWhatsapp className="h-5 w-5" />
                WhatsApp chat
              </div>
            )}

            {/* Schedule call (only if supported) */}
            {onScheduleCall && (
              <button
                type="button"
                onClick={onScheduleCall}
                className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-6 text-base font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <CalendarDays className="h-4 w-4 text-slate-700" />
                Schedule a call
              </button>
            )}

            {/* Save */}
            {onLikeToggle && (
              <button
                type="button"
                onClick={onLikeToggle}
                aria-pressed={isLiked}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-red-400 text-red-400" : ""}`}
                />
                {isLiked ? "Saved to Favourites" : "Save to Favourites"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Zone C: One unified stats strip ── */}
      <div className="border-t border-slate-100 bg-slate-50/80">
        <div className="grid grid-cols-2 gap-y-6 px-4 py-6 md:grid-cols-4 md:divide-x md:divide-slate-200/70 xl:px-8">
          {stats.map(({ icon: Icon, value, label, support }) => (
            <div key={label} className="px-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-2xl font-extrabold text-slate-900 xl:text-[30px]">
                <Icon className="h-5 w-5 text-blue-600" />
                {value}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                {label}
              </div>
              {support && (
                <div className="text-xs font-medium text-slate-500">
                  {support}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
