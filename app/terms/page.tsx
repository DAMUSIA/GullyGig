"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  ArrowLeft,
  Share2,
  Scale,
  Users,
  DollarSign,
  Clock,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Star,
  Database,
  Eye,
  Lock,
  Cookie,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Top Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-sm">
        <nav className="mx-auto flex h-[72px] max-w-container-max items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              /* 
                 LOGO SIZE CONFIGURATION (Mobile Responsive):
                 - Mobile: h-8 w-28 (32px height, 112px width)
                 - Tablet/Desktop (sm and up): h-10 w-36 (40px height, 144px width)
                 You can adjust these classes (e.g. h-8, w-28, sm:h-10, sm:w-36) to fit your logo's dimensions.
              */
              className="flex h-8 w-28 sm:h-10 sm:w-36 items-center justify-start rounded-xl overflow-hidden relative"
            >
              <Image
                src={isDark ? "/logo_light.png" : "/logo_dark.png"}
                alt="Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </motion.div>
          </Link>

          {/* Nav links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveTab("terms")}
              className={`text-sm font-bold transition-colors relative py-1.5 
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                ${
                  activeTab === "terms"
                    ? "text-blue-600 dark:text-blue-400 after:scale-x-100 after:origin-bottom-left"
                    : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
                }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
              </span>
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`text-sm font-bold transition-colors relative py-1.5 
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                ${
                  activeTab === "privacy"
                    ? "text-blue-600 dark:text-blue-400 after:scale-x-100 after:origin-bottom-left"
                    : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="pt-[88px] px-4 sm:px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 min-h-[400px] mt-6"
          >
            {activeTab === "terms" ? (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Terms and Conditions
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        GullyGig Connect | Effective Date: July 1, 2025 | Last
                        Updated: June 22, 2025
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    Please read these Terms and Conditions carefully before
                    using the GullyGig Connect platform. By registering,
                    accessing, or using our platform, you agree to be bound by
                    these Terms. If you do not agree, do not use the Platform.
                  </p>
                </div>

                {/* Section 1 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      1. About GullyGig Connect
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    GullyGig Connect (a startup registered under Indian law)
                    operates the GullyGig Connect platform — a hyperlocal
                    service marketplace that connects skilled individuals
                    (referred to as &quot;Service Providers&quot;) with
                    customers who need local services (referred to as
                    &quot;Service Seekers&quot; or &quot;Customers&quot;). The
                    Platform is accessible via our website and mobile
                    application.
                  </p>
                </section>

                {/* Section 2 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      2. Eligibility
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    To use the Platform, you must:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Be at least 18 years of age</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Be a resident of India</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Have the legal capacity to enter into a binding
                        agreement
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Provide accurate and complete registration information
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    By using the Platform, you confirm that you meet all of the
                    above eligibility criteria.
                  </p>
                </section>

                {/* Section 3 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      3. User Accounts
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        3.1 Registration
                      </h4>
                      <p>
                        You must create an account to access most features of
                        the Platform. You agree to provide true, accurate, and
                        up-to-date information during registration and to keep
                        this information updated.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        3.2 Account Security
                      </h4>
                      <p>
                        You are responsible for maintaining the confidentiality
                        of your login credentials. You must notify us
                        immediately at talktous.at.damusia@gmail.com if you
                        suspect any unauthorized use of your account.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        3.3 One Account Per User
                      </h4>
                      <p>
                        Each individual may register only one account. Creating
                        multiple accounts is prohibited and may result in all
                        accounts being permanently suspended.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      4. Service Providers
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    If you register as a Service Provider on the Platform:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You represent that you have the skills, qualifications,
                        and legal right to offer the services you list.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You are solely responsible for the quality, legality,
                        and safety of the services you provide.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You agree to provide services in a professional, timely,
                        and honest manner.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You understand that GullyGig Connect is a marketplace
                        only and is not your employer. You are an independent
                        service provider.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You must not misrepresent your skills, qualifications,
                        or identity.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You are responsible for your own taxes, including GST
                        where applicable, arising from your income earned
                        through the Platform.
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Section 5 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      5. Service Seekers (Customers)
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    If you use the Platform to find and hire services:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You agree to treat Service Providers with respect and
                        professionalism.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You agree to make payments in full and on time as agreed
                        with the Service Provider.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You agree to provide accurate information about the
                        service you require.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        You understand that GullyGig Connect does not guarantee
                        the quality or outcome of any service arranged through
                        the Platform.
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      6. Platform Role and Disclaimer
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    GullyGig Connect is a technology platform and marketplace
                    only. We do not employ Service Providers, and we are not a
                    party to any agreement between Service Providers and Service
                    Seekers.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    We do not guarantee:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        The availability, quality, or reliability of any service
                        listed on the Platform
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        The accuracy of any information provided by users
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        That Service Providers hold any specific licence or
                        certification (unless verified by us)
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    Any disputes arising from services must be resolved between
                    the Service Provider and Service Seeker directly. GullyGig
                    Connect may assist in dispute resolution at its discretion
                    but is not obligated to do so.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      7. Payments and Commission
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        7.1 Payment Processing
                      </h4>
                      <p>
                        All payments on the Platform are processed securely
                        through Razorpay. By making a payment, you also agree to
                        Razorpay&apos;s terms of service.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        7.2 Commission
                      </h4>
                      <p>
                        GullyGig Connect charges a commission of approximately
                        10% on each completed transaction. This fee is deducted
                        before the payout is made to the Service Provider. The
                        exact commission percentage will be communicated on the
                        Platform and may change with prior notice.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        7.3 Refunds
                      </h4>
                      <p>
                        Refund requests must be raised within 48 hours of the
                        service completion. Refunds are handled on a
                        case-by-case basis. GullyGig Connect reserves the right
                        to approve or reject refund requests.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        7.4 Taxes
                      </h4>
                      <p>
                        All amounts displayed may be exclusive of applicable
                        taxes such as GST. Users are responsible for their own
                        tax obligations.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      8. Prohibited Conduct
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    You agree NOT to use the Platform to:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>
                        Provide false information or impersonate any person or
                        entity
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>
                        Offer illegal services or services that violate Indian
                        law
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>
                        Harass, threaten, abuse, or discriminate against any
                        user
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>
                        Post misleading, defamatory, or fraudulent reviews
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>
                        Circumvent the Platform&apos;s payment system to deal
                        directly with users found on the Platform (payment
                        circumvention)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>Upload viruses, malware, or any harmful code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>
                        Scrape, copy, or reproduce Platform content without
                        permission
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">•</span>
                      <span>Use the Platform for any unlawful purpose</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    Violation of any of the above may result in immediate
                    suspension or permanent termination of your account without
                    refund.
                  </p>
                </section>

                {/* Section 9 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      9. Ratings and Reviews
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    Users may leave honest ratings and reviews after a completed
                    transaction. Reviews must be:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Based on genuine, first-hand experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Free from abusive, defamatory, or discriminatory
                        language
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Not incentivized or manipulated</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    GullyGig Connect reserves the right to remove reviews that
                    violate these guidelines.
                  </p>
                </section>

                {/* Section 10 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      10. Intellectual Property
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    All content on the Platform, including the GullyGig Connect
                    name, logo, design, software, and text, is the intellectual
                    property of GullyGig Connect and is protected under Indian
                    copyright and trademark law. You may not reproduce,
                    distribute, or create derivative works without our prior
                    written consent.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    By uploading content to the Platform (such as profile photos
                    or service descriptions), you grant GullyGig Connect a
                    non-exclusive, royalty-free licence to display and use that
                    content on the Platform.
                  </p>
                </section>

                {/* Section 11 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      11. Suspension and Termination
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    GullyGig Connect reserves the right to suspend or terminate
                    your account at any time if:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>You violate these Terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>You engage in fraudulent or illegal activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        Your conduct harms other users or the Platform
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        We receive repeated credible complaints about you
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    You may also close your account at any time by contacting us
                    at talktous.at.damusia@gmail.com. Termination does not
                    relieve you of obligations incurred prior to termination.
                  </p>
                </section>

                {/* Section 12 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      12. Limitation of Liability
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    To the maximum extent permitted by Indian law, GullyGig
                    Connect shall not be liable for:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        Any indirect, incidental, or consequential damages
                        arising from use of the Platform
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>Loss of data, revenue, or profits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        Any harm caused by services arranged through the
                        Platform
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        •
                      </span>
                      <span>
                        Any disruption, downtime, or errors on the Platform
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    Our total liability to any user, in any circumstance, shall
                    not exceed the total commission earned from that user in the
                    3 months preceding the claim.
                  </p>
                </section>

                {/* Section 13 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      13. Indemnification
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    You agree to indemnify and hold harmless GullyGig Connect,
                    its founders, employees, and partners from any claims,
                    losses, damages, or expenses (including legal fees) arising
                    out of: (a) your use of the Platform, (b) your violation of
                    these Terms, or (c) any services you provide or receive
                    through the Platform.
                  </p>
                </section>

                {/* Section 14 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      14. Governing Law and Dispute Resolution
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    These Terms are governed by the laws of India. Any disputes
                    arising from or related to these Terms or the Platform shall
                    be subject to the exclusive jurisdiction of the courts in
                    Mumbai, Maharashtra.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    We encourage users to first attempt to resolve disputes
                    amicably by contacting us at talktous.at.damusia@gmail.com
                    before initiating any legal proceedings.
                  </p>
                </section>

                {/* Section 15 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      15. Changes to These Terms
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    We may update these Terms from time to time. We will notify
                    you of any material changes via email or a notice on the
                    Platform at least 7 days before the changes take effect.
                    Continued use of the Platform after the effective date
                    constitutes your acceptance of the revised Terms.
                  </p>
                </section>

                {/* Section 16 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    16. Severability
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    If any provision of these Terms is found to be invalid or
                    unenforceable by a court of law, the remaining provisions
                    shall continue in full force and effect.
                  </p>
                </section>

                {/* Section 17 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    17. Entire Agreement
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    These Terms, together with our Privacy Policy, constitute
                    the entire agreement between you and GullyGig Connect
                    regarding your use of the Platform and supersede all prior
                    agreements or understandings.
                  </p>
                </section>

                {/* Section 18 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    18. Contact Us
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    For any questions or concerns regarding these Terms, please
                    contact:
                  </p>
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        GullyGig Connect
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Mumbai, Maharashtra, India</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>talktous.at.damusia@gmail.com</span>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Shield className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Privacy Policy
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        GullyGig Connect | Effective Date: July 1, 2025 | Last
                        Updated: June 22, 2025
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    This Privacy Policy explains how GullyGig Connect collects,
                    uses, stores, shares, and protects the personal information
                    of users who access or use the GullyGig Connect platform. By
                    using the Platform, you agree to the terms of this Privacy
                    Policy.
                  </p>
                </div>

                {/* Section 1 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      1. Who We Are
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    GullyGig Connect is a hyperlocal service marketplace that
                    connects skilled individuals (Service Providers) with
                    customers (Service Seekers) for part-time and local services
                    including tutoring, tailoring, home cooking, home
                    assistance, and other skill-based services. We are based in
                    Mumbai, Maharashtra, India.
                  </p>
                </section>

                {/* Section 2 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      2. Information We Collect
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    We collect the following categories of personal information:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        a) Information You Provide Directly:
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>Full name and profile photo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>Email address and phone number</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Residential or service area (city, locality, pin
                            code)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Skills, qualifications, and service details (for
                            Service Providers)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Government-issued ID for identity verification
                            (where applicable)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Payment and bank account details (processed via
                            Razorpay; we do not store card or UPI credentials)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Reviews, ratings, and messages exchanged on the
                            Platform
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        b) Information Collected Automatically:
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            IP address, browser type, and device information
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Location data (only when you grant permission)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>
                            Usage data: pages visited, time spent, features used
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">
                            •
                          </span>
                          <span>Cookies and similar tracking technologies</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      3. How We Use Your Information
                    </h3>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>To create, maintain, and verify your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To display your profile to potential customers or
                        service providers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To facilitate communication between Service Providers
                        and Service Seekers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To process payments and maintain transaction records
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>To enable ratings and reviews</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To send service updates, booking confirmations, and
                        important notices
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To send promotional communications (only with your
                        consent)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To prevent fraud, abuse, or misuse of the Platform
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To comply with applicable Indian laws and regulations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        To improve our Platform through analytics and feedback
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Section 4 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      4. Legal Basis for Processing (India)
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    We process your data in compliance with the Information
                    Technology Act, 2000 and the Information Technology
                    (Reasonable Security Practices and Procedures and Sensitive
                    Personal Data or Information) Rules, 2011. We process data
                    based on: (a) your consent, (b) performance of a contract
                    (providing our services), (c) legitimate business interests,
                    and (d) compliance with legal obligations.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      5. Sharing of Information
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    We do not sell your personal information. We may share your
                    information in the following limited circumstances:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">With other users:</span>{" "}
                        Your profile, services listed, and reviews are visible
                        to other Platform users as part of the service discovery
                        feature.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">
                          With payment processors:
                        </span>{" "}
                        Razorpay processes all payments. Their privacy policy
                        governs how they handle your payment data.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">
                          With service providers:
                        </span>{" "}
                        Cloud hosting (Supabase, Vercel) and analytics providers
                        who are contractually bound to protect your data.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">
                          With law enforcement or government authorities:
                        </span>{" "}
                        When required by law, court order, or to protect the
                        safety of our users or the public.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">
                          In a business transfer:
                        </span>{" "}
                        If GullyGig Connect merges, is acquired, or sells
                        assets, your data may be transferred. We will notify you
                        before this happens.
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      6. Data Storage and Security
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    Your data is stored on secure servers managed by Supabase
                    (PostgreSQL). We implement industry-standard security
                    measures including:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Encrypted data transmission using HTTPS/TLS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Secure authentication via Supabase Auth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Access controls limiting who can view your data
                        internally
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Regular security reviews</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    However, no system is 100% secure. In the event of a data
                    breach that affects your rights, we will notify you within
                    72 hours as per applicable law.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      7. Data Retention
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    We retain your personal data for as long as your account is
                    active or as needed to provide services. Specifically:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">Account data:</span>{" "}
                        Retained while your account is active and for 2 years
                        after deletion
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">
                          Transaction records:
                        </span>{" "}
                        Retained for 7 years to comply with Indian tax and
                        financial laws
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        <span className="font-semibold">
                          Communication logs:
                        </span>{" "}
                        Retained for 1 year for dispute resolution purposes
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    You may request deletion of your account and data at any
                    time (see Section 9).
                  </p>
                </section>

                {/* Section 8 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Cookie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      8. Cookies and Tracking
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>Keep you logged in (session cookies)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>Remember your preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        •
                      </span>
                      <span>
                        Analyze how the Platform is used (analytics cookies)
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    You can disable cookies in your browser settings; however,
                    some features of the Platform may not function correctly
                    without them.
                  </p>
                </section>

                {/* Section 9 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      9. Your Rights
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    Under applicable Indian law and our policy, you have the
                    right to:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Access the personal information we hold about you
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Correct inaccurate or incomplete information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Request deletion of your account and associated data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Withdraw consent for marketing communications at any
                        time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Lodge a complaint with a relevant data protection
                        authority
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-2">
                    To exercise any of these rights, contact us at:
                    talktous.at.damusia@gmail.com
                  </p>
                </section>

                {/* Section 10 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      10. Children&apos;s Privacy
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    The Platform is not intended for children under the age of
                    18. We do not knowingly collect personal information from
                    minors. If we become aware that a minor has provided us with
                    personal data, we will delete it immediately. Parents or
                    guardians who believe their child has used our Platform
                    should contact us.
                  </p>
                </section>

                {/* Section 11 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    11. Third-Party Links
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    The Platform may contain links to third-party websites or
                    services. We are not responsible for the privacy practices
                    or content of those third parties. We encourage you to read
                    their privacy policies before providing any personal
                    information.
                  </p>
                </section>

                {/* Section 12 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      12. Changes to This Privacy Policy
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    We may update this Privacy Policy from time to time. When we
                    make material changes, we will notify you via email or a
                    prominent notice on the Platform at least 7 days before the
                    changes take effect. Your continued use of the Platform
                    after the effective date constitutes acceptance of the
                    updated policy.
                  </p>
                </section>

                {/* Section 13 */}
                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    13. Contact Us
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-2">
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy, please contact us:
                  </p>
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        GullyGig Connect
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Mumbai, Maharashtra, India</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>talktous.at.damusia@gmail.com</span>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-10 transition-colors duration-300">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left - Brand */}
            <div className="text-center md:text-left">
              <Link
                href="/"
                className="flex items-center justify-center md:justify-start mb-4"
              >
                {/* 
                   LOGO SIZE CONFIGURATION (Mobile Responsive):
                   - Mobile: h-7 w-24 (28px height, 96px width)
                   - Tablet/Desktop (sm and up): h-9 w-32 (36px height, 128px width)
                   You can adjust these classes (e.g. h-7, w-24, sm:h-9, sm:w-32) to fit your logo's dimensions.
                */}
                <div className="relative h-7 w-24 sm:h-9 sm:w-32 overflow-hidden flex-shrink-0">
                  <Image
                    src={isDark ? "/logo_light.png" : "/logo_dark.png"}
                    alt="Logo"
                    fill
                    className="object-contain object-center md:object-left"
                  />
                </div>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w mx-auto md:mx-0">
                Discover trusted local professionals and skilled workers near
                you.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2.5 mt-4 flex-wrap">
                <button
                  onClick={() => {
                    const shareData = {
                      title: "GullyGig - Find Trusted Local Service Providers",
                      text: "Discover verified tutors, cooks, babysitters, and skilled professionals near you on GullyGig!",
                      url:
                        typeof window !== "undefined"
                          ? window.location.origin
                          : "https://gullygig.in",
                    };
                    if (navigator.share) {
                      navigator.share(shareData).catch(() => {});
                    } else {
                      navigator.clipboard
                        .writeText(shareData.url)
                        .then(() => {})
                        .catch(() => {});
                    }
                  }}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer flex-shrink-0"
                  aria-label="Share GullyGig"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
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
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
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
              &copy; {new Date().getFullYear()} GullyGig • Mumbai, India
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <Link
                href="/terms"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
