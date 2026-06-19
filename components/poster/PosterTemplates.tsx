"use client";

import React from "react";
import { Sparkles, MapPin, IndianRupee, Award } from "lucide-react";

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
  portfolioUrl,
  providerName,
  ratingAverage,
  templateId,
  typography,
  ctaText,
}: PosterTemplateProps) {
  // Setup QR Code Url
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    portfolioUrl,
  )}`;

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
          className={`w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 flex flex-col justify-between relative overflow-hidden ${getFontClass()}`}
        >
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold text-xs uppercase tracking-wider">
                Kaamao Connect
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">
              {category}
            </span>
          </div>

          {/* Body */}
          <div className="my-auto py-2 space-y-4 text-center z-10">
            <span className="text-[10px] font-extrabold uppercase text-blue-400 tracking-widest">
              Premium Service
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight line-clamp-2">
              {title}
            </h2>
            <p className="text-[11px] text-slate-300 line-clamp-3 font-medium max-w-xs mx-auto leading-relaxed">
              {description}
            </p>

            {/* Price Badge */}
            {startingPrice && (
              <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-3.5 py-1 rounded-xl mx-auto shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Starts at
                </span>
                <span className="text-sm font-black flex items-center text-blue-400">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {startingPrice}
                  {priceUnit && (
                    <span className="text-[10px] font-normal text-slate-400">
                      {" "}
                      / {priceUnit.toLowerCase()}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Footer Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 z-10 shrink-0">
            <div className="text-left space-y-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                Contact Partner
              </span>
              <span className="block text-xs font-black">{mainContact}</span>
              {secondaryContact && (
                <span className="block text-[10px] text-slate-350 font-bold">
                  {secondaryContact}
                </span>
              )}
              <div className="flex items-center gap-1 text-[9px] text-slate-400 pt-0.5">
                <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                <span className="truncate max-w-[120px]">{location}</span>
              </div>
            </div>
            <div className="bg-white p-1 rounded-lg shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                crossOrigin="anonymous"
                className="w-14 h-14 bg-white"
              />
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-500 font-bold border-t border-white/5 pt-2 z-10 flex justify-between shrink-0">
            <span>Scan to view verified details</span>
            <span className="text-blue-400 uppercase tracking-widest">
              {ctaText}
            </span>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 2: Local Service
    // -------------------------------------------------------------
    case "local":
      return (
        <div
          className={`w-full h-full bg-slate-50 text-slate-800 p-6 flex flex-col justify-between border border-slate-200 ${getFontClass()}`}
        >
          <div className="bg-blue-600 text-white -mx-6 -mt-6 p-4 text-center shrink-0 shadow-sm">
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-blue-750 px-2 py-0.5 rounded">
              {category}
            </span>
            <h3 className="font-extrabold text-sm mt-1">{providerName}</h3>
          </div>

          <div className="my-auto py-2 space-y-3.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {title}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-550 font-bold">
              <MapPin className="h-4 w-4 text-red-500 shrink-0" />
              <span>{location}</span>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed font-medium">
              {description}
            </p>

            {startingPrice && (
              <div className="flex items-baseline gap-1 text-slate-900">
                <span className="text-xs font-bold text-slate-500">
                  Starting Price:
                </span>
                <span className="text-lg font-black text-blue-650 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {startingPrice}
                  {priceUnit && (
                    <span className="text-xs font-normal text-slate-550">
                      {" "}
                      / {priceUnit.toLowerCase()}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-between gap-4 shrink-0">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450">
                Contact Us Now
              </span>
              <span className="block text-sm font-black text-slate-900">
                {mainContact}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-500 font-extrabold">
                ★ {ratingAverage.toFixed(1)} Rating
              </span>
            </div>

            <div className="text-center">
              <div className="bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  className="w-14 h-14 bg-white"
                />
              </div>
              <span className="text-[7px] font-bold text-slate-400 block mt-1">
                Scan to Call
              </span>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 3: Tutor
    // -------------------------------------------------------------
    case "tutor":
      return (
        <div
          className={`w-full h-full bg-amber-50 text-slate-800 p-6 flex flex-col justify-between border-2 border-amber-200 relative overflow-hidden ${getFontClass()}`}
        >
          {/* Top category ribbon */}
          <div className="absolute top-0 right-0 bg-amber-500 text-white font-black text-[9px] uppercase px-4 py-1.5 rounded-bl-xl shadow-sm tracking-widest shrink-0">
            {category}
          </div>

          <div className="space-y-1 text-left shrink-0">
            <span className="text-[9px] font-extrabold text-amber-600 tracking-wider block">
              LEARN WITH THE BEST
            </span>
            <h4 className="text-base font-extrabold text-slate-900 leading-snug">
              {providerName}
            </h4>
          </div>

          <div className="my-auto py-2 space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed font-medium bg-amber-100/50 border border-amber-200/40 p-2.5 rounded-xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
              <span className="px-2 py-0.5 bg-amber-100 rounded">
                📍 {location}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 rounded">
                ⭐ {ratingAverage.toFixed(1)} score
              </span>
            </div>
          </div>

          <div className="bg-amber-100 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-4 shrink-0">
            <div className="text-left space-y-1">
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">
                Pricing & Contact
              </span>
              {startingPrice ? (
                <div className="flex items-center text-sm font-black text-slate-850">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {startingPrice}
                  {priceUnit && (
                    <span className="text-[9px] font-normal text-slate-500">
                      /{priceUnit.toLowerCase()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="block text-xs font-bold text-slate-600">
                  On Enquiry
                </span>
              )}
              <span className="block text-xs font-extrabold text-slate-900">
                {mainContact}
              </span>
            </div>

            <div className="bg-white p-1 rounded-lg shrink-0 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                crossOrigin="anonymous"
                className="w-14 h-14 bg-white"
              />
            </div>
          </div>

          <div className="text-center text-[9px] text-amber-600 font-extrabold tracking-widest uppercase shrink-0 pt-1">
            {ctaText} • BOOK A DEMO CLASS
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 4: Freelancer
    // -------------------------------------------------------------
    case "freelancer":
      return (
        <div
          className={`w-full h-full bg-slate-950 text-white p-6 flex flex-col justify-between relative border border-slate-800 ${getFontClass()}`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-600/10 rounded-full blur-2xl" />

          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              Freelance Professional
            </span>
            <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
              {category}
            </span>
          </div>

          <div className="my-auto py-2 space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed font-medium">
              {description}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-cyan-400 font-extrabold">
                By {providerName}
              </span>
              <span className="text-slate-600">•</span>
              <span>📍 {location}</span>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 flex items-center justify-between gap-4 shrink-0">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Starting at
              </span>
              <div className="text-base font-black text-cyan-400 flex items-center">
                <IndianRupee className="h-4 w-4" />
                {startingPrice ?? "Quote"}
                {startingPrice && priceUnit && (
                  <span className="text-[10px] font-normal text-slate-500">
                    {" "}
                    / {priceUnit.toLowerCase()}
                  </span>
                )}
              </div>
              <span className="block text-xs font-bold text-slate-100">
                {mainContact}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                crossOrigin="anonymous"
                className="w-12 h-12 bg-white"
              />
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 5: Premium Dark
    // -------------------------------------------------------------
    case "dark":
      return (
        <div
          className={`w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-6 flex flex-col justify-between border border-amber-500/20 relative overflow-hidden ${getFontClass()}`}
        >
          {/* Glowing borders */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 shrink-0">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500">
              Luxe Service
            </span>
            <span className="text-[9px] font-bold text-slate-400 border border-slate-800 px-2 py-0.5 rounded bg-slate-900/40">
              {category}
            </span>
          </div>

          <div className="my-auto py-2 space-y-4 text-center">
            <h2 className="text-xl font-bold tracking-tight leading-snug">
              {title}
            </h2>

            {startingPrice && (
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl">
                <span className="text-[9px] font-bold text-amber-550 uppercase">
                  Investment starts at
                </span>
                <span className="text-sm font-extrabold text-amber-500 flex items-center">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {startingPrice}
                  {priceUnit && (
                    <span className="text-[10px] font-normal text-slate-400">
                      /{priceUnit.toLowerCase()}
                    </span>
                  )}
                </span>
              </div>
            )}

            <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed font-medium max-w-xs mx-auto">
              {description}
            </p>
          </div>

          {/* Contact and QR */}
          <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-4 shrink-0">
            <div className="text-left space-y-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-450">
                Verified Instructor
              </span>
              <span className="block text-xs font-black text-white">
                {providerName}
              </span>
              <span className="block text-xs text-amber-500 font-extrabold">
                {mainContact}
              </span>
              <span className="block text-[10px] text-slate-400">
                📍 {location}
              </span>
            </div>

            <div className="bg-white p-1 rounded-lg shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                crossOrigin="anonymous"
                className="w-14 h-14 bg-white"
              />
            </div>
          </div>

          <div className="text-center text-[9px] text-amber-500/80 font-bold tracking-wider uppercase shrink-0 pt-1">
            {ctaText} • PREMIUM EXPERIENCE
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 6: WhatsApp Status (Vertical 9:16)
    // -------------------------------------------------------------
    case "whatsapp":
      return (
        <div
          className={`w-full h-full bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-8 flex flex-col justify-between text-center relative overflow-hidden ${getFontClass()}`}
        >
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="space-y-2 shrink-0">
            <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-teal-500/30">
              {category}
            </span>
            <h4 className="text-xs font-bold text-slate-450 tracking-wider block mt-1">
              AVAILABLE ON DEMAND
            </h4>
          </div>

          <div className="my-auto py-4 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto line-clamp-4">
              {description}
            </p>

            {startingPrice && (
              <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Starts from
                </span>
                <span className="text-base font-black text-teal-400 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {startingPrice}
                  {priceUnit && (
                    <span className="text-xs font-normal text-slate-400">
                      /{priceUnit.toLowerCase()}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4 shrink-0">
            <div className="bg-white p-2 rounded-2xl inline-block shadow-xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                crossOrigin="anonymous"
                className="w-18 h-18 bg-white"
              />
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CALL OR MESSAGE
              </span>
              <span className="block text-base font-black text-teal-400">
                {mainContact}
              </span>
              <span className="block text-[10px] text-slate-500 font-medium">
                📍 {location} • {providerName}
              </span>
            </div>

            <div className="py-2 bg-teal-500/10 border border-teal-500/20 text-[11px] font-black uppercase text-teal-300 rounded-xl tracking-widest">
              {ctaText} NOW
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 7: Instagram Story (Vertical 9:16)
    // -------------------------------------------------------------
    case "instaStory":
      return (
        <div
          className={`w-full h-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 text-white p-8 flex flex-col justify-between text-center relative overflow-hidden ${getFontClass()}`}
        >
          <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="space-y-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block mt-2">
              Professional Listing
            </span>
            <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full border border-white/5 inline-block">
              {category}
            </span>
          </div>

          <div className="my-auto py-4 space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
              {title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-4 max-w-xs mx-auto">
              {description}
            </p>

            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>By {providerName}</span>
              <span>•</span>
              <span>📍 {location}</span>
            </div>
          </div>

          <div className="space-y-4 shrink-0">
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-2xl shadow-xl shadow-black/30 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  className="w-16 h-16 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Connect details
              </span>
              <span className="block text-base font-black text-white">
                {mainContact}
              </span>
              {startingPrice && (
                <span className="block text-xs font-bold text-indigo-400">
                  Starts at ₹{startingPrice}/{priceUnit || "hour"}
                </span>
              )}
            </div>

            <div className="bg-gradient-to-r from-indigo-550 to-purple-600 p-2.5 text-xs font-black uppercase text-white rounded-xl shadow-lg shadow-indigo-500/10">
              {ctaText} TODAY
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 8: Instagram Post (Square 1:1)
    // -------------------------------------------------------------
    case "instaPost":
      return (
        <div
          className={`w-full h-full bg-slate-900 text-white p-6 flex flex-col justify-between border-2 border-blue-500/30 relative overflow-hidden ${getFontClass()}`}
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 text-blue-400 font-extrabold text-xs uppercase tracking-wider">
              <Award className="h-4 w-4" />
              <span>Verified Listing</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded border border-blue-500/30">
              {category}
            </span>
          </div>

          {/* Center Content */}
          <div className="my-auto py-3 space-y-3.5">
            <h2 className="text-lg sm:text-xl font-black leading-tight tracking-tight text-white">
              {title}
            </h2>
            <p className="text-[11px] text-slate-350 line-clamp-3 leading-relaxed font-medium">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">
              <span>Tutor: {providerName}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>📍 {location}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span className="text-amber-400 flex items-center gap-0.5">
                ★ {ratingAverage.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-4 shrink-0">
            <div className="text-left space-y-1">
              {startingPrice ? (
                <div className="space-y-0.5">
                  <span className="text-[8px] font-bold text-slate-450 uppercase block">
                    Starting Price
                  </span>
                  <div className="text-sm font-black text-blue-400 flex items-center">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {startingPrice}
                    {priceUnit && (
                      <span className="text-[9px] font-normal text-slate-500">
                        /{priceUnit.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-xs font-extrabold text-slate-300">
                  Price on Enquiry
                </span>
              )}
              <span className="block text-xs font-black text-white pt-0.5">
                {mainContact}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  className="w-11 h-11 bg-white"
                />
              </div>
              <div className="text-center bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase text-white tracking-widest shrink-0">
                {ctaText}
              </div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // TEMPLATE 9: Flyer (A4 aspect 1:1.4)
    // -------------------------------------------------------------
    case "flyer":
      return (
        <div
          className={`w-full h-full bg-white text-slate-800 p-7 flex flex-col justify-between border-4 border-slate-900 relative ${getFontClass()}`}
        >
          <div className="absolute top-4 left-4 right-4 h-1 bg-slate-950" />

          <div className="text-center space-y-1 pt-2 shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
              PUBLIC ANNOUNCEMENT
            </span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {category.toUpperCase()} SERVICES
            </h3>
          </div>

          <div className="my-auto py-3 space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 tracking-tighter uppercase leading-none text-center">
              {title}
            </h2>
            <div className="w-10 h-0.5 bg-slate-950 mx-auto" />
            <p className="text-[11px] text-slate-650 leading-relaxed font-medium text-center max-w-sm mx-auto">
              {description}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center space-y-1">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                Service Details
              </span>
              <div className="flex justify-around text-xs font-bold text-slate-800">
                <span>📍 {location}</span>
                <span>⭐ {ratingAverage.toFixed(1)} Avg score</span>
                {startingPrice && (
                  <span className="text-blue-750">
                    ₹{startingPrice}/{priceUnit || "hour"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-950 pt-4 flex items-center justify-between gap-5 shrink-0">
            <div className="text-left space-y-1.5">
              <span className="text-[9px] font-extrabold text-slate-550 uppercase tracking-wider block">
                CONTACT PROVIDER
              </span>
              <span className="block text-sm font-extrabold text-slate-950">
                {providerName}
              </span>
              <span className="block text-base font-black text-blue-650">
                {mainContact}
              </span>
              {secondaryContact && (
                <span className="block text-xs font-semibold text-slate-500">
                  {secondaryContact}
                </span>
              )}
            </div>

            <div className="text-center">
              <div className="bg-white border-2 border-slate-950 p-1.5 rounded-xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  className="w-16 h-16 bg-white"
                />
              </div>
              <span className="text-[8px] font-black text-slate-900 block mt-1">
                SCAN FOR DETAILS
              </span>
            </div>
          </div>

          <div className="bg-slate-950 text-white text-center py-2 -mx-7 -mb-7 text-[10px] font-black tracking-widest uppercase shrink-0">
            {ctaText} • BOOKING OPEN NOW
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
          className={`w-full h-full bg-white text-slate-800 p-6 flex flex-col justify-between border border-slate-200 ${getFontClass()}`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
            <span className="text-xs font-black text-slate-900 tracking-wider">
              {providerName}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {category}
            </span>
          </div>

          <div className="my-auto py-2 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {title}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed font-medium">
              {description}
            </p>

            <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
              <span>📍 {location}</span>
              <span>•</span>
              <span>Average score: {ratingAverage.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4 shrink-0">
            <div className="text-left space-y-1">
              {startingPrice && (
                <div className="text-xs font-bold text-slate-650">
                  Starts at{" "}
                  <span className="font-extrabold text-slate-900">
                    ₹{startingPrice}
                  </span>{" "}
                  /{priceUnit || "hour"}
                </div>
              )}
              <span className="block text-xs font-extrabold text-slate-850">
                Contact: {mainContact}
              </span>
            </div>

            <div className="bg-white border border-slate-100 p-1 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                crossOrigin="anonymous"
                className="w-12 h-12 bg-white"
              />
            </div>
          </div>

          <div className="text-center text-[8px] text-slate-400 font-bold uppercase tracking-widest shrink-0 pt-2 border-t border-slate-50">
            {ctaText} • scan qr to view portfolio link online
          </div>
        </div>
      );
  }
}
