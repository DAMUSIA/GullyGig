"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Tag,
} from "lucide-react";
import Image from "next/image";

interface PosterTemplateProps {
  title: string;
  category: string;
  description: string;
  startingPrice: number | null;
  priceUnit: string | null;
  location: string;
  contactNumbers: string[];
  portfolioUrl: string;
  providerName: string;
  ratingAverage: number;
  templateId: string;
  typography: string;
  ctaText: string;
}

export default function PosterTemplate({
  title,
  category,
  description,
  startingPrice,
  priceUnit,
  location,
  contactNumbers,
  providerName,
  ratingAverage,
  templateId,
  typography,
  ctaText,
}: PosterTemplateProps) {
  // Sanitize data inputs to remove folder/profile names like 'Damusia' and use standard fallback names
  const cleanProviderName = providerName.replace(
    /damusia/gi,
    "Verified Provider",
  );
  const cleanTitle = title.replace(/damusia/gi, "GullyGig");
  const cleanDescription = description.replace(/damusia/gi, "GullyGig");

  // Setup QR Code Url
  const qrCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwww.gullygig.in";

  // Typography selector
  const getFontClass = () => {
    switch (typography) {
      case "professional":
        return "font-serif tracking-normal";
      case "bold":
        return "font-sans font-black tracking-tighter uppercase";
      case "minimal":
        return "font-mono tracking-widest uppercase";
      case "modern":
      default:
        return "font-sans tracking-tight";
    }
  };

  // Primary contacts helper
  const mainContact =
    contactNumbers.length > 0 ? contactNumbers[0] : "Call Provider";
  const secondaryContact = contactNumbers.length > 1 ? contactNumbers[1] : null;

  // Render templates
  switch (templateId) {
    // -------------------------------------------------------------
    // TEMPLATE 1: Modern Business
    // -------------------------------------------------------------
    case "business":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100/50 p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Subtle glow effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

          {/* Header - Logo at Top Left, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between">
            <div className="flex-shrink-0 relative w-25 h-20">
              <Image
                src="/logo_dark.png"
                alt="GullyGig Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[7px] font-bold uppercase tracking-widest bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-lg shadow-blue-600/25 whitespace-nowrap ml-2">
              Premium Service
            </span>
          </div>

          {/* Service Icon and Title Section */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {cleanTitle}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide">
              Professional • Trusted • Personalized Service
            </p>

            {/* Rating Pill */}
            <div className="inline-flex items-center gap-1.5 mt-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3.5 py-1 rounded-full shadow-sm">
              <span className="text-amber-400 text-xs">⭐</span>
              <span className="text-xs font-extrabold text-slate-900">
                {ratingAverage.toFixed(1)}
              </span>
              <span className="text-[8px] text-slate-400 font-medium">•</span>
              <span className="text-[8px] text-slate-500 font-medium">
                (245 Reviews)
              </span>
            </div>
          </div>

          {/* Contact Card with QR */}
          <div className="bg-white/95 backdrop-blur-md border border-blue-100/80 rounded-2xl p-3.5 shadow-lg shadow-blue-100/50 z-10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-[7px] font-extrabold uppercase tracking-widest text-blue-600">
                    Contact Professional
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900">
                  {cleanProviderName}
                </p>
                <p className="text-sm font-black text-blue-600">
                  {mainContact}
                </p>
                <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                  <MapPin className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                  <span>Available Online &amp; Offline</span>
                </div>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-white border border-blue-100 rounded-xl p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-14 h-14 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-2.5 bg-gradient-to-r from-blue-50 to-indigo-50/70 rounded-xl p-2.5 text-center z-10 shrink-0">
            <p className="text-[8px] font-semibold text-slate-600 mb-1.5">
              Book your service today.
            </p>
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-extrabold uppercase tracking-widest py-2 rounded-lg shadow-md shadow-blue-600/25 flex items-center justify-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              Call Now
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1.5 pt-1.5 border-t border-blue-100/50 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[6.5px] font-bold text-slate-400 z-10 shrink-0">
            <span className="font-extrabold text-blue-600">GullyGig:</span>
            <span>www.gullygig.in</span>
            <span>•</span>
            <span>support@gullygig.in</span>
            <span>•</span>
            <span>Insta: @gully.gig</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 2: Local Service (IMPROVED DESIGN)
    // -------------------------------------------------------------
    case "local":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Professional Background Geometric Patterns */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] select-none">
            {/* Large geometric shapes */}
            <div className="absolute top-10 right-10 w-32 h-32 border-2 border-emerald-600 rounded-full" />
            <div className="absolute bottom-10 left-10 w-40 h-40 border-2 border-emerald-600 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-emerald-400 rounded-full" />

            {/* Dots pattern */}
            <div className="absolute top-20 right-1/4">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-emerald-600 rounded-full"
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-20 left-1/4">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-emerald-600 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Decorative lines */}
            <div className="absolute top-1/3 right-8 w-16 h-px bg-emerald-600" />
            <div className="absolute bottom-1/3 left-8 w-16 h-px bg-emerald-600" />
            <div className="absolute top-8 left-1/3 w-px h-12 bg-emerald-600" />
            <div className="absolute bottom-8 right-1/3 w-px h-12 bg-emerald-600" />

            {/* Small geometric shapes */}
            <div className="absolute top-24 right-24 w-6 h-6 border border-emerald-600 rounded-sm rotate-45" />
            <div className="absolute bottom-24 left-24 w-6 h-6 border border-emerald-600 rounded-sm rotate-45" />
            <div className="absolute top-40 right-1/3 w-4 h-4 border border-emerald-400 rounded-full" />
            <div className="absolute bottom-40 left-1/3 w-4 h-4 border border-emerald-400 rounded-full" />

            {/* Additional dots for more visibility */}
            <div className="absolute top-32 right-1/2">
              <div className="grid grid-cols-3 gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-emerald-600 rounded-full"
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-32 left-1/2">
              <div className="grid grid-cols-3 gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-emerald-600 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Subtle professional glow effects - Increased slightly */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/12 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/12 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/8 rounded-full blur-3xl" />

          {/* Header - Logo at Top Left, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0 relative w-25 h-20">
              <Image
                src="/logo_dark.png"
                alt="GullyGig Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[7px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-3 py-1 rounded-full shadow-lg shadow-emerald-600/20 whitespace-nowrap ml-2">
              Premium Service
            </span>
          </div>

          {/* Service Title Section */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
              {cleanTitle}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide">
              Trusted • Professional • Personalized
            </p>

            {/* Location Highlight - Professional */}
            <div className="flex items-center gap-2 mt-2.5 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-semibold text-slate-700">
                Serving in {location || "Your City"}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-[8px] font-medium text-emerald-600">
                Online &amp; On-site
              </span>
            </div>
          </div>

          {/* Contact Card with QR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 z-10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[7px] font-semibold uppercase tracking-widest text-slate-500">
                    Contact
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800">
                  {cleanProviderName}
                </p>
                <p className="text-sm font-bold text-emerald-600">
                  {mainContact}
                </p>
                <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                  <span>Available</span>
                  <span className="font-semibold text-slate-700">
                    Online &amp; Offline
                  </span>
                </div>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-14 h-14 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Row - Professional */}
          <div className="mt-2 grid grid-cols-4 gap-1.5 z-10 shrink-0">
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Trusted
              </span>
              <span className="text-[5px] text-slate-500 block">
                Verified professional
              </span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Experienced
              </span>
              <span className="text-[5px] text-slate-500 block">
                Skilled expertise
              </span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Personalized
              </span>
              <span className="text-[5px] text-slate-500 block">
                Tailored solutions
              </span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Local
              </span>
              <span className="text-[5px] text-slate-500 block">
                Nearby &amp; available
              </span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-2 bg-slate-50/80 border border-slate-200/60 rounded-xl p-2 text-center z-10 shrink-0">
            <p className="text-[8px] font-medium text-slate-600 mb-1">
              Ready to get started? Connect today and take the next step.
            </p>
            <div className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 rounded-lg shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all duration-200">
              <Phone className="h-3 w-3" />
              Call Now
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 border-t border-slate-200/50 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[6px] font-medium text-slate-400 z-10 shrink-0">
            <span className="font-bold text-slate-600">GullyGig:</span>
            <span>www.gullygig.in</span>
            <span className="text-slate-300">•</span>
            <span>support@gullygig.in</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-slate-600">Insta :@gully.gig</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 3: Tutor
    // -------------------------------------------------------------
    case "tutor":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-amber-50/80 via-white to-sage-50/50 p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(141, 181, 150, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(91, 141, 239, 0.05) 0%, transparent 50%)
            `,
          }}
        >
          {/* Educational Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Subtle glow effects */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sage-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/8 rounded-full blur-3xl" />

          {/* Header - Logo at Top Left, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0 relative w-25 h-20">
              <Image
                src="/logo_dark.png"
                alt="GullyGig Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[7px] font-bold uppercase tracking-widest bg-gradient-to-r from-sage-600 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-sage-500/20 whitespace-nowrap ml-2">
              Premium Service
            </span>
          </div>

          {/* Service Icon and Title Section */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
              {cleanTitle}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide">
              Learn • Grow • Succeed
            </p>

            {/* Location Highlight */}
            <div className="flex items-center gap-2 mt-2.5 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-sage-600 shrink-0" />
              <span className="text-[10px] font-semibold text-slate-700">
                Available Near You
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-[8px] font-medium text-sage-600">
                Online &amp; Offline
              </span>
            </div>
          </div>

          {/* Contact Card with QR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 z-10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-sage-600" />
                  <span className="text-[7px] font-semibold uppercase tracking-widest text-slate-500">
                    Contact
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800">
                  {cleanProviderName}
                </p>
                <p className="text-sm font-bold text-sage-600">{mainContact}</p>
                <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                  <span>Available</span>
                  <span className="font-semibold text-slate-700">
                    Online &amp; Offline Sessions
                  </span>
                </div>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-14 h-14 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Row - Educational Theme */}
          <div className="mt-2 grid grid-cols-4 gap-1.5 z-10 shrink-0">
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Qualified
              </span>
              <span className="text-[5px] text-slate-500 block">
                Certified expert
              </span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Personalized
              </span>
              <span className="text-[5px] text-slate-500 block">
                Custom learning plans
              </span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Proven
              </span>
              <span className="text-[5px] text-slate-500 block">
                Track record of success
              </span>
            </div>
            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-1.5 text-center hover:shadow-md transition-all duration-200">
              <span className="text-[7px] font-bold text-slate-700 block">
                Flexible
              </span>
              <span className="text-[5px] text-slate-500 block">
                Learn at your pace
              </span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-2 bg-slate-50/80 border border-slate-200/60 rounded-xl p-2 text-center z-10 shrink-0">
            <p className="text-[8px] font-medium text-slate-600 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="h-2.5 w-2.5 text-sage-600 inline" />
              <span>
                Start your learning journey today! Build your future with
                confidence.
              </span>
              <Sparkles className="h-2.5 w-2.5 text-sage-600 inline" />
            </p>
            <div className="w-full bg-gradient-to-r from-sage-600 to-blue-600 hover:from-sage-700 hover:to-blue-700 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 rounded-lg shadow-md shadow-sage-600/20 flex items-center justify-center gap-2 transition-all duration-200">
              <Phone className="h-3 w-3" />
              Book a Demo
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 border-t border-slate-200/50 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[6px] font-medium text-slate-400 z-10 shrink-0">
            <span className="font-bold text-slate-600">GullyGig:</span>
            <span>www.gullygig.in</span>
            <span className="text-slate-300">•</span>
            <span>support@gullygig.in</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-slate-600">Insta :@gully.gig</span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 4: Freelancer
    // -------------------------------------------------------------
    case "freelancer":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#05080F] via-[#0B1120] to-[#0F172A] p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements - Enhanced */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] select-none">
            {/* Grid pattern - more refined */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
                backgroundSize: "32px 32px",
              }}
            />

            {/* Floating dots - more elegant */}
            <div className="absolute top-16 right-16">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-blue-400/60 rounded-full"
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-16 left-16">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-0.5 bg-violet-400/60 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Abstract geometric lines */}
            <div className="absolute top-1/3 right-12 w-32 h-px bg-gradient-to-l from-blue-500/20 to-transparent" />
            <div className="absolute bottom-1/3 left-12 w-32 h-px bg-gradient-to-r from-violet-500/20 to-transparent" />
            <div className="absolute top-12 left-1/2 w-px h-16 bg-gradient-to-b from-blue-500/10 to-transparent" />
            <div className="absolute bottom-12 left-1/2 w-px h-16 bg-gradient-to-t from-violet-500/10 to-transparent" />

            {/* Subtle circular rings */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-blue-500/5 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-violet-500/5 rounded-full" />
          </div>

          {/* Premium glow effects - Enhanced */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/3 rounded-full blur-3xl" />

          {/* Additional luxury glow */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

          {/* Header - Logo at Top Left, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0 relative w-25 h-20">
              <Image
                src="/logo_light.png"
                alt="GullyGig Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-blue-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10 text-white px-3.5 py-1.5 rounded-full shadow-lg shadow-blue-500/10 whitespace-nowrap ml-2">
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Premium Service
              </span>
            </span>
          </div>

          {/* Hero Section - Elevated */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            {/* Small decorative line above */}
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent mb-2" />

            <p className="text-[9px] font-light text-slate-500 tracking-[0.2em] uppercase mb-0.5">
              Hello, I&apos;m a
            </p>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent tracking-tight leading-tight">
              {cleanTitle}
            </h2>
            <p className="text-[10px] text-slate-400 font-light mt-0.5 tracking-[0.15em]">
              Design <span className="text-slate-600 mx-1">•</span> Build{" "}
              <span className="text-slate-600 mx-1">•</span> Deliver
            </p>

            {/* Decorative line below */}
            <div className="w-8 h-px bg-gradient-to-r from-violet-400/30 via-transparent to-blue-400/30 mt-2" />

            {/* Availability Badge - More premium */}
            <div className="flex items-center gap-2 mt-2.5 bg-[#1E293B]/40 backdrop-blur-sm px-5 py-1.5 rounded-full border border-white/5 shadow-lg shadow-black/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-light text-slate-300 tracking-wide">
                Available Worldwide
              </span>
              <span className="w-px h-3 bg-slate-700" />
              <span className="text-[8px] font-light text-blue-400 tracking-wide">
                Remote &amp; On-site
              </span>
            </div>
          </div>

          {/* Contact Card - Premium Glassmorphism - Enhanced */}
          <div className="bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-2xl shadow-black/30 z-10 shrink-0 hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-[9px] font-bold text-white">JD</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white tracking-wide">
                      {cleanProviderName}
                    </p>
                    <p className="text-[6px] text-slate-400 font-light tracking-wider">
                      Freelance Professional
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {mainContact}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[7px] text-slate-400">
                  <span className="font-light flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5 text-slate-400" />
                    <span>{cleanProviderName.toLowerCase()}@gmail.com</span>
                  </span>
                  <span className="w-px h-3 bg-slate-700" />
                  <span className="font-light flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5 text-slate-400" />
                    <span>gullygig.in</span>
                  </span>
                  <span className="w-px h-3 bg-slate-700" />
                  <span className="text-slate-500 font-light flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-slate-500" />
                    <span>{location}</span>
                  </span>
                </div>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-[#0F172A] border border-white/5 rounded-xl p-1.5 shadow-lg shadow-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-12 h-12 bg-white rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA - Premium */}
          <div className="mt-2 bg-[#1E293B]/30 backdrop-blur-sm border border-white/5 rounded-xl p-2.5 text-center z-10 shrink-0 hover:border-white/10 transition-all duration-300">
            <p className="text-[8px] font-medium text-slate-300 mb-0.5 tracking-wide">
              Let&apos;s Build Something Extraordinary Together
            </p>
            <p className="text-[6px] text-slate-500 font-light mb-1.5 tracking-wider">
              I transform ideas into powerful digital experiences that drive
              results.
            </p>
            <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-violet-600 hover:from-blue-700 hover:via-blue-800 hover:to-violet-700 text-white text-[10px] font-bold uppercase tracking-[0.15em] py-2 rounded-xl shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-blue-600/40 hover:scale-[1.02]">
              <Phone className="h-3 w-3" />
              Contact Me
            </div>
          </div>

          {/* Footer - Premium */}
          <div className="mt-1 pt-1.5 border-t border-white/5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[6px] font-light text-slate-500 z-10 shrink-0">
            <span className="font-medium text-slate-400 tracking-wide">
              GullyGig:
            </span>
            <span>www.gullygig.in</span>
            <span className="text-slate-700">•</span>
            <span>support@gullygig.in</span>
            <span className="text-slate-700">•</span>
            <span className="font-medium text-slate-400">
              Insta :@gully.gig
            </span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 5: Premium Dark
    // -------------------------------------------------------------
    case "dark":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#08111F] via-[#0A0A0A] to-[#0F1A2E] p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements - Dark Blue & Gold */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Dark blue and gold concentric circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#2563EB]/8 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#D4AF37]/6 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#2563EB]/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[#D4AF37]/8 rounded-full" />

            {/* Blue and gold radial gradients */}
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#2563EB]/6 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#D4AF37]/6 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2563EB]/4 rounded-full blur-3xl" />

            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212, 175, 55, 0.08) 1px, transparent 1px)
              `,
                backgroundSize: "60px 60px",
              }}
            />

            {/* Blue and gold particles */}
            <div className="absolute top-12 right-24 w-1 h-1 bg-[#D4AF37]/20 rounded-full shadow-lg shadow-[#D4AF37]/5" />
            <div className="absolute top-28 right-44 w-0.5 h-0.5 bg-[#2563EB]/20 rounded-full" />
            <div className="absolute bottom-12 left-24 w-1 h-1 bg-[#D4AF37]/20 rounded-full shadow-lg shadow-[#D4AF37]/5" />
            <div className="absolute bottom-28 left-44 w-0.5 h-0.5 bg-[#2563EB]/20 rounded-full" />

            {/* Corner highlights - Blue & Gold */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF37]/15" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#2563EB]/15" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#2563EB]/15" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF37]/15" />
          </div>

          {/* Header - Logo at Top Left, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0">
              <div className="relative w-25 h-20">
                <Image
                  src="/logo_light.png"
                  alt="GullyGig Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[7px] font-light text-[#D4AF37]/50 tracking-[0.3em] uppercase mt-0.5">
                Work. Connect. Grow.
              </p>
            </div>
            <span className="text-[7px] font-medium uppercase tracking-[0.2em] bg-[#0F1A2E]/90 backdrop-blur-sm border border-[#D4AF37]/20 text-[#D4AF37] px-3.5 py-1.5 rounded-full shadow-lg shadow-[#D4AF37]/5 whitespace-nowrap ml-2 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
              Premium Service
            </span>
          </div>

          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            {/* Main Title */}
            <p className="text-[11px] font-light text-[#D4AF37]/50 tracking-[0.25em] uppercase mb-1">
              Hello, I&apos;m a
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              <span className="text-white">{cleanTitle}</span>
            </h2>

            {/* Decorative gold line */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mt-2.5" />

            {/* Availability Badge - Enhanced */}
            <div className="flex items-center gap-3 mt-3 bg-[#0F1A2E]/60 backdrop-blur-sm px-5 py-1.5 rounded-full border border-[#D4AF37]/15 shadow-lg shadow-black/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2563EB]"></span>
              </span>
              <span className="text-[9px] font-light text-[#D4AF37]/70 tracking-wide">
                AVAILABLE WORLDWIDE
              </span>
              <span className="w-px h-3 bg-[#D4AF37]/15" />
              <span className="text-[8px] font-light text-[#2563EB]/60 tracking-wide">
                REMOTE &amp; ON-SITE
              </span>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-[#0F1A2E]/40 backdrop-blur-xl border border-[#D4AF37]/10 rounded-2xl p-3.5 shadow-2xl shadow-black/40 z-10 shrink-0 hover:border-[#2563EB]/20 transition-all duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#D4AF37]/20 bg-gradient-to-br from-[#0F1A2E] to-[#0A0A0A] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#D4AF37]">
                      {cleanProviderName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white tracking-wide">
                      {cleanProviderName}
                    </p>
                    <p className="text-[7px] text-[#D4AF37]/50 font-light tracking-wider">
                      {cleanTitle}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#2563EB] bg-clip-text text-transparent">
                  {mainContact}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[8px] text-[#D4AF37]/35">
                  <span className="font-light flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5 text-[#D4AF37]/40" />
                    <span>{cleanProviderName.toLowerCase()}@gmail.com</span>
                  </span>
                  <span className="w-px h-3 bg-[#D4AF37]/8" />
                  <span className="font-light flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5 text-[#D4AF37]/40" />
                    <span>gullygig.in</span>
                  </span>
                  <span className="w-px h-3 bg-[#D4AF37]/8" />
                  <span className="text-[#2563EB]/40 font-light flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-[#2563EB]/40" />
                    <span>{location}</span>
                  </span>
                </div>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-[#0A0A0A] border border-[#D4AF37]/12 rounded-xl p-1.5 shadow-2xl shadow-black/30 hover:border-[#2563EB]/30 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-14 h-14 bg-white rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-1.5 bg-[#0F1A2E]/30 backdrop-blur-sm border border-[#D4AF37]/6 rounded-xl p-2.5 text-center z-10 shrink-0 hover:border-[#2563EB]/15 transition-all duration-300">
            <p className="text-[9px] font-medium text-[#D4AF37]/70 mb-0.5 tracking-wide">
              Let&apos;s Build Something Extraordinary Together
            </p>
            <p className="text-[7px] text-[#D4AF37]/30 font-light mb-1.5 tracking-wider">
              I transform ideas into powerful, user-friendly digital experiences
              that drive results and grow brands.
            </p>
            <div className="w-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#D4AF37] hover:from-[#1D4ED8] hover:via-[#2563EB] hover:to-[#C8A23B] text-white text-[11px] font-bold uppercase tracking-[0.15em] py-2 rounded-lg shadow-2xl shadow-[#2563EB]/20 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[#2563EB]/40 hover:scale-[1.02] group">
              <Phone className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-300" />
              {ctaText}
              <span className="text-[8px] font-light opacity-50 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 border-t border-[#D4AF37]/6 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[7px] font-light text-[#D4AF37]/25 z-10 shrink-0">
            <span className="font-medium text-[#D4AF37]/40 hover:text-[#D4AF37]/70 transition-colors">
              www.gullygig.in
            </span>
            <span className="text-[#D4AF37]/8">•</span>
            <span className="font-medium text-[#D4AF37]/40 hover:text-[#D4AF37]/70 transition-colors">
              support@gullygig.in
            </span>
            <span className="text-[#D4AF37]/8">•</span>
            <span className="font-medium text-[#2563EB]/40 hover:text-[#2563EB] transition-colors">
              Insta :@gully.gig
            </span>
            <span className="text-[#D4AF37]/8">•</span>
            <span className="font-medium text-[#D4AF37]/40 hover:text-[#D4AF37]/70 transition-colors">
              in
            </span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 6: WhatsApp Status
    // -------------------------------------------------------------
    case "whatsapp":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#0A0A0A] via-[#0F1A0F] to-[#142814] p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Subtle green glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl" />

            {/* Minimal geometric accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-400/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#D4AF37]/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-emerald-300/15 rounded-full" />

            {/* Light green and gold particles */}
            <div className="absolute top-8 right-16 w-1 h-1 bg-emerald-300/40 rounded-full shadow-lg shadow-emerald-300/20" />
            <div className="absolute top-20 right-32 w-0.5 h-0.5 bg-[#D4AF37]/30 rounded-full" />
            <div className="absolute bottom-8 left-16 w-1 h-1 bg-emerald-300/40 rounded-full shadow-lg shadow-emerald-300/20" />
            <div className="absolute bottom-20 left-32 w-0.5 h-0.5 bg-[#D4AF37]/30 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-emerald-300/25 rounded-full" />
            <div className="absolute bottom-1/2 left-1/4 w-0.5 h-0.5 bg-[#D4AF37]/25 rounded-full" />
          </div>

          {/* Header - Logo at Top Left, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0">
              <div className="relative w-25 h-20">
                <Image
                  src="/logo_light.png"
                  alt="GullyGig Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="text-[6px] font-medium uppercase tracking-[0.2em] bg-[#0F1A0F]/90 backdrop-blur-sm border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full shadow-lg shadow-emerald-400/10 whitespace-nowrap ml-2">
              PREMIUM SERVICE
            </span>
          </div>

          {/* Category Badge */}
          <div className="relative z-10 text-center mt-1">
            <span className="inline-block px-3 py-1 bg-emerald-400/10 text-emerald-300 text-[8px] font-bold uppercase tracking-[0.2em] rounded-full border border-emerald-400/20">
              {category || "PREMIUM SERVICE"}
            </span>
          </div>

          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            {/* Main Title - Large Bold */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {cleanTitle}
            </h2>

            {/* Subtitle with gold accent */}
            <p className="text-[11px] font-light text-emerald-300/80 tracking-[0.15em] uppercase mt-1">
              Concepts • Clarity • Confidence
            </p>

            {/* Decorative line */}
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent mt-2" />

            {/* Tagline */}
            <p className="text-[9px] font-light text-[#D4AF37]/50 tracking-[0.1em] uppercase mt-1.5">
              Learn Better • Score Higher
            </p>

            {/* Features Grid - 2x2 - Light Green & Gold */}
            <div className="grid grid-cols-2 gap-1.5 mt-3 w-full max-w-[200px]">
              <div className="bg-[#0F1A0F]/60 backdrop-blur-sm border border-emerald-400/20 rounded-lg p-1.5 text-center">
                <span className="text-[6px] font-bold text-emerald-300/80 block tracking-wider">
                  EXPERT
                </span>
                <span className="text-[4px] text-emerald-300/40 block font-light">
                  TUTORS
                </span>
              </div>
              <div className="bg-[#0F1A0F]/60 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-1.5 text-center">
                <span className="text-[6px] font-bold text-[#D4AF37]/80 block tracking-wider">
                  BETTER
                </span>
                <span className="text-[4px] text-[#D4AF37]/40 block font-light">
                  UNDERSTANDING
                </span>
              </div>
              <div className="bg-[#0F1A0F]/60 backdrop-blur-sm border border-emerald-400/20 rounded-lg p-1.5 text-center">
                <span className="text-[6px] font-bold text-emerald-300/80 block tracking-wider">
                  CONCEPT
                </span>
                <span className="text-[4px] text-emerald-300/40 block font-light">
                  CLARITY
                </span>
              </div>
              <div className="bg-[#0F1A0F]/60 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-1.5 text-center">
                <span className="text-[6px] font-bold text-[#D4AF37]/80 block tracking-wider">
                  HIGHER
                </span>
                <span className="text-[4px] text-[#D4AF37]/40 block font-light">
                  SCORES
                </span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-[#0F1A0F]/60 backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-3.5 shadow-2xl shadow-black/30 z-10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-emerald-300" />
                  <span className="text-[6px] font-bold text-emerald-300/70 uppercase tracking-widest">
                    CALL OR MESSAGE
                  </span>
                </div>
                <p className="text-sm font-bold text-[#D4AF37]">
                  {mainContact}
                </p>
                <p className="text-[9px] font-medium text-white/70">
                  {cleanProviderName}
                </p>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-[#0A0A0A] border border-emerald-400/20 rounded-xl p-1 shadow-2xl shadow-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-12 h-12 bg-white rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA - Light Green to Gold Gradient */}
          <div className="mt-1.5 bg-gradient-to-r from-emerald-400 via-emerald-300 to-[#D4AF37] rounded-xl p-2 text-center z-10 shrink-0 shadow-lg shadow-emerald-400/20">
            <div className="text-[#0A0A0A] text-[9px] font-black uppercase tracking-[0.15em]">
              {ctaText} NOW
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[5.5px] font-light text-emerald-400/30 z-10 shrink-0">
            <span className="font-medium text-emerald-300/50">GullyGig</span>
            <span className="text-emerald-400/20">•</span>
            <span className="font-medium text-emerald-300/50 hover:text-emerald-300/80 transition-colors">
              www.gullygig.in
            </span>
            <span className="text-emerald-400/20">•</span>
            <span className="font-medium text-emerald-300/50 hover:text-emerald-300/80 transition-colors">
              support@gullygig.in
            </span>
            <span className="text-emerald-400/20">•</span>
            <span className="font-medium text-[#D4AF37]/50 hover:text-[#D4AF37]/80 transition-colors">
              Insta: @gully.gig
            </span>
          </div>

          {/* Bottom Tagline */}
          <div className="mt-0.5 text-center z-10 shrink-0">
            <p className="text-[6px] font-light text-emerald-300/40 tracking-[0.15em] uppercase">
              Your Success, Our Mission.
            </p>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 7: Instagram Story
    // -------------------------------------------------------------
    case "instaStory":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#FCFAFF] via-[#F7F3FF] to-[#EDE2FF] p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements - Lilac & Lavender */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Blurred lilac blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#DCCBFF]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#C8B6FF]/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#EDE2FF]/20 rounded-full blur-3xl" />

            {/* Glass circles */}
            <div className="absolute top-12 right-12 w-24 h-24 border border-white/20 rounded-full" />
            <div className="absolute bottom-12 left-12 w-32 h-32 border border-white/15 rounded-full" />
            <div className="absolute top-1/2 right-8 w-16 h-16 border border-white/10 rounded-full" />

            {/* Abstract waves */}
            <svg
              className="absolute bottom-0 left-0 w-full h-1/3 opacity-[0.04]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,50 Q 25,30 50,50 T 100,50 L 100,100 L 0,100 Z"
                fill="#7C3AED"
              />
            </svg>

            {/* Soft glowing particles */}
            <div className="absolute top-8 right-20 w-1.5 h-1.5 bg-[#7C3AED]/20 rounded-full shadow-lg shadow-[#7C3AED]/10" />
            <div className="absolute top-16 right-36 w-1 h-1 bg-[#A855F7]/20 rounded-full" />
            <div className="absolute bottom-8 left-20 w-1.5 h-1.5 bg-[#7C3AED]/20 rounded-full shadow-lg shadow-[#7C3AED]/10" />
            <div className="absolute bottom-16 left-36 w-1 h-1 bg-[#A855F7]/20 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#8B5CF6]/15 rounded-full" />
            <div className="absolute bottom-1/2 left-1/4 w-1 h-1 bg-[#8B5CF6]/15 rounded-full" />

            {/* Tiny sparkles */}
            <span className="absolute top-20 right-1/3 text-[4px] text-[#7C3AED]/10">
              ✦
            </span>
            <span className="absolute bottom-20 left-1/3 text-[4px] text-[#7C3AED]/10">
              ✦
            </span>
            <span className="absolute top-1/3 right-1/4 text-[3px] text-[#A855F7]/10">
              ✦
            </span>

            {/* Faint geometric rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#7C3AED]/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#A855F7]/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#8B5CF6]/6 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[#7C3AED]/8 rounded-full" />

            {/* Dotted grid */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                radial-gradient(circle at 2px 2px, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
              `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Thin curved lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,40 Q 25,20 50,40 T 100,40"
                stroke="#7C3AED"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M 0,60 Q 25,40 50,60 T 100,60"
                stroke="#A855F7"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>
          </div>

          {/* Header - Logo at Top Center, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0 text-center flex-1">
              <div className="relative w-25 h-20 mx-auto">
                <Image
                  src="/logo_dark.png"
                  alt="GullyGig Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[6px] font-light text-[#7C3AED]/40 tracking-[0.3em] uppercase mt-0.5">
                Work. Connect. Grow.
              </p>
            </div>
            <span className="text-[6px] font-medium uppercase tracking-[0.2em] bg-white/40 backdrop-blur-xl border border-white/30 text-[#7C3AED] px-3 py-1 rounded-full shadow-lg shadow-[#7C3AED]/10 whitespace-nowrap ml-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#7C3AED] rounded-full" />
                Premium Service
              </span>
            </span>
          </div>

          {/* Category Badge */}
          <div className="relative z-10 text-center mt-1">
            <span className="inline-block px-3 py-1 bg-white/40 backdrop-blur-sm text-[#7C3AED] text-[7px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/30 shadow-sm">
              {category || "PROFESSIONAL LISTING"}
            </span>
          </div>

          {/* Service Icon Container - Glassmorphism */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            <div className="relative mb-3">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#7C3AED]/20 via-[#A855F7]/20 to-[#7C3AED]/20 blur-xl" />
              <div className="relative w-16 h-16 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#7C3AED]/10 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-[#7C3AED]" />
              </div>
            </div>

            {/* Service Name */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
              {cleanTitle}
            </h2>

            {/* Headline with Gradient */}
            <p className="text-[10px] font-bold bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent tracking-[0.15em] uppercase mt-0.5">
              EXPERT IN {category?.toUpperCase() || "SERVICE"}
            </p>

            {/* Availability Badge */}
            <div className="flex items-center gap-1.5 mt-2.5 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[7px] font-medium text-[#7C3AED]">
                Available on Demand
              </span>
            </div>
          </div>

          {/* Contact Card - Glassmorphism */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 shadow-xl shadow-[#7C3AED]/5 z-10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
                    <span className="text-[8px] font-bold text-white">
                      {cleanProviderName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-800">
                      {cleanProviderName}
                    </p>
                    <p className="text-[6px] text-[#7C3AED]/60 font-medium tracking-wider">
                      {cleanTitle}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#7C3AED]">
                  {mainContact}
                </p>
                <div className="flex items-center gap-1 text-[6px] text-[#7C3AED]/50 font-medium">
                  <Phone className="h-2.5 w-2.5 text-[#7C3AED]" />
                  <span>Call or Message</span>
                </div>
              </div>

              <div className="text-center shrink-0">
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-1 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-12 h-12 bg-white rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA - Gradient Button */}
          <div className="mt-1.5 w-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] rounded-xl p-2.5 text-center z-10 shrink-0 shadow-lg shadow-[#7C3AED]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-white" />
              <span className="text-[8px] font-bold text-white uppercase tracking-wider">
                Book a Session Now
              </span>
            </div>
            <span className="text-white text-xs">→</span>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[5.5px] font-light text-[#7C3AED]/30 z-10 shrink-0">
            <span className="font-medium text-[#7C3AED]/40">GullyGig:</span>
            <span className="text-[#7C3AED]/30">www.gullygig.in</span>
            <span className="text-[#7C3AED]/20">•</span>
            <span className="text-[#7C3AED]/30">support@gullygig.in</span>
            <span className="text-[#7C3AED]/20">•</span>
            <span className="font-medium text-[#7C3AED]/40">
              Insta :@gully.gig
            </span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 8: Instagram Post
    // -------------------------------------------------------------
    case "instaPost":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#FFF8F6] via-[#FDEDEB] to-[#FBE3DF] p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Large blurred organic gradient shapes */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FCB5AC]/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#E8684A]/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#FCB5AC]/10 to-[#E8684A]/10 rounded-full blur-3xl" />

            {/* Additional gradient blobs for depth */}
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#F98F84]/15 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#F7AFA4]/15 rounded-full blur-3xl" />

            {/* Abstract flowing curves */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.06]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,35 Q 25,15 50,35 T 100,35"
                stroke="#f26545"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M 0,50 Q 25,30 50,50 T 100,50"
                stroke="#d2938b"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M 0,65 Q 25,45 50,65 T 100,65"
                stroke="#E8684A"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M 0,80 Q 25,60 50,80 T 100,80"
                stroke="#FCB5AC"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>

            {/* Thin outline circles */}
            <div className="absolute top-12 right-12 w-32 h-32 border-2 border-[#E8684A]/15 rounded-full" />
            <div className="absolute bottom-12 left-12 w-40 h-40 border-2 border-[#FCB5AC]/15 rounded-full" />
            <div className="absolute top-1/2 right-8 w-20 h-20 border-2 border-[#E8684A]/12 rounded-full" />
            <div className="absolute top-1/3 left-8 w-16 h-16 border-2 border-[#FCB5AC]/12 rounded-full" />
            <div className="absolute top-2/3 right-1/3 w-12 h-12 border-2 border-[#E8684A]/10 rounded-full" />
            <div className="absolute bottom-2/3 left-1/3 w-12 h-12 border-2 border-[#FCB5AC]/10 rounded-full" />

            {/* Dotted grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                radial-gradient(circle at 2px 2px, rgba(232, 104, 74, 0.4) 1px, transparent 1px)
              `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Tiny sparkles */}
            <span className="absolute top-20 right-1/3 text-[5px] text-[#E8684A]/25">
              ✦
            </span>
            <span className="absolute bottom-20 left-1/3 text-[5px] text-[#FCB5AC]/25">
              ✦
            </span>
            <span className="absolute top-1/3 right-1/4 text-[4px] text-[#E8684A]/20">
              ✦
            </span>
            <span className="absolute bottom-1/3 left-1/4 text-[4px] text-[#FCB5AC]/20">
              ✦
            </span>
            <span className="absolute top-2/3 right-1/4 text-[3px] text-[#E8684A]/15">
              ✦
            </span>
            <span className="absolute bottom-2/3 left-1/4 text-[3px] text-[#FCB5AC]/15">
              ✦
            </span>

            {/* Translucent glass blobs */}
            <div className="absolute top-1/4 right-0 w-48 h-48 bg-white/8 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-white/8 rounded-full blur-2xl" />

            {/* Minimal geometric patterns */}
            <div className="absolute top-2/3 right-1/4 w-6 h-6 border-2 border-[#E8684A]/12 rounded-lg rotate-12" />
            <div className="absolute bottom-2/3 left-1/4 w-6 h-6 border-2 border-[#FCB5AC]/12 rounded-lg rotate-45" />
            <div className="absolute top-1/3 right-1/3 w-4 h-4 border-2 border-[#E8684A]/10 rounded-full" />
            <div className="absolute bottom-1/3 left-1/3 w-4 h-4 border-2 border-[#FCB5AC]/10 rounded-full" />

            {/* Soft radial lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-white/25 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-[#FCB5AC]/10 to-transparent rounded-full blur-3xl" />

            {/* Floating diamonds */}
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#E8684A]/8 rotate-45" />
            <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-[#FCB5AC]/8 rotate-45" />
          </div>

          {/* Header - Logo at Top Center, Badge at Top Right */}
          <div className="relative z-10 shrink-0 flex items-start justify-between mb-1">
            <div className="flex-shrink-0 text-center flex-1">
              <div className="relative w-25 h-20 mx-auto">
                <Image
                  src="/logo_dark.png"
                  alt="GullyGig Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[5px] font-light text-[#E8684A]/50 tracking-[0.3em] uppercase mt-0.5">
                Work. Connect. Grow.
              </p>
            </div>
            <span className="text-[5px] font-medium uppercase tracking-[0.2em] bg-white/70 backdrop-blur-xl border-2 border-[#FCB5AC]/40 text-[#E8684A] px-2.5 py-1 rounded-full shadow-lg shadow-[#FCB5AC]/20 whitespace-nowrap ml-2 flex items-center gap-1">
              <Sparkles className="h-2 w-2 text-[#E8684A]" />
              Premium Service
            </span>
          </div>

          {/* Main Content - Full Width Service Info */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-1">
            <p className="text-[7px] font-medium text-[#E8684A]/60 tracking-[0.2em] uppercase">
              Expert Service
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#E8684A]">
              {cleanTitle}
            </h2>

            {/* Decorative line */}
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#FCB5AC]/50 to-transparent mt-1.5" />

            {/* Availability Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-[#FCB5AC]/30 shadow-sm mt-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[6px] font-medium text-[#E8684A]">
                Available on Demand
              </span>
              <span className="w-px h-2.5 bg-[#E8684A]/15" />
              <span className="text-[5px] font-light text-[#E8684A]/50 flex items-center gap-0.5">
                <MapPin className="h-2 w-2" />
                Online &amp; Offline
              </span>
            </div>
          </div>

          {/* Contact Card - Premium Glassmorphism */}
          <div className="bg-white/70 backdrop-blur-xl border-2 border-[#FCB5AC]/20 rounded-2xl p-3.5 shadow-xl shadow-[#FCB5AC]/15 z-10 shrink-0 hover:shadow-2xl hover:shadow-[#FCB5AC]/25 transition-all duration-300">
            <div className="flex items-center gap-3">
              {/* Left Side - Profile Info */}
              <div className="flex-1 flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8684A] to-[#FCB5AC] flex items-center justify-center shadow-lg shadow-[#E8684A]/30">
                    <span className="text-[11px] font-bold text-white">
                      {cleanProviderName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -inset-0.5 rounded-full border-2 border-[#FCB5AC]/40 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-[#E8684A]">
                    {cleanProviderName}
                  </p>
                  <p className="text-[6px] text-[#E8684A]/60 font-medium">
                    {cleanTitle}
                  </p>
                  <div className="flex items-center gap-1 text-[6px] text-[#E8684A]/60">
                    <Phone className="h-2.5 w-2.5 text-[#E8684A]" />
                    <span>{mainContact}</span>
                    <span className="w-px h-2.5 bg-[#E8684A]/15" />
                    <span>Call or Message</span>
                  </div>
                </div>
              </div>

              {/* Right Side - QR Code */}
              <div className="text-center shrink-0">
                <div className="bg-white/60 backdrop-blur-sm border-2 border-[#E8684A]/30 rounded-xl p-1 shadow-sm hover:border-[#E8684A]/50 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    crossOrigin="anonymous"
                    className="w-14 h-14 bg-white rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA - Premium Gradient */}
          <div className="mt-1.5 w-full bg-gradient-to-r from-[#E8684A] via-[#F98F84] to-[#FCB5AC] rounded-full p-2.5 text-center z-10 shrink-0 shadow-lg shadow-[#E8684A]/30 flex items-center justify-between group hover:shadow-xl hover:shadow-[#E8684A]/40 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              <span className="text-[8px] font-bold text-white uppercase tracking-wider">
                Book a Session Now
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-px h-4 bg-white/20" />
              <span className="text-white text-xs group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-1 pt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[5.5px] font-light text-[#E8684A]/40 z-10 shrink-0">
            <span className="font-medium text-[#E8684A]/50">GullyGig:</span>
            <span className="text-[#E8684A]/40 hover:text-[#E8684A]/70 transition-colors">
              www.gullygig.in
            </span>
            <span className="text-[#E8684A]/25">•</span>
            <span className="text-[#E8684A]/40 hover:text-[#E8684A]/70 transition-colors">
              support@gullygig.in
            </span>
            <span className="text-[#E8684A]/25">•</span>
            <span className="font-medium text-[#E8684A]/50 hover:text-[#E8684A]/80 transition-colors">
              @gullygig
            </span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 9: Flyer
    // -------------------------------------------------------------
    case "flyer":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#F0FCFA] via-[#F5FFFE] to-[#E8F8F5] p-8 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Dark border frame */}
            <div className="absolute inset-3 border-2 border-[#1A4A47]/20 rounded-3xl" />
            <div className="absolute inset-4 border border-[#C8A55A]/10 rounded-3xl" />

            {/* Soft flowing abstract waves */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.08]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,15 Q 30,-5 60,15 T 100,15 L 100,0 L 0,0 Z"
                fill="#28cbb6"
              />
              <path
                d="M 0,35 Q 30,15 60,35 T 100,35 L 100,0 L 0,0 Z"
                fill="#baf7eb"
              />
              <path
                d="M 0,55 Q 30,35 60,55 T 100,55 L 100,0 L 0,0 Z"
                fill="#6cffeb"
              />
              <path
                d="M 0,75 Q 30,55 60,75 T 100,75 L 100,0 L 0,0 Z"
                fill="#f8d152"
              />
            </svg>

            {/* Larger gradient blobs */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#99F6E4]/30 to-[#2DD4BF]/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tl from-[#FCD34D]/25 to-[#2DD4BF]/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-l from-[#FCD34D]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-gradient-to-r from-[#99F6E4]/20 to-transparent rounded-full blur-3xl" />

            {/* Transparent glass circles */}
            <div className="absolute top-16 right-16 w-32 h-32 border-2 border-[#2DD4BF]/15 rounded-full backdrop-blur-sm" />
            <div className="absolute bottom-16 left-16 w-40 h-40 border-2 border-[#99F6E4]/20 rounded-full backdrop-blur-sm" />
            <div className="absolute top-1/3 right-12 w-20 h-20 border-2 border-[#FCD34D]/15 rounded-full backdrop-blur-sm" />
            <div className="absolute bottom-1/3 left-12 w-20 h-20 border-2 border-[#2DD4BF]/12 rounded-full backdrop-blur-sm" />

            {/* Dotted grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                radial-gradient(circle at 2px 2px, rgba(45, 212, 191, 0.4) 1px, transparent 1px)
              `,
                backgroundSize: "35px 35px",
              }}
            />

            {/* Tiny sparkles */}
            <span className="absolute top-24 right-1/3 text-[5px] text-[#FCD34D]/30">
              ✦
            </span>
            <span className="absolute bottom-24 left-1/3 text-[5px] text-[#2DD4BF]/25">
              ✦
            </span>
            <span className="absolute top-1/3 right-1/4 text-[4px] text-[#99F6E4]/30">
              ✦
            </span>
            <span className="absolute bottom-1/3 left-1/4 text-[4px] text-[#FCD34D]/25">
              ✦
            </span>

            {/* Soft floating particles */}
            <div className="absolute top-12 right-28 w-1.5 h-1.5 bg-[#FCD34D]/30 rounded-full shadow-lg shadow-[#FCD34D]/15" />
            <div className="absolute top-20 right-44 w-1 h-1 bg-[#2DD4BF]/25 rounded-full shadow-lg shadow-[#2DD4BF]/15" />
            <div className="absolute bottom-12 left-28 w-1.5 h-1.5 bg-[#99F6E4]/30 rounded-full shadow-lg shadow-[#99F6E4]/15" />
            <div className="absolute bottom-20 left-44 w-1 h-1 bg-[#FCD34D]/25 rounded-full shadow-lg shadow-[#FCD34D]/15" />

            {/* Soft radial gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[#F0FCFA]/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-[#E8F8F5]/40 to-transparent" />

            {/* Decorative corner accents - Darker */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#1A4A47]/25 rounded-tl-lg" />
            <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[#1A4A47]/25 rounded-tr-lg" />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[#1A4A47]/25 rounded-bl-lg" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#1A4A47]/25 rounded-br-lg" />
          </div>

          {/* Header - Logo at Top Center */}
          <div className="relative z-10 shrink-0 text-center">
            <div className="relative w-25 h-20 mx-auto">
              <Image
                src="/logo_dark.png"
                alt="GullyGig Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-[6px] font-bold text-[#1A4A47] tracking-[0.3em] uppercase mt-0.5">
              WORK. CONNECT. GROW.
            </p>
          </div>

          {/* Section Label */}
          <div className="relative z-10 text-center mt-2">
            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-px bg-gradient-to-r from-transparent to-[#1A4A47]/40" />
              <span className="text-[8px] font-bold text-[#1A4A47] tracking-[0.25em] uppercase">
                PUBLIC ANNOUNCEMENT
              </span>
              <span className="w-10 h-px bg-gradient-to-l from-transparent to-[#1A4A47]/40" />
            </div>
          </div>

          {/* Secondary Heading - Dynamic Category */}
          <div className="relative z-10 text-center mt-1">
            <h3 className="text-[9px] font-bold text-[#1A4A47] tracking-[0.12em] uppercase">
              {category?.toUpperCase() || "PROFESSIONAL"} SERVICES
            </h3>
          </div>

          {/* Main Title - Dynamic Service Name */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              <span className="text-[#1A4A47]">
                {cleanTitle.split(" ")[0] || cleanTitle}
              </span>
              {cleanTitle.includes(" ") && (
                <span className="text-[#C8A55A]">
                  {" "}
                  {cleanTitle.split(" ").slice(1).join(" ")}
                </span>
              )}
            </h2>

            {/* Decorative Divider with Diamond */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#C8A55A]/50" />
              <div className="relative">
                <span className="w-2 h-2 bg-[#C8A55A] rotate-45 shadow-md shadow-[#C8A55A]/30" />
              </div>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#C8A55A]/50" />
            </div>

            {/* Description - Dynamic */}
            <p className="text-[10px] text-[#374151] leading-relaxed max-w-sm mx-auto mt-2 line-clamp-2">
              {cleanDescription}
            </p>
          </div>

          {/* Service Details Card - 3 Columns - Dynamic */}
          <div className="bg-white/85 backdrop-blur-xl border-2 border-[#1A4A47]/15 rounded-2xl p-3 shadow-xl shadow-[#1A4A47]/5 z-10 shrink-0">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center space-y-0.5 border-r-2 border-[#1A4A47]/10 pr-2">
                <span className="text-[7px] font-bold text-[#1A4A47]/70 uppercase tracking-wider flex items-center justify-center gap-1">
                  <MapPin className="h-2.5 w-2.5" /> Location
                </span>
                <p className="text-[9px] font-bold text-[#1A4A47] truncate">
                  {location || "Your City"}
                </p>
              </div>
              <div className="text-center space-y-0.5 border-r-2 border-[#1A4A47]/10 pr-2">
                <span className="text-[7px] font-bold text-[#1A4A47]/70 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Star className="h-2.5 w-2.5 text-[#C8A55A]" /> Rating
                </span>
                <p className="text-[9px] font-bold text-[#C8A55A]">
                  {ratingAverage?.toFixed(1) || "4.8"} / 5.0
                </p>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[7px] font-bold text-[#1A4A47]/70 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Tag className="h-2.5 w-2.5" /> Pricing
                </span>
                <p className="text-[9px] font-bold text-[#1A4A47]">
                  {startingPrice
                    ? `₹${startingPrice}/${priceUnit || "hr"}`
                    : "On Enquiry"}
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Divider */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C8A55A]/40 to-transparent" />
            <div className="relative">
              <span className="w-2 h-2 bg-[#C8A55A] rotate-45 shadow-md shadow-[#C8A55A]/30" />
            </div>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C8A55A]/40 to-transparent" />
          </div>

          {/* Contact Provider Section - Dynamic */}
          <div className="flex items-center justify-between gap-4 mt-1.5 z-10 shrink-0">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1A4A47] flex items-center justify-center shadow-md shadow-[#1A4A47]/20">
                  <Phone className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-[7px] font-bold text-[#1A4A47] uppercase tracking-wider">
                  Contact Provider
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#1A4A47] truncate">
                {cleanProviderName || "Service Provider"}
              </p>
              <p className="text-base font-bold text-[#1A4A47]">
                {mainContact || "9876543210"}
              </p>
              {secondaryContact && (
                <p className="text-[8px] font-medium text-[#6B7280]">
                  {secondaryContact}
                </p>
              )}
            </div>

            <div className="text-center shrink-0">
              <div className="bg-white border-2 border-[#C8A55A]/40 rounded-xl p-1.5 shadow-lg shadow-[#C8A55A]/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  className="w-16 h-16 bg-white rounded"
                />
              </div>
            </div>
          </div>

          {/* Bottom CTA - Dynamic */}
          <div className="mt-1.5 bg-[#1A4A47] text-white text-center py-1.5 rounded-lg text-[8px] font-bold tracking-widest uppercase z-10 shrink-0 shadow-lg shadow-[#1A4A47]/30">
            {ctaText || "CALL NOW"} • BOOKING OPEN NOW
          </div>

          {/* Footer */}
          <div className="mt-0.5 pt-0.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[5.5px] font-bold text-[#1A4A47]/40 z-10 shrink-0">
            <span className="font-bold text-[#1A4A47]/50">GullyGig:</span>
            <span className="text-[#1A4A47]/40 hover:text-[#1A4A47]/80 transition-colors">
              www.gullygig.in
            </span>
            <span className="text-[#1A4A47]/20">•</span>
            <span className="text-[#1A4A47]/40 hover:text-[#1A4A47]/80 transition-colors">
              support@gullygig.in
            </span>
            <span className="text-[#1A4A47]/20">•</span>
            <span className="font-bold text-[#C8A55A]/60 hover:text-[#C8A55A]/90 transition-colors">
              Insta :@gully.gig
            </span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 10: Minimal Professional
    // -------------------------------------------------------------
    case "minimal":
    default:
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-[#FBF7F2] via-[#FFFDFC] to-[#FDFBF8] p-6 flex flex-col relative overflow-hidden ${getFontClass()}`}
        >
          {/* Premium Background Elements - Ultra Minimal */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Very subtle paper texture */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(75, 54, 42, 0.02) 2px, rgba(75, 54, 42, 0.02) 4px)
              `,
              }}
            />

            {/* Soft cream gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[#FBF7F2]/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-[#FDFBF8]/40 to-transparent" />

            {/* Thin decorative corner lines */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-[#D8C3A5]/40" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-[#D8C3A5]/40" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-[#D8C3A5]/40" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-[#D8C3A5]/40" />

            {/* Minimal geometric frame */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#D8C3A5]/20 rounded-2xl" />

            {/* Thin outline curves */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,30 Q 25,15 50,30 T 100,30"
                stroke="#4B362A"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M 0,70 Q 25,55 50,70 T 100,70"
                stroke="#4B362A"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>

            {/* Tiny diamond ornaments */}
            <span className="absolute top-1/2 left-6 w-1 h-1 bg-[#B08D57]/20 rotate-45" />
            <span className="absolute top-1/2 right-6 w-1 h-1 bg-[#B08D57]/20 rotate-45" />

            {/* Very light radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D8C3A5]/5 rounded-full blur-3xl" />
          </div>

          {/* Header - Logo at Top Center */}
          <div className="relative z-10 shrink-0 text-center">
            <div className="relative w-25 h-20 mx-auto">
              <Image
                src="/logo_dark.png"
                alt="GullyGig Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-[6px] font-medium text-[#6D625A] tracking-[0.25em] uppercase mt-0.5">
              WORK. CONNECT. GROW.
            </p>
          </div>

          {/* Editorial Label */}
          <div className="relative z-10 flex items-center justify-center gap-3 mt-2">
            <span className="w-8 h-px bg-[#B08D57]/40" />
            <span className="text-[7px] font-semibold text-[#6D625A] tracking-[0.22em] uppercase">
              PUBLIC ANNOUNCEMENT
            </span>
            <span className="w-8 h-px bg-[#B08D57]/40" />
          </div>

          {/* Service Category */}
          <div className="relative z-10 text-center mt-0.5">
            <p className="text-[8px] font-semibold text-[#6D625A] tracking-[0.18em] uppercase">
              {category?.toUpperCase() || "PROFESSIONAL"} SERVICES
            </p>
          </div>

          {/* Main Content - Service on Right */}
          <div className="flex-1 flex items-center gap-6 z-10 py-1">
            {/* Left Side - Experience & Details */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Main Headline - Editorial Serif */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight">
                <span className="text-[#4B362A]">
                  {cleanTitle.split(" ")[0] || cleanTitle}
                </span>
                {cleanTitle.includes(" ") && (
                  <span className="text-[#B08D57]">
                    {" "}
                    {cleanTitle.split(" ").slice(1).join(" ")}
                  </span>
                )}
              </h1>

              {/* Editorial Divider */}
              <div className="flex items-center gap-3 mt-2 mb-2">
                <span className="w-10 h-px bg-[#4B362A]/30" />
                <span className="w-1 h-1 bg-[#B08D57] rotate-45" />
                <span className="w-10 h-px bg-[#4B362A]/30" />
              </div>

              {/* Description */}
              <p className="text-[9px] text-[#6D625A] leading-relaxed max-w-sm">
                {cleanDescription}
              </p>

              {/* Experience Badge - Minimal */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full border border-[#4B362A]/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#4B362A]">8</span>
                </div>
                <div>
                  <p className="text-[6px] font-semibold text-[#4B362A] uppercase tracking-widest">
                    Year
                  </p>
                  <p className="text-[6px] font-medium text-[#6D625A] uppercase tracking-widest">
                    Experience
                  </p>
                </div>
              </div>

              {/* Service Details - Minimal Card */}
              <div className="mt-2 bg-white/70 backdrop-blur-sm border border-[#E7DED4] rounded-2xl p-2.5">
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="text-center space-y-0.5 border-r border-[#E7DED4] pr-1.5">
                    <span className="text-[5px] font-medium text-[#6D625A] uppercase tracking-wider flex items-center justify-center gap-0.5">
                      <MapPin className="h-2 w-2" /> Location
                    </span>
                    <p className="text-[7px] font-semibold text-[#4B362A]">
                      {location || "Your City"}
                    </p>
                  </div>
                  <div className="text-center space-y-0.5 border-r border-[#E7DED4] pr-1.5">
                    <span className="text-[5px] font-medium text-[#6D625A] uppercase tracking-wider flex items-center justify-center gap-0.5">
                      <Star className="h-2 w-2 text-[#B08D57]" /> Rating
                    </span>
                    <p className="text-[7px] font-semibold text-[#B08D57]">
                      {ratingAverage?.toFixed(1) || "4.8"} / 5.0
                    </p>
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="text-[5px] font-medium text-[#6D625A] uppercase tracking-wider flex items-center justify-center gap-0.5">
                      <Tag className="h-2 w-2" /> Pricing
                    </span>
                    <p className="text-[7px] font-semibold text-[#4B362A]">
                      {startingPrice
                        ? `₹${startingPrice}/${priceUnit || "hr"}`
                        : "On Enquiry"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Service Icon */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-.1 h-.1 rounded-full border-2 border-[#E7DED4] flex items-center justify-center shadow-lg shadow-[#4B362A]/5">
                {/* Decorative floating elements */}
              </div>
            </div>
          </div>

          {/* Contact Section - Minimal */}
          <div className="flex items-center justify-between gap-3 mt-1 z-10 shrink-0 border-t border-[#E7DED4] pt-2">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border border-[#4B362A]/20 flex items-center justify-center">
                  <Phone className="h-2 w-2 text-[#4B362A]" />
                </div>
                <span className="text-[5px] font-semibold text-[#6D625A] uppercase tracking-wider">
                  Contact Provider
                </span>
              </div>
              <p className="text-[9px] font-semibold text-[#4B362A]">
                {cleanProviderName || "Service Provider"}
              </p>
              <p className="text-sm font-semibold text-[#4B362A]">
                {mainContact || "9876543210"}
              </p>
              {secondaryContact && (
                <p className="text-[6px] font-medium text-[#9C9188]">
                  {secondaryContact}
                </p>
              )}
            </div>

            <div className="text-center shrink-0">
              <div className="bg-white border border-[#E7DED4] rounded-xl p-1 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  className="w-12 h-12 bg-white rounded"
                />
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-1 bg-[#4B362A] text-white text-center py-1 rounded-lg text-[6px] font-bold tracking-widest uppercase z-10 shrink-0 shadow-md shadow-[#4B362A]/20">
            {ctaText || "CALL NOW"} • BOOKING OPEN NOW
          </div>

          {/* Footer */}
          <div className="mt-0.5 pt-0.5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[4.5px] font-medium text-[#9C9188] z-10 shrink-0">
            <span className="font-semibold text-[#6D625A]">GullyGig:</span>
            <span className="text-[#9C9188]">www.gullygig.in</span>
            <span className="text-[#D8C3A5]">•</span>
            <span className="text-[#9C9188]">support@gullygig.in</span>
            <span className="text-[#D8C3A5]">•</span>
            <span className="font-semibold text-[#B08D57]">
              Insta :@gully.gig
            </span>
          </div>
        </div>
      );
  }
}
