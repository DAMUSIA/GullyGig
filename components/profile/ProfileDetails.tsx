"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Quote, Globe, Video, Share2 } from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { UserProfile, UserSocialLinks } from "@/lib/supabase";
import { getYouTubeEmbedUrl } from "@/lib/url";

interface ProfileDetailsProps {
  profile: UserProfile;
  isEditing: boolean;
  formData: {
    about: string;
    intro_video_url?: string;
    social_links?: UserSocialLinks;
  };
  onInputChange: (name: string, value: any) => void;
}

export default function ProfileDetails({
  profile,
  isEditing,
  formData,
  onInputChange,
}: ProfileDetailsProps) {
  const currentSocial = formData.social_links || profile.social_links || {};
  const currentIntroVideo =
    formData.intro_video_url ??
    profile.intro_video_url ??
    profile.social_links?.intro_video_url ??
    "";
  const embedUrl = getYouTubeEmbedUrl(currentIntroVideo);

  const handleSocialChange = (field: keyof UserSocialLinks, val: string) => {
    onInputChange("social_links", {
      ...currentSocial,
      [field]: val.trim(),
    });
  };

  const socialConfig = [
    {
      key: "whatsapp" as const,
      label: "WhatsApp Number / Link",
      icon: FaWhatsapp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      placeholder: "e.g. 8879514626 or wa.me/918879514626",
    },
    {
      key: "instagram" as const,
      label: "Instagram Profile",
      icon: FaInstagram,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      placeholder: "@yourhandle or instagram.com/...",
    },
    {
      key: "linkedin" as const,
      label: "LinkedIn Profile",
      icon: FaLinkedin,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      placeholder: "linkedin.com/in/...",
    },
    {
      key: "youtube" as const,
      label: "YouTube Channel",
      icon: FaYoutube,
      color: "text-red-500",
      bg: "bg-red-500/10",
      placeholder: "youtube.com/@channel",
    },
    {
      key: "telegram" as const,
      label: "Telegram Handle",
      icon: FaTelegram,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      placeholder: "t.me/username or @username",
    },
    {
      key: "discord" as const,
      label: "Discord Server / Tag",
      icon: FaDiscord,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      placeholder: "discord.gg/invite or user#1234",
    },
    {
      key: "website" as const,
      label: "Personal / Business Website",
      icon: Globe,
      color: "text-slate-600",
      bg: "bg-slate-100",
      placeholder: "https://yourwebsite.com",
    },
  ];

  return (
    <div className="space-y-6">
      {/* About Me Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            About Me
          </h3>
        </div>

        <div className="p-5 sm:p-6">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={formData.about}
                onChange={(e) => onInputChange("about", e.target.value)}
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 resize-none text-sm outline-none"
                placeholder="Share your teaching experience, qualifications, and unique strengths..."
              />
              <p className="text-xs text-gray-400 text-right font-medium">
                {formData.about?.length || 0}/500 characters
              </p>
            </div>
          ) : (
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 text-blue-100" />
              <p className="text-gray-600 leading-relaxed pl-5 text-sm sm:text-base whitespace-pre-line break-words">
                {profile.about ||
                  "Passionate professional dedicated to delivering top quality service and results. Contact directly to get started!"}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Intro Video Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Video className="w-4 h-4 text-red-600" />
            YouTube Introduction Video
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
            Portfolio Showcase
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  YouTube Video or Shorts URL
                </label>
                <div className="relative">
                  <FaYoutube className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500 w-4 h-4" />
                  <input
                    type="url"
                    value={formData.intro_video_url || ""}
                    onChange={(e) =>
                      onInputChange("intro_video_url", e.target.value)
                    }
                    placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-gray-900"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Paste any public or unlisted YouTube video URL. It will be featured directly on your public portfolio.
                </p>
              </div>

              {embedUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video max-w-md mx-auto shadow-sm">
                  <iframe
                    src={embedUrl}
                    title="Intro Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          ) : embedUrl ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video max-w-lg shadow-sm">
              <iframe
                src={embedUrl}
                title="Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              No introduction video linked yet. Edit profile to link a YouTube demo video.
            </p>
          )}
        </div>
      </motion.div>

      {/* Social Media Handles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-600" />
            Social Profiles &amp; Direct Messaging
          </h3>
        </div>

        <div className="p-5 sm:p-6">
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialConfig.map((item) => {
                const Icon = item.icon;
                const val = (formData.social_links as any)?.[item.key] || "";
                return (
                  <div key={item.key} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        handleSocialChange(item.key, e.target.value)
                      }
                      placeholder={item.placeholder}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {socialConfig
                .filter((item) => !!(profile.social_links as any)?.[item.key])
                .map((item) => {
                  const Icon = item.icon;
                  const val = (profile.social_links as any)?.[item.key];
                  return (
                    <span
                      key={item.key}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 ${item.bg}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{val}</span>
                    </span>
                  );
                })}
              {(!profile.social_links ||
                Object.values(profile.social_links).filter(Boolean).length ===
                  0) && (
                <p className="text-xs text-gray-500 italic">
                  No social profiles added yet. Click &quot;Edit Profile&quot; to link your WhatsApp, Instagram, LinkedIn, etc.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

