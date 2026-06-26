"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2 } from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Import X icon from FA6

interface FooterProps {
  onShowToast: (msg: string) => void;
}

// Social links - All links updated
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/gully.gig/",
  twitter: "https://twitter.com/gullygig", // Replace with your actual X/Twitter URL
  linkedin: "https://linkedin.com/company/gullygig", // Replace with your actual LinkedIn URL
  facebook: "https://www.facebook.com/profile.php?id=61591601632400",
  youtube: "https://youtube.com/@gullygig", // Replace with your actual YouTube URL
  whatsapp: "https://chat.whatsapp.com/HG3U2hP7IEu0EHAiftscCq",
};

export default function Footer({ onShowToast }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleShare = async () => {
    const shareData = {
      title: "GullyGig - Find Trusted Local Service Providers",
      text: "Discover verified tutors, cooks, babysitters, and skilled professionals near you on GullyGig!",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://gullygig.in",
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

  // Social icons configuration for easy mapping
  const socialIcons = [
    {
      key: "instagram",
      icon: FaInstagram,
      label: "Instagram",
      color: "hover:bg-pink-600 hover:text-white",
    },
    {
      key: "twitter",
      icon: FaXTwitter, // Using X icon from FA6
      label: "X (Twitter)",
      color:
        "hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black",
    },
    {
      key: "linkedin",
      icon: FaLinkedinIn,
      label: "LinkedIn",
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      key: "facebook",
      icon: FaFacebookF,
      label: "Facebook",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      key: "youtube",
      icon: FaYoutube,
      label: "YouTube",
      color: "hover:bg-red-600 hover:text-white",
    },
    {
      key: "whatsapp",
      icon: FaWhatsapp,
      label: "WhatsApp",
      color: "hover:bg-green-600 hover:text-white",
    },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Brand */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start mb-4"
            >
              <div className="relative h-32 w-34 sm:h-28 sm:w-28 overflow-hidden flex-shrink-0">
                {/* Light theme logo */}
                <Image
                  src="/logo_dark.png"
                  alt="Logo"
                  fill
                  className="object-contain object-center md:object-left dark:hidden"
                />
                {/* Dark theme logo */}
                <Image
                  src="/logo_light.png"
                  alt="Logo"
                  fill
                  className="object-contain object-center md:object-left hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w mx-auto md:mx-0">
              Discover trusted local professionals and skilled workers near you.
            </p>
            <div className="mt-3.5 space-y-1 text-xs text-slate-450 dark:text-slate-400 flex flex-col items-center md:items-start font-semibold">
              <span className="flex items-center gap-1">
                <span>Support:</span>
                <a
                  href="mailto:support@gullygig.in"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@gullygig.in
                </a>
              </span>
              <span className="flex items-center gap-1">
                <span>Phone:</span>
                <a
                  href="tel:7559302315"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  7559302315
                </a>
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4 flex-wrap">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer flex-shrink-0"
                aria-label="Share GullyGig"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Social Media Icons */}
              {socialIcons.map((social) => {
                const Icon = social.icon;
                const href =
                  SOCIAL_LINKS[social.key as keyof typeof SOCIAL_LINKS];
                // Skip rendering if href is empty or '#'
                if (!href || href === "#") return null;

                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right - Quick Links */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-center md:text-right">
              <li>
                <Link
                  href="/legal?tab=privacy"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal?tab=terms"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
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
            &copy; {currentYear} GullyGig • Mumbai, India
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <Link
              href="/legal?tab=privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/legal?tab=terms"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
