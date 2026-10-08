"use client";

import React, { useState, useMemo } from "react";
import { QrCode, Copy, Check, Download } from "lucide-react";

interface PortfolioQRProps {
  portfolioUrl: string;
  serviceTitle?: string;
  darkMode?: boolean;
}

export default function PortfolioQR({
  portfolioUrl,
  serviceTitle = "Portfolio",
  darkMode = true,
}: PortfolioQRProps) {
  const [copied, setCopied] = useState(false);

  const qrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      portfolioUrl,
    )}`;
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
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      portfolioUrl,
    )}`;

    img.onload = () => {
      canvas.width = 340;
      canvas.height = 400;
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 340, 400);
      if (darkMode) {
        gradient.addColorStop(0, "#0f172a");
        gradient.addColorStop(1, "#1e293b");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      } else {
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#f8fafc");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(203, 213, 225, 0.8)";
      }

      ctx.fillRect(0, 0, 340, 400);
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, 310, 370);

      ctx.drawImage(img, 20, 30, 300, 300);

      ctx.fillStyle = darkMode ? "#FFFFFF" : "#0f172a";
      ctx.font = "bold 16px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to View Portfolio", 170, 365);

      ctx.fillStyle = darkMode
        ? "rgba(255,255,255,0.5)"
        : "rgba(100,116,139,0.8)";
      ctx.font = "12px Manrope, sans-serif";
      ctx.fillText("GullyGig Service Hub", 170, 388);

      const link = document.createElement("a");
      link.download = `${serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 space-y-5 ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-white shadow-xl"
          : "bg-white border-slate-200/90 text-slate-900 shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <QrCode className="w-5 h-5 text-blue-500" />
        <h4 className="text-base font-bold tracking-tight">
          Portfolio QR & Share
        </h4>
      </div>

      {/* Center QR Code Container */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={`p-3 rounded-2xl border shadow-md relative ${
            darkMode ? "bg-white border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          {qrCodeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCodeUrl}
              alt="GullyGig Service Portfolio QR Code"
              width={150}
              height={150}
              className="rounded-lg"
              loading="lazy"
            />
          ) : (
            <div className="w-[150px] h-[150px] bg-slate-200 rounded-lg animate-pulse" />
          )}
        </div>

        <p
          className={`text-xs max-w-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          Scan QR code with any mobile camera to view this live profile
          instantly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-1">
          <button
            onClick={downloadQrCode}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              darkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
