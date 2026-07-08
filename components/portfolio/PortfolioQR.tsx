"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Copy, Check, Download, Share2 } from "lucide-react";

interface PortfolioQRProps {
  portfolioUrl: string;
  serviceTitle?: string;
}

export default function PortfolioQR({ portfolioUrl, serviceTitle = "Portfolio" }: PortfolioQRProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(portfolioUrl)}`
    );
  }, [portfolioUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const downloadQrCode = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(portfolioUrl)}`;

    img.onload = () => {
      canvas.width = 340;
      canvas.height = 400;
      if (!ctx) return;

      // Premium dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 340, 400);
      gradient.addColorStop(0, "#0A1F3D");
      gradient.addColorStop(0.5, "#102B54");
      gradient.addColorStop(1, "#061528");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 340, 400);

      // Gold border
      ctx.strokeStyle = "rgba(214,179,106,0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, 310, 370);

      // QR Code
      ctx.drawImage(img, 20, 30, 300, 300);

      // Text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to View Portfolio", 170, 370);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillText("GullyGig Premium Service", 170, 392);

      const link = document.createElement("a");
      link.download = `${serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1F3D] via-[#102B54] to-[#061528] rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[#D6B36A]/20 hover:border-[#D6B36A]/40 transition-all duration-250 group">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#5BE7FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#D6B36A]/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Thin glowing lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D6B36A]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5BE7FF]/10 to-transparent" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#D6B36A]">
            <QrCode className="h-5 w-5" />
            <span className="text-xs font-['Inter'] font-semibold uppercase tracking-[1.5px]">
              Premium Digital Presence
            </span>
          </div>
          
          <h4 className="text-2xl font-['Poppins'] font-semibold text-white">
            Share Your Portfolio
          </h4>
          
          <p className="text-sm font-['Inter'] text-white/60 leading-relaxed max-w-md">
            Scan the QR code to instantly view this professional portfolio on any device. 
            Perfect for sharing with clients and colleagues.
          </p>

          {/* Clickable URL */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-full hover:border-[#D6B36A]/30 transition-all duration-200">
            <span className="text-xs font-['Inter'] font-medium text-white/70 truncate max-w-[200px]">
              {portfolioUrl}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all duration-200 active:scale-90 flex-shrink-0"
              title="Copy Portfolio URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[#27C7C5]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={downloadQrCode}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-sm font-['Inter'] font-medium rounded-2xl border border-white/10 transition-all duration-200 hover:shadow-[0_0_20px_rgba(214,179,106,0.15)]"
            >
              <Download className="h-4 w-4" />
              Download QR
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: serviceTitle,
                    url: portfolioUrl,
                  });
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D6B36A]/20 to-[#C89A3D]/20 hover:from-[#D6B36A]/30 hover:to-[#C89A3D]/30 text-[#D6B36A] text-sm font-['Inter'] font-medium rounded-2xl border border-[#D6B36A]/20 transition-all duration-200"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex-shrink-0 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#D6B36A]/20 via-[#5BE7FF]/10 to-[#D6B36A]/20 blur-sm" />
          <div className="relative bg-white p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#D6B36A]/10">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="GullyGig Service Portfolio QR Code"
                width={150}
                height={150}
                className="rounded-xl"
                loading="lazy"
              />
            ) : (
              <div className="w-[150px] h-[150px] bg-gray-200 rounded-xl animate-pulse" />
            )}
          </div>
          {/* Gold corner accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D6B36A]/30 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D6B36A]/30 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D6B36A]/30 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D6B36A]/30 rounded-br-lg" />
        </div>
      </div>
    </div>
  );
}