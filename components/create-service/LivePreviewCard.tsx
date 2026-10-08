"use client";

import React from "react";
import {
  MapPin,
  Home,
  Calendar,
  Globe,
  IndianRupee,
  Share2,
} from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaDiscord,
  FaTelegram,
  FaYoutube,
  FaGlobe as FaGlobeIcon,
} from "react-icons/fa6";
import { TutorServiceFormData } from "@/lib/service.types";
import { getYouTubeVideoId } from "@/lib/url";

interface LivePreviewCardProps {
  data: TutorServiceFormData;
}

export default function LivePreviewCard({ data }: LivePreviewCardProps) {
  // Compute display category
  const displayCategory =
    data.category === "Other"
      ? data.customCategory || "Custom Category"
      : data.category || "Select Teaching Category";

  // Compute display title
  const displayTitle = data.title || "Your Service Title";

  // Compute location
  const displayLocation =
    data.city || data.area
      ? [data.area, data.city].filter(Boolean).join(", ")
      : "Location not set";

  // Compute teaching modes
  const modesText =
    data.service_modes.length > 0
      ? data.service_modes.join(" • ")
      : "No modes selected";

  // Compute availability
  const availabilityText =
    data.availability.length > 0
      ? data.availability.join(" • ")
      : "No availability selected";

  // Compute languages
  const languagesText =
    data.languages.length > 0
      ? data.languages.join(" • ")
      : "No languages selected";

  // Compute price & tiers
  const validTierPrices = (data.pricing_tiers || [])
    .map((t) =>
      t.price !== "" && t.price !== null && t.price !== undefined
        ? Number(t.price)
        : null,
    )
    .filter((p): p is number => p !== null && !isNaN(p) && p >= 0);

  const lowestTierPrice =
    validTierPrices.length > 0 ? Math.min(...validTierPrices) : null;
  const displayPrice =
    lowestTierPrice !== null ? lowestTierPrice : data.starting_price;
  const showPrice = displayPrice !== null && displayPrice !== undefined;

  const firstTierUnit = data.pricing_tiers?.find((t) => t.unit)?.unit;
  const priceUnitLabel = firstTierUnit
    ? firstTierUnit.replace(/^per\s+/i, "")
    : data.price_unit
      ? data.price_unit.replace(/^per\s+/i, "")
      : "month";

  const videoId = getYouTubeVideoId(data.intro_video_url);

  const socials = data.social_links || {};
  const customLinks = (socials.custom_links || []).filter(
    (l) => l.name?.trim() && l.url?.trim(),
  );

  const hasAnySocial =
    Boolean(
      socials.whatsapp ||
      socials.instagram ||
      socials.facebook ||
      socials.linkedin ||
      socials.discord ||
      socials.telegram ||
      socials.youtube ||
      socials.website,
    ) || customLinks.length > 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-100 flex flex-col gap-5 w-full">
      {/* Main Details */}
      <div className="space-y-4">
        <div>
          {/* Category */}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {displayCategory}
          </span>
          {/* Title */}
          <h3 className="text-xl font-bold text-slate-800 leading-snug mt-1 font-sans line-clamp-2">
            {displayTitle}
          </h3>
        </div>

        {/* Video badge if attached */}
        {videoId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold">
            <FaYoutube className="w-4 h-4 text-red-600 shrink-0" />
            <span>Includes YouTube Introduction Video Demo</span>
          </div>
        )}

        {/* Info Grid */}
        <div className="space-y-2.5 text-xs text-slate-600">
          {/* Location */}
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium block">{displayLocation}</span>
              {data.address && (
                <span className="text-[11px] text-slate-400 block break-words mt-0.5">
                  {data.address}
                </span>
              )}
            </div>
          </div>

          {/* Modes */}
          <div className="flex items-start gap-2.5">
            <Home className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{modesText}</span>
          </div>

          {/* Availability */}
          <div className="flex items-start gap-2.5">
            <Calendar className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium block">{availabilityText}</span>
              {data.custom_availability && (
                <span className="text-[11px] text-blue-600/90 font-medium block mt-0.5">
                  Schedule: {data.custom_availability}
                </span>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-start gap-2.5">
            <Globe className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{languagesText}</span>
          </div>
        </div>

        {/* Active Social Channels */}
        {hasAnySocial && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Connected Channels
            </span>
            <div className="flex flex-wrap gap-1.5">
              {socials.whatsapp && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  <FaWhatsapp className="w-3 h-3" /> WhatsApp
                </span>
              )}
              {socials.instagram && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-pink-50 text-pink-700 text-[10px] font-bold">
                  <FaInstagram className="w-3 h-3" /> Instagram
                </span>
              )}
              {socials.facebook && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">
                  <FaFacebook className="w-3 h-3" /> Facebook
                </span>
              )}
              {socials.linkedin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 text-[10px] font-bold">
                  <FaLinkedin className="w-3 h-3" /> LinkedIn
                </span>
              )}
              {socials.discord && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  <FaDiscord className="w-3 h-3" /> Discord
                </span>
              )}
              {socials.telegram && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 text-[10px] font-bold">
                  <FaTelegram className="w-3 h-3" /> Telegram
                </span>
              )}
              {socials.youtube && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold">
                  <FaYoutube className="w-3 h-3" /> YouTube
                </span>
              )}
              {socials.website && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                  <FaGlobeIcon className="w-3 h-3" /> Website
                </span>
              )}
              {customLinks.map((link, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200"
                >
                  <Share2 className="w-2.5 h-2.5 text-blue-600" /> {link.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Pricing Info & Tiers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline text-slate-800">
              {showPrice ? (
                <>
                  <span className="text-xs font-semibold text-slate-500 mr-1">
                    Starts from
                  </span>
                  <IndianRupee className="h-4.5 w-4.5 self-center font-bold text-blue-600" />
                  <span className="text-2xl font-extrabold text-blue-600">
                    {displayPrice}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 ml-1">
                    / {priceUnitLabel}
                  </span>
                </>
              ) : (
                <span className="text-xs font-medium text-slate-500 font-semibold">
                  {data.price_unit || "Price on enquiry / Flexible"}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Tiers breakdown */}
          {data.pricing_tiers &&
            data.pricing_tiers.filter((t) => t.label || t.price).length > 0 && (
              <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Fee Plans / Tiers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.pricing_tiers
                    .filter((t) => t.label || t.price)
                    .map((tier, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-xs"
                      >
                        <span>{tier.label || "Plan"}:</span>
                        <span className="text-blue-600 font-mono">
                          {tier.price ? `₹${tier.price}` : "Flexible"}
                        </span>
                        {tier.unit && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            /{tier.unit.replace(/^per\s+/i, "")}
                          </span>
                        )}
                      </span>
                    ))}
                </div>
              </div>
            )}

          {data.pricing_note && (
            <p className="text-[11px] text-slate-500 bg-blue-50/40 p-2 rounded-xl border border-blue-100/50">
              <span className="font-semibold text-blue-600">Note: </span>
              {data.pricing_note}
            </p>
          )}
        </div>

        {/* Description / About */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            About Teaching
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-4 whitespace-pre-line">
            {data.description ||
              "Describe what you teach and who you help. Your description will appear here..."}
          </p>
        </div>
      </div>
    </div>
  );
}
