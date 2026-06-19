"use client";

import React from "react";
import { Sparkles, Phone, MapPin, IndianRupee } from "lucide-react";

interface PosterTemplateProps {
  title: string;
  category: string;
  description: string;
  startingPrice: number | null;
  priceUnit: string | null;
  location: string;
  contactNumbers: string[];
  portfolioUrl: string;
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
}: PosterTemplateProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    portfolioUrl,
  )}`;

  return (
    <div className="w-full max-w-[420px] aspect-[1/1.4] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden select-none mx-auto">
      {/* Background radial effects */}
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP: Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            Kaamao Connect
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
          {category}
        </span>
      </div>

      {/* CENTER: Service Card */}
      <div className="my-auto py-4 space-y-4 flex-1 flex flex-col justify-center text-center">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white line-clamp-2">
          {title}
        </h2>

        {/* Pricing badge */}
        {startingPrice && (
          <div className="inline-flex items-center gap-1.5 self-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Starting at
            </span>
            <div className="flex items-center text-white font-extrabold text-base">
              <IndianRupee className="h-4 w-4 shrink-0" />
              <span>{startingPrice}</span>
              {priceUnit && (
                <span className="text-xs font-normal text-slate-400">
                  {" "}
                  / {priceUnit.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs mx-auto line-clamp-3">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <span>{location}</span>
        </div>
      </div>

      {/* BOTTOM: Contact & QR Code */}
      <div className="border-t border-white/5 pt-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between gap-4">
          {/* Contacts info */}
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Phone className="h-3 w-3 text-blue-400" />
              Contact Provider
            </span>
            {contactNumbers.length > 0 ? (
              <div className="space-y-0.5">
                {contactNumbers.slice(0, 2).map((num, idx) => (
                  <span
                    key={idx}
                    className="block text-xs font-black text-white"
                  >
                    {num}
                  </span>
                ))}
              </div>
            ) : (
              <span className="block text-xs font-bold text-slate-500 italic">
                Call or scan below
              </span>
            )}
          </div>

          {/* QR code */}
          <div className="bg-white p-2 rounded-xl flex-shrink-0 shadow-lg shadow-black/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code"
              width={72}
              height={72}
              className="rounded-md bg-white block"
              loading="lazy"
            />
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center text-[10px] text-slate-500 font-semibold tracking-wide flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
          <span>Scan to Book Online</span>
          <span className="text-blue-400 font-bold">Book Now</span>
        </div>
      </div>
    </div>
  );
}
