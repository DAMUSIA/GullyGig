"use client";

import React from "react";
import Link from "next/link";
import Icon from "../Icon";

interface FooterProps {
  onShowToast: (msg: string) => void;
}

export default function Footer({ onShowToast }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-8 transition-colors duration-300">
      <div className="mx-auto max-w-[1140px] px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="text-center md:text-left">
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-primary">
              <Icon name="check" fill className="text-xs text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              Kaamao
            </span>
          </Link>
          <p className="text-[12px] text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Kaamao. Transforming skills into opportunities.
          </p>
        </div>

        {/* Center links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            "Privacy Policy",
            "Terms of Service",
            "Help Center",
            "Community Guidelines",
          ].map((l) => (
            <button
              key={l}
              onClick={() => onShowToast("Coming soon...")}
              className="text-[12px] text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors cursor-pointer"
            >
              {l}
            </button>
          ))}
          <Link
            href="/team"
            className="text-[12px] text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-semibold"
          >
            Our Team
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onShowToast("Share coming soon...")}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-brand-primary hover:border-brand-primary-light transition-all cursor-pointer"
            aria-label="Share"
          >
            <Icon
              name="share"
              className="text-base text-slate-500 dark:text-slate-400"
            />
          </button>
          <button
            onClick={() => onShowToast("Language settings coming soon...")}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-brand-primary hover:border-brand-primary-light transition-all cursor-pointer"
            aria-label="Select Language"
          >
            <Icon
              name="language"
              className="text-base text-slate-500 dark:text-slate-400"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
