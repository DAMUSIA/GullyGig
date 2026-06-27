"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Clock,
  Mail,
  Users,
  Cookie,
  FileText,
  Scale,
  Share2,
  DollarSign,
  AlertCircle,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface LegalClientPageProps {
  privacyContent: string;
  termsContent: string;
}

// Social links configuration taken from Footer.tsx
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/gully.gig/",
  twitter: "https://twitter.com/gullygig",
  linkedin: "https://linkedin.com/company/gullygig",
  facebook: "https://www.facebook.com/profile.php?id=61591601632400",
  youtube: "https://youtube.com/@gullygig",
  whatsapp: "https://chat.whatsapp.com/HG3U2hP7IEu0EHAiftscCq",
};

/**
 * Renders the legal page with Terms of Service or Privacy Policy content.
 *
 * @param privacyContent - Markdown-like privacy policy content to display when the Privacy tab is active.
 * @param termsContent - Markdown-like terms of service content to display when the Terms tab is active.
 * @returns The legal page UI for the active tab.
 */
export default function LegalClientPage({
  privacyContent,
  termsContent,
}: LegalClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get active tab from query parameters, defaulting to "terms"
  const activeTab = searchParams.get("tab") === "privacy" ? "privacy" : "terms";

  const handleTabChange = (tab: "terms" | "privacy") => {
    router.push(`/legal?tab=${tab}`);
  };

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
        alert("Link copied to clipboard! Share it with your friends.");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const socialIcons = [
    {
      key: "instagram",
      icon: FaInstagram,
      label: "Instagram",
      color: "hover:bg-pink-600 hover:text-white",
    },
    {
      key: "twitter",
      icon: FaXTwitter,
      label: "X (Twitter)",
      color: "hover:bg-black hover:text-white",
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

  // Helper to return the correct icon based on the section title
  const getSectionIcon = (title: string, isPrivacy: boolean) => {
    const cleanTitle = title.toLowerCase();

    if (cleanTitle.includes("contact us") || cleanTitle.includes("contact")) {
      return <Mail className="h-5 w-5" />;
    }

    if (isPrivacy) {
      if (cleanTitle.includes("1. who we are"))
        return <Users className="h-5 w-5" />;
      if (cleanTitle.includes("2. information we collect"))
        return <Database className="h-5 w-5" />;
      if (cleanTitle.includes("3. how we use"))
        return <Eye className="h-5 w-5" />;
      if (cleanTitle.includes("4. legal basis"))
        return <Scale className="h-5 w-5" />;
      if (cleanTitle.includes("5. sharing of"))
        return <Users className="h-5 w-5" />;
      if (cleanTitle.includes("6. data storage"))
        return <Lock className="h-5 w-5" />;
      if (cleanTitle.includes("7. data retention"))
        return <Clock className="h-5 w-5" />;
      if (cleanTitle.includes("8. cookies"))
        return <Cookie className="h-5 w-5" />;
      if (cleanTitle.includes("9. your rights"))
        return <Shield className="h-5 w-5" />;
      if (cleanTitle.includes("10. children"))
        return <Users className="h-5 w-5" />;
      if (cleanTitle.includes("11. third-party"))
        return <Scale className="h-5 w-5" />;
      if (cleanTitle.includes("12. changes"))
        return <Clock className="h-5 w-5" />;
    } else {
      if (cleanTitle.includes("1. about gullygig"))
        return <Scale className="h-5 w-5" />;
      if (cleanTitle.includes("2. eligibility"))
        return <Users className="h-5 w-5" />;
      if (cleanTitle.includes("3. user accounts"))
        return <Users className="h-5 w-5" />;
      if (cleanTitle.includes("4. service providers"))
        return <Shield className="h-5 w-5" />;
      if (cleanTitle.includes("5. service seekers"))
        return <Users className="h-5 w-5" />;
      if (cleanTitle.includes("6. platform role"))
        return <Scale className="h-5 w-5" />;
      if (cleanTitle.includes("7. payments"))
        return <DollarSign className="h-5 w-5" />;
      if (cleanTitle.includes("8. prohibited conduct"))
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      if (cleanTitle.includes("9. ratings"))
        return <Star className="h-5 w-5 text-amber-500" />;
      if (cleanTitle.includes("10. intellectual"))
        return <Shield className="h-5 w-5" />;
      if (cleanTitle.includes("11. suspension"))
        return <Clock className="h-5 w-5" />;
      if (cleanTitle.includes("12. limitation of liability"))
        return <AlertCircle className="h-5 w-5" />;
      if (cleanTitle.includes("13. indemnification"))
        return <Shield className="h-5 w-5" />;
      if (cleanTitle.includes("14. governing law"))
        return <Scale className="h-5 w-5" />;
      if (cleanTitle.includes("15. changes to these terms"))
        return <Clock className="h-5 w-5" />;
      if (cleanTitle.includes("16. severability"))
        return <Scale className="h-5 w-5" />;
      if (cleanTitle.includes("17. entire agreement"))
        return <Scale className="h-5 w-5" />;
    }

    if (cleanTitle.includes("user") || cleanTitle.includes("account"))
      return <Users className="h-5 w-5" />;
    if (cleanTitle.includes("privacy") || cleanTitle.includes("security"))
      return <Shield className="h-5 w-5" />;
    if (cleanTitle.includes("law") || cleanTitle.includes("legal"))
      return <Scale className="h-5 w-5" />;
    if (cleanTitle.includes("changes") || cleanTitle.includes("date"))
      return <Clock className="h-5 w-5" />;

    return <FileText className="h-5 w-5" />;
  };

  const parseMarkdownToReact = (text: string, isPrivacy: boolean) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        const listElement = (
          <ul
            key={`ul-${listKey++}`}
            className="space-y-2 text-sm text-slate-600 mt-2 list-none pl-1"
          >
            {currentList}
          </ul>
        );
        if (sectionTitle) {
          sectionContent.push(listElement);
        } else {
          elements.push(listElement);
        }
        currentList = [];
      }
    };

    const renderTextWithBold = (txt: string) => {
      const parts = txt.split("**");
      return parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return (
            <strong key={idx} className="font-semibold text-slate-800">
              {part}
            </strong>
          );
        }
        return part;
      });
    };

    let sectionContent: React.ReactNode[] = [];
    let sectionTitle = "";
    let sectionKey = 0;

    const flushSection = () => {
      if (sectionTitle) {
        flushList();
        const IconComponent = getSectionIcon(sectionTitle, isPrivacy);
        const isProhibited = sectionTitle.toLowerCase().includes("prohibited");

        elements.push(
          <section
            key={`section-${sectionKey++}`}
            className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-sm transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2.5 rounded-xl border ${
                  isProhibited
                    ? "bg-red-50 text-red-600 border-red-100/50"
                    : isPrivacy
                      ? "bg-blue-50 text-blue-600 border-blue-100/50"
                      : "bg-indigo-50 text-indigo-600 border-indigo-100/50"
                }`}
              >
                {IconComponent}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {sectionTitle}
              </h2>
            </div>
            <div className="space-y-3.5">{[...sectionContent]}</div>
          </section>,
        );
        sectionContent = [];
        sectionTitle = "";
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }

      if (line.startsWith("# ")) {
        flushSection();
        flushList();
        const titleText = line.substring(2);
        elements.push(
          <div key={`title-${i}`} className="flex items-center gap-4 mb-4 mt-2">
            <div
              className={`p-3.5 rounded-2xl ${isPrivacy ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"}`}
            >
              {isPrivacy ? (
                <Shield className="h-8 w-8" />
              ) : (
                <FileText className="h-8 w-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {titleText}
              </h1>
            </div>
          </div>,
        );
      } else if (line.startsWith("## ")) {
        flushSection();
        flushList();
        sectionTitle = line.substring(3);
      } else if (line.startsWith("### ")) {
        flushList();
        const subTitleText = line.substring(4);
        const content = (
          <h3
            key={`h3-${i}`}
            className="font-bold text-slate-800 text-sm sm:text-base mt-4 mb-1.5"
          >
            {renderTextWithBold(subTitleText)}
          </h3>
        );
        if (sectionTitle) {
          sectionContent.push(content);
        } else {
          elements.push(content);
        }
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const bulletText = line.substring(2);
        const isCheck = bulletText.startsWith("[check] ");
        const cleanBulletText = isCheck ? bulletText.substring(8) : bulletText;

        currentList.push(
          <li key={`li-${i}`} className="flex items-start gap-2.5">
            {isCheck ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <span
                className={`font-bold text-lg leading-none mt-0.5 flex-shrink-0 ${isPrivacy ? "text-blue-500" : "text-indigo-500"}`}
              >
                •
              </span>
            )}
            <span className="text-slate-600 text-sm leading-relaxed">
              {renderTextWithBold(cleanBulletText)}
            </span>
          </li>,
        );
      } else {
        flushList();
        const content = (
          <p key={`p-${i}`} className="text-slate-600 leading-relaxed text-sm">
            {renderTextWithBold(line)}
          </p>
        );
        if (sectionTitle) {
          sectionContent.push(content);
        } else {
          elements.push(content);
        }
      }
    }

    flushSection();
    flushList();

    return elements;
  };

  const pageContent = activeTab === "privacy" ? privacyContent : termsContent;

  return (
    <main className="min-h-screen bg-white font-[Manrope,sans-serif] text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-white/85 backdrop-blur-xl shadow-xs">
        <nav className="mx-auto flex h-[72px] max-w-[1140px] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-30 w-32 sm:h-30 sm:w-36 items-center justify-start rounded-xl overflow-hidden relative"
            >
              <Image
                src="/logo_dark.png"
                alt="GullyGig Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </motion.div>
          </Link>

          {/* Navigation Tab Toggles */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleTabChange("terms")}
              className={`text-sm font-bold transition-colors relative py-1.5 cursor-pointer
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                ${
                  activeTab === "terms"
                    ? "text-blue-600 after:scale-x-100 after:origin-bottom-left"
                    : "text-slate-600 hover:text-blue-600 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
                }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
              </span>
            </button>
            <button
              onClick={() => handleTabChange("privacy")}
              className={`text-sm font-bold transition-colors relative py-1.5 cursor-pointer
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                ${
                  activeTab === "privacy"
                    ? "text-blue-600 after:scale-x-100 after:origin-bottom-left"
                    : "text-slate-600 hover:text-blue-600 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
                }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy
              </span>
            </button>
          </div>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Main Content Body */}
      <div className="pt-[96px] px-4 sm:px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Mobile Tab Toggles */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => handleTabChange("terms")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "terms"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              Terms of Service
            </button>
            <button
              onClick={() => handleTabChange("privacy")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="h-4.5 w-4.5" />
              Privacy Policy
            </button>
          </div>

          {/* Parsed Markdown Output */}
          <div className="space-y-6 sm:space-y-8 mt-6">
            {parseMarkdownToReact(pageContent, activeTab === "privacy")}
          </div>
        </div>
      </div>

      {/* Footer (Simplified as requested: only Our Team & Social Links) */}
      <footer className="bg-white border-t border-slate-100 py-10 transition-colors duration-300">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Brand & Socials */}
            <div className="text-center md:text-left">
              <Link
                href="/"
                className="flex items-center justify-center md:justify-start mb-4"
              >
                <div className="relative h-30 w-32 sm:h-30 sm:w-32 overflow-hidden flex-shrink-0">
                  <Image
                    src="/logo_dark.png"
                    alt="GullyGig Logo"
                    fill
                    className="object-contain object-center md:object-left"
                  />
                </div>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w mx-auto md:mx-0">
                Discover trusted local professionals and skilled workers near
                you.
              </p>

              {/* Social Media & Share Icons */}
              <div className="flex items-center justify-center md:justify-start gap-2.5 mt-4 flex-wrap">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer flex-shrink-0"
                  aria-label="Share GullyGig"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                {socialIcons.map((social) => {
                  const Icon = social.icon;
                  const href =
                    SOCIAL_LINKS[social.key as keyof typeof SOCIAL_LINKS];
                  if (!href || href === "#") return null;

                  return (
                    <a
                      key={social.key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full bg-slate-100 text-slate-600 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Team Link Only */}
            <div className="flex flex-col items-center md:items-end justify-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-center md:text-right">
                <li>
                  <Link
                    href="/team"
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                  >
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} GullyGig • Mumbai, India
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
