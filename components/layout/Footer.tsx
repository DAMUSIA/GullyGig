"use client";

import React from "react";
import Link from "next/link";
import { Share2 } from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import Icon from "../Icon";

interface FooterProps {
  onShowToast: (msg: string) => void;
}

// Social links - easily updateable
const SOCIAL_LINKS = {
  instagram: "#",
  twitter: "#",
  youtube: "#",
  linkedin: "#",
};

export default function Footer({ onShowToast }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleShare = async () => {
    const shareData = {
      title: "Kaamao - Find Trusted Local Service Providers",
      text: "Discover verified tutors, cooks, babysitters, and skilled professionals near you on Kaamao!",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://kaamao.com",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        onShowToast("Link copied to clipboard! Share it with your friends.");
      } catch (err) {
        console.error("Failed to copy link:", err);
        onShowToast("Share failed. Please try again.");
      }
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Brand */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start gap-2 mb-4"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 flex-shrink-0">
                <Icon name="check" fill className="text-xs text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-white">
                Kaamao
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w mx-auto md:mx-0">
              Discover trusted local professionals and skilled workers near you.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2.5 mt-4 flex-wrap">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer flex-shrink-0"
                aria-label="Share Kaamao"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                aria-label="Twitter"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                aria-label="YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right - Quick Links */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-center md:text-right">
              <li className="text-sm text-slate-600 dark:text-slate-400">
                Privacy Policy
              </li>
              <li className="text-sm text-slate-600 dark:text-slate-400">
                Terms of Service
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
            &copy; {currentYear} Kaamao • Mumbai, India
          </p>
        </div>
      </div>
    </footer>
  );
}
