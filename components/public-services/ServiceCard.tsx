import React, { useState } from "react";
import { MapPin, Share2, Heart, Star } from "lucide-react";
import Icon from "@/components/Icon";
import { ServiceItem } from "./types";

interface ServiceCardProps {
  service: ServiceItem;
  onShowToast: (message: string) => void;
}

export default function ServiceCard({
  service,
  onShowToast,
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contacts = service.contact_numbers || [];
  const phoneFallback = service.users?.phone_no;
  const directPhone = contacts[0] || phoneFallback;
  const hasContacts = contacts.length > 0 || !!phoneFallback;

  // Utility to generate Initials for User Profile Image
  const getInitials = (name?: string) => {
    if (!name) return "SP";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Handle Share Button click (Copy URL to Clipboard)
  const handleShare = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/p/${serviceId}`
        : `https://gullygig.in/p/${serviceId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Verify this Service Portfolio on GullyGig",
          url: url,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        onShowToast("Portfolio link copied to clipboard!");
      } catch {
        onShowToast("Failed to copy link. Please manually copy URL.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col gap-4 group relative min-w-0 w-full overflow-hidden">
      {/* 1. Top Header: Provider Info & Ratings */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            {getInitials(service.users?.full_name)}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h4
              className="text-sm font-semibold text-slate-900 dark:text-white truncate w-full"
              title={service.users?.full_name}
            >
              {service.users?.full_name || "Verified Provider"}
            </h4>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase tracking-wider mt-1 truncate w-max max-w-full">
              {service.category}
            </span>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {service.rating_average
                ? Number(service.rating_average).toFixed(1)
                : "0.0"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium shrink-0">
              ({service.reviews_count || 0})
            </span>
          </div>
          <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-600 shrink-0" />
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {service.likes_count || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle Content: Title, Collapsible Description & Badges */}
      <div className="flex flex-col gap-2.5 min-w-0 w-full">
        {/* Title updated with break-words and line-clamp to prevent horizontal overflow */}
        <h3
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words line-clamp-2 w-full overflow-hidden"
          title={service.title}
        >
          {service.title}
        </h3>

        {/* Read More / Show Less Description */}
        {(() => {
          const descriptionThreshold = 150;
          const fullDesc = service.description || "";
          const isLongDescription = fullDesc.length > descriptionThreshold;
          const displayDescription =
            isLongDescription && !isExpanded
              ? `${fullDesc.slice(0, descriptionThreshold)}...`
              : fullDesc;

          return (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line break-words w-full overflow-hidden">
              {displayDescription}
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1.5 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer inline-flex items-center text-xs transition-colors shrink-0"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </p>
          );
        })()}

        {/* Clean Badges (Location + Meta) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 min-w-0 w-full">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 min-w-0 max-w-full">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span
              className="truncate max-w-full"
              title={[service.area, service.city].filter(Boolean).join(", ")}
            >
              {[service.area, service.city].filter(Boolean).join(", ")}
            </span>
          </div>

          {service.service_modes && service.service_modes.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 min-w-0 max-w-full">
              <Icon
                name="home"
                className="text-[14px] text-slate-400 shrink-0"
              />
              <span className="truncate max-w-full">
                {service.service_modes.join(", ")}
              </span>
            </div>
          )}

          {service.languages && service.languages.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 min-w-0 max-w-full">
              <Icon
                name="language"
                className="text-[14px] text-slate-400 shrink-0"
              />
              <span className="truncate max-w-full">
                {service.languages.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Footer: Pricing, Contact & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-1 min-w-0 w-full">
        {/* Left side: Price & Phone */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1 w-full">
          {service.starting_price ? (
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
                Starts at
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white break-words">
                ₹{service.starting_price}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                /
                {service.price_unit
                  ? service.price_unit.toLowerCase().replace("per ", "")
                  : "hr"}
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800 w-max max-w-full truncate">
              Price on Enquiry
            </span>
          )}

          {/* Contact Numbers */}
          {hasContacts ? (
            <div className="flex flex-wrap gap-3 min-w-0 w-full">
              {(contacts.length > 0 ? contacts : [phoneFallback]).map(
                (num, i) => (
                  <a
                    key={i}
                    href={`tel:${num}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/phone focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm min-w-0 max-w-full"
                  >
                    <Icon
                      name="call"
                      className="text-xs text-emerald-500 group-hover/phone:text-blue-500 transition-colors shrink-0"
                      fill
                    />
                    <span className="truncate">{num}</span>
                  </a>
                ),
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic truncate w-full">
              No direct contact numbers
            </span>
          )}
        </div>

        {/* Right side: Share & Call Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end shrink-0">
          <button
            onClick={(e) => handleShare(e, service.id)}
            title="Share Service Link"
            className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95 shrink-0"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {hasContacts && directPhone && (
            <a
              href={`tel:${directPhone}`}
              className="h-10 inline-flex items-center justify-center gap-2 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 focus:ring-2 focus:ring-emerald-500 focus:outline-none flex-1 sm:flex-none whitespace-nowrap"
            >
              <Icon name="call" className="text-sm text-white shrink-0" fill />
              <span>Call Now</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
