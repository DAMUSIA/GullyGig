"use client";

import React, { useState } from "react";
import { Phone, Copy, Check, MessageSquare, ExternalLink } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
  FaTelegram,
  FaTwitter,
  FaGlobe as FaGlobeIcon,
} from "react-icons/fa6";

interface CustomSocialLink {
  name: string;
  url: string;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
  discord?: string;
  telegram?: string;
  whatsapp?: string;
  twitter?: string;
  intro_video_url?: string;
  custom_links?: CustomSocialLink[];
}

interface PortfolioContactProps {
  contactNumbers: string[];
  serviceTitle: string;
  darkMode?: boolean;
  socialLinks?: SocialLinks;
}

function formatUrl(url: string, platform: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  switch (platform) {
    case "instagram":
      return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
    case "telegram":
      return `https://t.me/${trimmed.replace(/^@/, "")}`;
    case "whatsapp": {
      const clean = trimmed.replace(/\D/g, "");
      return clean.length === 10
        ? `https://wa.me/91${clean}`
        : `https://wa.me/${clean}`;
    }
    case "twitter":
      return `https://x.com/${trimmed.replace(/^@/, "")}`;
    case "youtube":
      return trimmed.startsWith("@")
        ? `https://youtube.com/${trimmed}`
        : `https://${trimmed}`;
    default:
      return `https://${trimmed}`;
  }
}

export default function PortfolioContact({
  contactNumbers,
  serviceTitle,
  darkMode = true,
  socialLinks,
}: PortfolioContactProps) {
  const [copiedPhoneIdx, setCopiedPhoneIdx] = useState<number | null>(null);

  const cleanNumber = (num: string) => num.replace(/\D/g, "");

  const copyPhoneToClipboard = async (num: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopiedPhoneIdx(idx);
      setTimeout(() => setCopiedPhoneIdx(null), 2000);
    } catch (err) {
      console.error("Failed to copy phone:", err);
    }
  };

  const customLinks = (socialLinks?.custom_links || []).filter(
    (l) => l.name?.trim() && l.url?.trim(),
  );

  const hasSocials =
    (socialLinks &&
      Object.entries(socialLinks).some(
        ([key, val]) =>
          key !== "intro_video_url" &&
          key !== "custom_links" &&
          Boolean(val && typeof val === "string" && val.trim()),
      )) ||
    customLinks.length > 0;

  // If no contact numbers and no social profiles are provided, do not render this section at all
  if (contactNumbers.length === 0 && !hasSocials) {
    return null;
  }

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 space-y-6 ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-white shadow-xl shadow-slate-950/40"
          : "bg-white border-slate-200/90 text-slate-900 shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div
          className={`p-3 rounded-2xl border ${
            darkMode
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-emerald-50 border-emerald-200 text-emerald-600"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">
            Direct Contact &amp; Connect
          </h3>
          <p
            className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Instant call, WhatsApp enquiry, &amp; official social profiles
          </p>
        </div>
      </div>

      {/* Contact Numbers List (Only if numbers are provided) */}
      {contactNumbers.length > 0 && (
        <div className="space-y-4">
          {contactNumbers.map((number, idx) => {
            const cleaned = cleanNumber(number);
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 space-y-4 ${
                  darkMode
                    ? "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        darkMode
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-blue-50 text-blue-600 border-blue-200"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Direct Line{" "}
                        {contactNumbers.length > 1 ? `#${idx + 1}` : ""}
                      </span>
                      <span
                        className={`text-base sm:text-lg font-bold font-mono tracking-tight block truncate ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        +91 {number}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyPhoneToClipboard(number, idx)}
                    className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      darkMode
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                        : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                    title="Copy phone number"
                  >
                    {copiedPhoneIdx === idx ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Call & WhatsApp Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${cleaned}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href={`https://wa.me/91${cleaned}?text=${encodeURIComponent(
                      `Hello! I found your service "${serviceTitle}" on GullyGig and would like to enquire.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <FaWhatsapp className="w-4.5 h-4.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Social Media & Online Profiles Section */}
      {hasSocials && (
        <div className="pt-2 space-y-3">
          <h4
            className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            Social Profiles &amp; Online Connect
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {socialLinks?.whatsapp && (
              <a
                href={formatUrl(socialLinks.whatsapp, "whatsapp")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>
            )}

            {socialLinks?.instagram && (
              <a
                href={formatUrl(socialLinks.instagram, "instagram")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaInstagram className="w-4 h-4 text-pink-500 shrink-0" />
                <span className="truncate">Instagram</span>
              </a>
            )}

            {socialLinks?.linkedin && (
              <a
                href={formatUrl(socialLinks.linkedin, "linkedin")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaLinkedin className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="truncate">LinkedIn</span>
              </a>
            )}

            {socialLinks?.discord && (
              <a
                href={formatUrl(socialLinks.discord, "discord")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaDiscord className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">Discord</span>
              </a>
            )}

            {socialLinks?.telegram && (
              <a
                href={formatUrl(socialLinks.telegram, "telegram")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaTelegram className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">Telegram</span>
              </a>
            )}

            {socialLinks?.youtube && (
              <a
                href={formatUrl(socialLinks.youtube, "youtube")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaYoutube className="w-4 h-4 text-red-500 shrink-0" />
                <span className="truncate">YouTube</span>
              </a>
            )}

            {socialLinks?.twitter && (
              <a
                href={formatUrl(socialLinks.twitter, "twitter")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaTwitter className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">Twitter / X</span>
              </a>
            )}

            {socialLinks?.facebook && (
              <a
                href={formatUrl(socialLinks.facebook, "facebook")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaFacebook className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">Facebook</span>
              </a>
            )}

            {socialLinks?.website && (
              <a
                href={formatUrl(socialLinks.website, "website")}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all col-span-2 ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <FaGlobeIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">Official Website / Portfolio</span>
              </a>
            )}

            {customLinks.map((link, idx) => (
              <a
                key={idx}
                href={formatUrl(link.url, link.name.toLowerCase())}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  darkMode
                    ? "bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-200"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
