"use client";

import React from "react";
import { User, MapPin, Calendar, ShieldCheck, Briefcase } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaGlobe as FaGlobeIcon,
} from "react-icons/fa6";

interface PortfolioProviderProps {
  fullName: string;
  location: string | null;
  about: string | null;
  memberSince?: string;
  isVerified?: boolean;
  languages?: string[];
  availability?: string[];
  rating?: number;
  totalReviews?: number;
  totalServices?: number;
  darkMode?: boolean;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
}

export default function PortfolioProvider({
  fullName,
  location,
  about,
  memberSince = "2024",
  isVerified = true,
  darkMode = true,
  socialLinks,
}: PortfolioProviderProps) {
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "P";
  const hasSocials =
    socialLinks && Object.values(socialLinks).some((val) => Boolean(val));

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
              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
              : "bg-blue-50 border-blue-200 text-blue-600"
          }`}
        >
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">
            Service Provider
          </h3>
          <p
            className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Verified professional partner on GullyGig
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div
        className={`p-6 rounded-2xl border text-center transition-all duration-300 ${
          darkMode
            ? "bg-slate-950/60 border-slate-800/80"
            : "bg-slate-50/80 border-slate-200"
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/10">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center text-2xl font-extrabold ${
                  darkMode
                    ? "bg-slate-950 text-white"
                    : "bg-white text-blue-700"
                }`}
              >
                {initial}
              </div>
            </div>
            {isVerified && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm"
                title="Verified Partner"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Full Name */}
          <h4 className="text-lg font-bold tracking-tight">{fullName}</h4>

          {/* Location */}
          {location && (
            <div
              className={`flex items-center justify-center gap-1.5 text-xs font-medium mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}

          {/* Member Since */}
          <div
            className={`flex items-center justify-center gap-1.5 mt-2 text-[11px] font-medium ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>GullyGig Partner since {memberSince}</span>
          </div>

          {/* Social Links */}
          {hasSocials && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 w-full">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  title="Instagram Profile"
                >
                  <FaInstagram className="w-4 h-4 text-pink-500" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  title="Facebook Profile"
                >
                  <FaFacebook className="w-4 h-4 text-blue-500" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  title="LinkedIn Profile"
                >
                  <FaLinkedin className="w-4 h-4 text-sky-500" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  title="YouTube Channel"
                >
                  <FaYoutube className="w-4 h-4 text-red-500" />
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  title="Website"
                >
                  <FaGlobeIcon className="w-4 h-4 text-emerald-500" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Provider Bio */}
      {about && (
        <div className="space-y-2">
          <h4
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-500" />
            About Provider
          </h4>
          <p
            className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-2xl border ${
              darkMode
                ? "bg-slate-950/40 border-slate-800/60 text-slate-300"
                : "bg-slate-50/70 border-slate-200 text-slate-700"
            }`}
          >
            {about}
          </p>
        </div>
      )}
    </div>
  );
}
