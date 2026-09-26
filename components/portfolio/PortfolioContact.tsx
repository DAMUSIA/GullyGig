"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Copy, Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

interface PortfolioContactProps {
  contactNumbers: string[];
  serviceTitle: string;
  darkMode?: boolean;
}

export default function PortfolioContact({
  contactNumbers,
  serviceTitle,
  darkMode = true,
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

  return (
    <div
      className={`rounded-[26px] p-8 transition-all duration-300 space-y-6 ${
        darkMode
          ? "bg-[#0F2344] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "bg-white border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-2xl border ${
            darkMode
              ? "bg-[#D6B36A]/10 text-[#D6B36A] border-[#D6B36A]/20"
              : "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20"
          }`}
        >
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <h3
            className={`text-xl font-['Poppins'] font-semibold ${
              darkMode ? "text-white" : "text-[#111827]"
            }`}
          >
            Direct Contact Information
          </h3>
          <p
            className={`text-sm font-['Inter'] ${
              darkMode ? "text-white/50" : "text-[#6B7280]"
            }`}
          >
            Connect directly via Phone Call or WhatsApp
          </p>
        </div>
      </div>

      {contactNumbers.length === 0 ? (
        <p
          className={`text-sm font-['Inter'] italic ${
            darkMode ? "text-white/40" : "text-[#6B7280]"
          }`}
        >
          No direct phone numbers published. Please use website booking.
        </p>
      ) : (
        <div className="space-y-4">
          {contactNumbers.map((number, idx) => {
            const cleaned = cleanNumber(number);
            return (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-200 ${
                  darkMode
                    ? "bg-white/5 border-white/10 hover:border-white/20"
                    : "bg-[#F8FAFC] border-[#E5E7EB] hover:border-[#2563EB]/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                      darkMode
                        ? "bg-[#D6B36A]/15 text-[#D6B36A] border-[#D6B36A]/25"
                        : "bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/20"
                    }`}
                  >
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-['Inter'] font-semibold uppercase tracking-[1.5px] block ${
                        darkMode ? "text-white/40" : "text-[#6B7280]"
                      }`}
                    >
                      Phone{" "}
                      {contactNumbers.length > 1 ? `#${idx + 1}` : "Number"}
                    </span>
                    <span
                      className={`text-lg font-['Space_Grotesk'] font-bold ${
                        darkMode ? "text-white" : "text-[#111827]"
                      }`}
                    >
                      +91 {number}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => copyPhoneToClipboard(number, idx)}
                    className={`p-3 rounded-xl transition-all duration-200 border cursor-pointer ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 text-white/70 border-white/10"
                        : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                    title="Copy phone number"
                  >
                    {copiedPhoneIdx === idx ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  <a
                    href={`tel:${cleaned}`}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-['Inter'] font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-md cursor-pointer ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/15"
                    }`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Now
                  </a>

                  <a
                    href={`https://wa.me/91${cleaned}?text=${encodeURIComponent(
                      `Hello! I found your service "${serviceTitle}" on GullyGig and would like to enquire.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-['Inter'] font-bold rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <FaWhatsapp className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
