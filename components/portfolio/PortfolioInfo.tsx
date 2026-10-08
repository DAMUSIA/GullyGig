import {
  Sparkles,
  Clock,
  Globe,
  Laptop,
  CheckCircle,
  Zap,
  Tag,
  Check,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa6";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/lib/url";

interface PricingTier {
  label: string;
  price: number | string;
  unit: string;
}

interface PortfolioInfoProps {
  description: string;
  serviceModes: string[];
  languages: string[];
  availability: string[];
  startingPrice?: number | null;
  priceUnit?: string | null;
  pricingNote?: string | null;
  pricingTiers?: PricingTier[] | null;
  introVideoUrl?: string | null;
  darkMode?: boolean;
}

export default function PortfolioInfo({
  description,
  serviceModes,
  languages,
  availability,
  startingPrice,
  priceUnit,
  pricingNote,
  pricingTiers,
  introVideoUrl,
  darkMode = true,
}: PortfolioInfoProps) {
  const videoId = getYouTubeVideoId(introVideoUrl);
  const embedUrl = getYouTubeEmbedUrl(introVideoUrl);

  const validTiers = (pricingTiers || []).filter(
    (t) =>
      t.label?.trim() ||
      (t.price !== "" && t.price !== null && t.price !== undefined),
  );

  return (
    <div className="space-y-6">
      {/* Main Service Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden space-y-6 ${
          darkMode
            ? "bg-slate-900/90 border-slate-800 text-white shadow-xl shadow-slate-950/40"
            : "bg-white border-slate-200/90 text-slate-900 shadow-md"
        }`}
      >
        {/* Subtle decorative background gradient pill */}
        <div
          className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            darkMode ? "bg-blue-600/10" : "bg-blue-500/10"
          }`}
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`p-3 rounded-2xl border shrink-0 ${
                darkMode
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-blue-50 border-blue-200 text-blue-600"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  About This Service
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Ad Showcase
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Comprehensive details, scope of work &amp; service
                specifications
              </p>
            </div>
          </div>

          {(startingPrice || pricingNote || validTiers.length > 0) && (
            <div className="flex flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
              {startingPrice && (
                <div
                  className={`flex items-center justify-between sm:justify-end gap-3 px-4 py-2.5 rounded-2xl border w-full sm:w-auto ${
                    darkMode
                      ? "bg-slate-950/60 border-slate-800 text-emerald-400"
                      : "bg-slate-50 border-slate-200 text-emerald-700"
                  }`}
                >
                  <Tag className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold block text-slate-400">
                      Starts From
                    </span>
                    <span className="text-base font-extrabold font-mono">
                      ₹{startingPrice}
                      {priceUnit && (
                        <span className="text-xs font-normal text-slate-400">
                          {" "}
                          / {priceUnit.replace(/^per\s+/i, "").toLowerCase()}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
              {pricingNote && (
                <div
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-xl border w-full sm:w-auto sm:text-right ${
                    darkMode
                      ? "bg-slate-950/40 border-slate-800/80 text-slate-300"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <span className="text-blue-500 font-semibold mr-1">
                    Fee notes:
                  </span>
                  {pricingNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Plans Breakdown Grid (if tiers present) */}
        {validTiers.length > 0 && (
          <div className="space-y-2.5">
            <h3
              className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              Custom Fee Plans &amp; Tiers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {validTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                    darkMode
                      ? "bg-slate-950/60 border-slate-800/90 hover:border-slate-700"
                      : "bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">
                      Plan #{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold block leading-snug ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {tier.label || "General Plan"}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-baseline justify-between">
                    <span className="text-sm font-extrabold font-mono text-emerald-500">
                      {tier.price ? `₹${tier.price}` : "Flexible"}
                    </span>
                    {tier.unit && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {" / "}
                        {tier.unit.replace(/^per\s+/i, "")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlight Feature Badges Bar (Only if any badge exists) */}
        {Boolean(
          (serviceModes && serviceModes.length > 0) ||
          (languages && languages.length > 0) ||
          (availability && availability.length > 0),
        ) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {serviceModes && serviceModes.length > 0 && (
              <div
                className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                  darkMode
                    ? "bg-slate-950/50 border-slate-800/80"
                    : "bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Laptop className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    Mode
                  </span>
                  <span className="text-xs font-bold truncate block">
                    {serviceModes[0]}
                  </span>
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div
                className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                  darkMode
                    ? "bg-slate-950/50 border-slate-800/80"
                    : "bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    Languages
                  </span>
                  <span className="text-xs font-bold truncate block">
                    {languages.slice(0, 2).join(", ")}
                  </span>
                </div>
              </div>
            )}

            {availability && availability.length > 0 && (
              <div
                className={`p-3 rounded-2xl border flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
                  darkMode
                    ? "bg-slate-950/50 border-slate-800/80"
                    : "bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    Availability
                  </span>
                  <span className="text-xs font-bold truncate block">
                    {availability.slice(0, 2).join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* YouTube Video Demo Player (if available) */}
        {videoId && embedUrl && (
          <div className="space-y-3">
            <h3
              className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <FaYoutube className="w-4 h-4 text-red-600" />
              <span>Introduction &amp; Video Demonstration</span>
            </h3>
            <div
              className={`rounded-2xl overflow-hidden border shadow-lg ${
                darkMode
                  ? "bg-black border-slate-800"
                  : "bg-black border-slate-200"
              }`}
            >
              <div className="relative w-full aspect-video">
                <iframe
                  src={embedUrl}
                  title="Service Introduction Video"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Description Body (Only if description is present) */}
        {description && description.trim().length > 0 && (
          <div className="space-y-3">
            <h3
              className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              Service Overview
            </h3>
            <div
              className={`p-5 rounded-2xl border text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                darkMode
                  ? "bg-slate-950/40 border-slate-800/60 text-slate-300"
                  : "bg-slate-50/70 border-slate-200/70 text-slate-800"
              }`}
            >
              {description}
            </div>
          </div>
        )}

        {/* Expanded Specs: Service Modes & Availability Lists (Only if present) */}
        {Boolean(
          (serviceModes && serviceModes.length > 0) ||
          (languages && languages.length > 0),
        ) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            {/* Service Modes */}
            {serviceModes && serviceModes.length > 0 && (
              <div className="space-y-3">
                <h4
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <Laptop className="w-4 h-4 text-blue-500" />
                  Service Fulfillment Modes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {serviceModes.map((mode) => (
                    <span
                      key={mode}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        darkMode
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Spoken */}
            {languages && languages.length > 0 && (
              <div className="space-y-3">
                <h4
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Languages Supported
                </h4>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        darkMode
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
