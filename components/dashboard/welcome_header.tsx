"use client";

import React from "react";
import { Plus, CheckCircle2, Lock } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  onAddService: () => void;
  isPaid?: boolean;
  hasService?: boolean;
}

export function WelcomeHeader({
  userName,
  onAddService,
  isPaid = false,
  hasService = false,
}: WelcomeHeaderProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-500/20 text-white">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
              Dashboard
            </span>
            {isPaid ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                Paid &amp; Verified Partner
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                <Lock className="w-3 h-3 text-amber-300" />
                Activation Pending
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Welcome back, <span className="text-blue-200">{userName}</span>!
          </h1>
          <p className="text-blue-100/80 mt-1 text-xs sm:text-sm">
            {isPaid
              ? hasService
                ? "Your service listing is active. Manage your listing or review performance below."
                : "Your provider account is active. Create your service listing below."
              : "Complete your activation to unlock listing creation on GullyGig."}
          </p>
        </div>

        <button
          onClick={onAddService}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-700 text-xs sm:text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isPaid ? "Create Service" : "Activate Listing"}</span>
        </button>
      </div>
    </div>
  );
}
