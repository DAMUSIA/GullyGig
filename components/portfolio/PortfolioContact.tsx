"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Share2, Check } from "lucide-react";

interface PortfolioContactProps {
  contactNumbers: string[];
  fallbackPhone: string | null;
  serviceTitle: string;
  startingPrice: number | null;
  location: string;
  portfolioUrl: string;
}

export default function PortfolioContact({
  contactNumbers,
  fallbackPhone,
  serviceTitle,
  startingPrice,
  location,
  portfolioUrl,
}: PortfolioContactProps) {
  const [copied, setCopied] = useState(false);

  // Determine active contact list
  const activeNumbers =
    contactNumbers && contactNumbers.length > 0
      ? contactNumbers
      : fallbackPhone
        ? [fallbackPhone]
        : [];

  const cleanNumber = (num: string) => num.replace(/\D/g, "");

  const handleShare = async () => {
    const textMessage = `Check out my service on Kaamao\n\nService: ${serviceTitle}\nLocation: ${location}${
      startingPrice ? `\nStarting at: ₹${startingPrice}` : ""
    }\n\nLink: ${portfolioUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kaamao - ${serviceTitle}`,
          text: textMessage,
          url: portfolioUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy link
      try {
        await navigator.clipboard.writeText(textMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-extrabold text-slate-800">
          Contact Details
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Get in touch directly with the provider
        </p>
      </div>

      {activeNumbers.length === 0 ? (
        <p className="text-xs text-slate-400 italic">
          No contact numbers listed.
        </p>
      ) : (
        <div className="space-y-4">
          {activeNumbers.map((number, idx) => {
            const cleaned = cleanNumber(number);
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Number {activeNumbers.length > 1 ? `#${idx + 1}` : ""}
                    </span>
                    <span className="text-sm font-extrabold text-slate-850">
                      {number}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Call Button */}
                  <a
                    href={`tel:${cleaned}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 shadow-sm shadow-blue-500/10"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Now</span>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${cleaned}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 shadow-sm shadow-emerald-500/10"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Section */}
      <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-700 block">
            Share Listing
          </span>
          <span className="text-[10px] text-slate-400">
            Share this portfolio with friends or family
          </span>
        </div>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Listing</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
