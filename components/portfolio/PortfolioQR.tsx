"use client";

import React, { useState } from "react";
import { QrCode, Copy, Check } from "lucide-react";

interface PortfolioQRProps {
  portfolioUrl: string;
}

export default function PortfolioQR({ portfolioUrl }: PortfolioQRProps) {
  const [copied, setCopied] = useState(false);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    portfolioUrl,
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-3 max-w text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400">
          <QrCode className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Shareable Portfolio
          </span>
        </div>
        <h4 className="text-lg font-extrabold">Scan QR Code to Share</h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          Students, parents, or friends can scan this QR code to view your
          portfolio, verify details, and call you directly from their phones.
        </p>

        {/* Clickable URL */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 max-w-full">
          <span className="text-[11px] font-bold text-slate-300 truncate max-w-[200px] sm:max-w-[280px]">
            {portfolioUrl}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer active:scale-90 flex-shrink-0"
            title="Copy Portfolio URL"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="relative z-10 flex-shrink-0 bg-white p-3.5 rounded-2xl shadow-xl shadow-black/40 border border-white/15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrCodeUrl}
          alt="Kaamao Service Portfolio QR Code"
          width={120}
          height={120}
          className="rounded-lg bg-white block"
          loading="lazy"
        />
      </div>
    </div>
  );
}
