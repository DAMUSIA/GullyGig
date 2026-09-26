"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Copy, Check } from "lucide-react";

interface PortfolioContactProps {
  contactNumbers: string[];
  serviceTitle: string;
}

export default function PortfolioContact({
  contactNumbers,
  serviceTitle,
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
    <div className="bg-[#FFFFFF] rounded-[26px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300 space-y-6 border border-[#E5E7EB] hover:border-[#2563EB]/20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#2563EB]/10 rounded-2xl border border-[#2563EB]/20 shadow-[0_4px_12px_rgba(37,99,235,0.08)]">
          <Phone className="h-6 w-6 text-[#2563EB]" />
        </div>
        <div>
          <h3 className="text-xl font-['Poppins'] font-semibold text-[#111827]">
            Contact Information
          </h3>
          <p className="text-sm font-['Inter'] text-[#6B7280]">
            Connect directly via call or WhatsApp
          </p>
        </div>
      </div>

      {contactNumbers.length === 0 ? (
        <p className="text-sm font-['Inter'] text-[#6B7280] italic">
          No contact numbers available
        </p>
      ) : (
        <div className="space-y-4">
          {contactNumbers.map((number, idx) => {
            const cleaned = cleanNumber(number);
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#F8FAFC]/50 rounded-2xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.08)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 border border-[#2563EB]/10 shadow-[0_2px_8px_rgba(37,99,235,0.06)]">
                    <Phone className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-['Inter'] font-semibold text-[#6B7280] uppercase tracking-[1.5px] block">
                      Phone {contactNumbers.length > 1 ? `#${idx + 1}` : ""}
                    </span>
                    <span className="text-lg font-['Space_Grotesk'] font-semibold text-[#111827]">
                      {number}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => copyPhoneToClipboard(number, idx)}
                    className="p-2.5 bg-[#F1F5F9] hover:bg-[#E5E7EB] rounded-xl transition-all duration-200 border border-[#D4AF37]/20 shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.08)]"
                    title="Copy number"
                  >
                    {copiedPhoneIdx === idx ? (
                      <Check className="h-5 w-5 text-[#14B8A6]" />
                    ) : (
                      <Copy className="h-5 w-5 text-[#6B7280]" />
                    )}
                  </button>

                  <a
                    href={`tel:${cleaned}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-sm font-['Inter'] font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.4)]"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>

                  <a
                    href={`https://wa.me/${cleaned}?text=${encodeURIComponent(
                      `Hello! I saw your service "${serviceTitle}" on GullyGig and want to enquire.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#1B5E20] text-white text-sm font-['Inter'] font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-[0_4px_16px_rgba(27,94,32,0.3)] hover:shadow-[0_8px_32px_rgba(27,94,32,0.4)]"
                  >
                    <MessageCircle className="h-4 w-4" />
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
