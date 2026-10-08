"use client";

import React from "react";
import Image from "next/image";
import {
  Briefcase,
  CalendarDays,
  Check,
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
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import InstagramLikeButton from "@/components/ui/InstagramLikeButton";

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

// Animated sliding button matching Home Hero AnimatedCTA design with exact speed & smoothness
function AnimatedHeroAction({
  href,
  onClick,
  target,
  rel,
  defaultText,
  hoverText,
  variant = "primary",
  icon: IconComponent,
}: {
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  defaultText: string;
  hoverText: string;
  variant?: "primary" | "whatsapp" | "schedule";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseContainerClass = `relative overflow-hidden w-full min-h-[56px] rounded-2xl flex items-center justify-center group transition-shadow shadow-md cursor-pointer border select-none ${
    variant === "primary"
      ? "bg-[#1855c9] border-[#1855c9] shadow-lg shadow-blue-900/30"
      : variant === "whatsapp"
        ? "bg-[#e2edff] dark:bg-blue-950/80 border-blue-200 dark:border-blue-900/80 shadow-sm"
        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
  }`;

  const slidingBgClass = `absolute inset-0 z-0 rounded-2xl ${
    variant === "primary"
      ? "bg-white"
      : variant === "whatsapp"
        ? "bg-[#25D366]"
        : "bg-blue-600"
  }`;

  const defaultTextClass = `absolute flex items-center justify-center gap-2 text-[15px] font-bold tracking-wide w-full ${
    variant === "primary"
      ? "text-white"
      : variant === "whatsapp"
        ? "text-blue-700 dark:text-blue-300"
        : "text-slate-800 dark:text-slate-200"
  }`;

  const hoverTextClass = `absolute flex items-center justify-center gap-2 text-[15px] font-bold tracking-wide w-full ${
    variant === "primary" ? "text-[#1855c9]" : "text-white"
  }`;

  const content = (
    <>
      {/* The Sliding Background with smooth 1.5s cubic-bezier curve */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={slidingBgClass}
      />

      {/* Button Content Wrapper */}
      <div className="relative z-10 flex items-center justify-center w-full h-full overflow-hidden px-4">
        {/* Default State (Fades out and moves down) */}
        <motion.div
          initial={false}
          animate={{
            y: isHovered ? 30 : 0,
            opacity: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={defaultTextClass}
        >
          {IconComponent && <IconComponent className="h-4.5 w-4.5 shrink-0" />}
          <span>{defaultText}</span>
        </motion.div>

        {/* Hover State (Fades in and moves up from bottom) */}
        <motion.div
          initial={false}
          animate={{
            y: isHovered ? 0 : -30,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={hoverTextClass}
        >
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{
              x: isHovered ? 0 : -10,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center"
          >
            {IconComponent ? (
              <IconComponent className="h-4.5 w-4.5 shrink-0" />
            ) : (
              <Icon name="arrow_forward" className="text-lg" />
            )}
          </motion.span>
          <span>{hoverText}</span>
        </motion.div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={baseContainerClass}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={baseContainerClass}
    >
      {content}
    </button>
  );
}

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
  darkMode = true,
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

  const hasRating = ratingAverage > 0 && reviewsCount > 0;
  const ratingLabel =
    ratingAverage >= 4.8
      ? "Exceptional"
      : ratingAverage >= 4.0
        ? "Excellent"
        : hasRating
          ? "Good"
          : "Awaiting feedback";

  const communityReach = formatCount(likesCount > 0 ? likesCount : viewsCount);
  const availabilityTag =
    availability.length > 0 ? availability.slice(0, 2).join(" & ") : null;

  const stats = [
    {
      icon: Star,
      value: hasRating ? `${ratingAverage.toFixed(1)}/5` : "No rating",
      label: "Client Rating",
      support: hasRating ? ratingLabel : "Awaiting feedback",
    },
    {
      icon: MessageSquare,
      value: String(reviewsCount),
      label: "Total Reviews",
      support: reviewsCount > 0 ? "Verified feedback" : "New listing",
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

  const pillClass = darkMode
    ? "inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-300"
    : "inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1.5 text-xs font-semibold text-blue-700";

  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border transition-all duration-300 shadow-xl ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-white shadow-slate-950/40"
          : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
      }`}
    >
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

            <div
              className={`relative h-40 w-40 overflow-hidden rounded-[24px] border shadow-lg sm:h-44 sm:w-44 xl:h-48 xl:w-48 ${
                darkMode
                  ? "bg-slate-950 border-slate-800 shadow-black/40"
                  : "bg-slate-100 border-slate-100 shadow-slate-900/10"
              }`}
            >
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
                  <span className="select-none text-6xl font-extrabold text-blue-500">
                    {providerInitial}
                  </span>
                </div>
              )}
            </div>

            {isVerified && (
              <div
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow ring-4 ring-white dark:ring-slate-900"
                aria-label="Verified"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-3 text-center sm:pt-1 sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <h1
                className={`break-words text-[32px] font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {providerName}
              </h1>
            </div>

            <p className="text-lg font-bold leading-snug text-blue-500 xl:text-2xl">
              {title}
            </p>

            {(locationText || languages.length > 0) && (
              <div
                className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium sm:justify-start xl:text-base ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {locationText && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                    <span>{locationText}</span>
                  </div>
                )}
                {languages.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Languages className="h-4 w-4 shrink-0 text-blue-500" />
                    <span>{languages.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
              {category && (
                <span className={pillClass}>
                  <Zap className="h-3.5 w-3.5 fill-current text-blue-500" />
                  {category}
                </span>
              )}

              {availabilityTag && (
                <span className={pillClass}>
                  <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                  {availabilityTag}
                </span>
              )}

              {startingPrice ? (
                <span className={pillClass}>
                  <Wallet className="h-3.5 w-3.5 text-blue-500" />
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
          <div className="mx-auto flex w-full flex-col gap-3.5">
            {/* Hire / Call CTA */}
            {onHire ? (
              <AnimatedHeroAction
                onClick={onHire}
                defaultText="Hire for a Gig"
                hoverText="Connect Now"
                variant="primary"
                icon={Zap}
              />
            ) : primaryNumber ? (
              <AnimatedHeroAction
                href={`tel:${primaryNumber}`}
                defaultText="Hire for a Gig"
                hoverText="Call Provider"
                variant="primary"
                icon={Zap}
              />
            ) : (
              <div
                className="relative overflow-hidden w-full min-h-[56px] rounded-2xl flex items-center justify-center bg-[#144fc6] opacity-60 text-white font-bold cursor-not-allowed text-base gap-2"
                aria-disabled="true"
              >
                <Zap className="h-5 w-5 fill-current" />
                <span>Hire for a Gig</span>
              </div>
            )}

            {/* WhatsApp */}
            {primaryNumber ? (
              <AnimatedHeroAction
                href={`https://wa.me/91${primaryNumber}?text=${encodeURIComponent(
                  `Hello! I found your service "${title}" on GullyGig and would like to enquire.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                defaultText="WhatsApp"
                hoverText="Chat on WhatsApp"
                variant="whatsapp"
                icon={FaWhatsapp}
              />
            ) : (
              <div
                className="relative overflow-hidden w-full min-h-[56px] rounded-2xl flex items-center justify-center bg-[#e2edff] text-blue-700 opacity-60 font-bold text-base gap-2"
                aria-disabled="true"
              >
                <FaWhatsapp className="h-5 w-5" />
                <span>WhatsApp Chat</span>
              </div>
            )}

            {/* Schedule call (only if supported) */}
            {onScheduleCall && (
              <AnimatedHeroAction
                onClick={onScheduleCall}
                defaultText="Schedule a Call"
                hoverText="Book Free Slot"
                variant="schedule"
                icon={CalendarDays}
              />
            )}

            {/* Save Button - Instagram Style */}
            {onLikeToggle && (
              <InstagramLikeButton
                variant="hero-full"
                isLiked={isLiked}
                onToggle={onLikeToggle}
                label={isLiked ? "Saved to Favourites" : "Save to Favourites"}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Zone C: One unified stats strip ── */}
      <div
        className={`border-t ${
          darkMode
            ? "border-slate-800 bg-slate-950/60"
            : "border-slate-100 bg-slate-50/80"
        }`}
      >
        <div
          className={`grid grid-cols-2 gap-y-6 px-4 py-6 md:grid-cols-4 md:divide-x xl:px-8 ${
            darkMode ? "md:divide-slate-800/80" : "md:divide-slate-200/70"
          }`}
        >
          {stats.map(({ icon: Icon, value, label, support }) => (
            <div key={label} className="px-4 text-center">
              <div
                className={`flex items-center justify-center gap-1.5 text-2xl font-extrabold xl:text-[30px] ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 text-blue-500" />
                {value}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-500">
                {label}
              </div>
              {support && (
                <div
                  className={`text-xs font-medium ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
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
