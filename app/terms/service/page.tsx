"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  Scale,
  Users,
  DollarSign,
  Shield,
  Clock,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Star,
} from "lucide-react";

export default function TermsServicePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Top Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-sm">
        <nav className="mx-auto flex h-[72px] max-w-container-max items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden"
            >
              <Image
                src="/logo.png"
                alt="GullyGig Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </motion.div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
              GullyGig
            </span>
          </Link>

          {/* Nav links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-bold transition-colors relative py-1.5 
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              Home
            </Link>
            <Link
              href="/terms/service"
              className="text-sm font-bold transition-colors relative py-1.5 
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                text-blue-600 dark:text-blue-400 after:scale-x-100 after:origin-bottom-left"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
              </span>
            </Link>
            <Link
              href="/terms/privacy"
              className="text-sm font-bold transition-colors relative py-1.5 
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600 after:transition-transform after:duration-300
                text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy
              </span>
            </Link>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 mt-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Terms and Conditions
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  GullyGig Connect | Effective Date: July 1, 2025 | Last
                  Updated: June 22, 2025
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Please read these Terms and Conditions carefully before using the
              GullyGig Connect platform. By registering, accessing, or using our
              platform, you agree to be bound by these Terms. If you do not
              agree, do not use the Platform.
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Section 1 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  1. About GullyGig Connect
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                GullyGig Connect (a startup registered under Indian law)
                operates the GullyGig Connect platform — a hyperlocal service
                marketplace that connects skilled individuals (referred to as
                &quot;Service Providers&quot;) with customers who need local
                services (referred to as &quot;Service Seekers&quot; or
                &quot;Customers&quot;). The Platform is accessible via our
                website and mobile application.
              </p>
            </section>

            {/* Section 2 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  2. Eligibility
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-3">
                To use the Platform, you must:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
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
                    Have the legal capacity to enter into a binding agreement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Provide accurate and complete registration information
                  </span>
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                By using the Platform, you confirm that you meet all of the
                above eligibility criteria.
              </p>
            </section>

            {/* Section 3 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  3. User Accounts
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    3.1 Registration
                  </h4>
                  <p>
                    You must create an account to access most features of the
                    Platform. You agree to provide true, accurate, and
                    up-to-date information during registration and to keep this
                    information updated.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    3.2 Account Security
                  </h4>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your login credentials. You must notify us immediately at
                    talktous.at.damusia@gmail.com if you suspect any
                    unauthorized use of your account.
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
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  4. Service Providers
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-3">
                If you register as a Service Provider on the Platform:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You represent that you have the skills, qualifications, and
                    legal right to offer the services you list.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You are solely responsible for the quality, legality, and
                    safety of the services you provide.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You agree to provide services in a professional, timely, and
                    honest manner.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You understand that GullyGig Connect is a marketplace only
                    and is not your employer. You are an independent service
                    provider.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You must not misrepresent your skills, qualifications, or
                    identity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You are responsible for your own taxes, including GST where
                    applicable, arising from your income earned through the
                    Platform.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  5. Service Seekers (Customers)
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-3">
                If you use the Platform to find and hire services:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
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
                    You agree to provide accurate information about the service
                    you require.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    You understand that GullyGig Connect does not guarantee the
                    quality or outcome of any service arranged through the
                    Platform.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  6. Platform Role and Disclaimer
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                GullyGig Connect is a technology platform and marketplace only.
                We do not employ Service Providers, and we are not a party to
                any agreement between Service Providers and Service Seekers.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                We do not guarantee:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mt-2">
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
                  <span>The accuracy of any information provided by users</span>
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                Any disputes arising from services must be resolved between the
                Service Provider and Service Seeker directly. GullyGig Connect
                may assist in dispute resolution at its discretion but is not
                obligated to do so.
              </p>
            </section>

            {/* Section 7 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  7. Payments and Commission
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    7.1 Payment Processing
                  </h4>
                  <p>
                    All payments on the Platform are processed securely through
                    Razorpay. By making a payment, you also agree to
                    Razorpay&apos;s terms of service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    7.2 Commission
                  </h4>
                  <p>
                    GullyGig Connect charges a commission of approximately 10%
                    on each completed transaction. This fee is deducted before
                    the payout is made to the Service Provider. The exact
                    commission percentage will be communicated on the Platform
                    and may change with prior notice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    7.3 Refunds
                  </h4>
                  <p>
                    Refund requests must be raised within 48 hours of the
                    service completion. Refunds are handled on a case-by-case
                    basis. GullyGig Connect reserves the right to approve or
                    reject refund requests.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    7.4 Taxes
                  </h4>
                  <p>
                    All amounts displayed may be exclusive of applicable taxes
                    such as GST. Users are responsible for their own tax
                    obligations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  8. Prohibited Conduct
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-3">
                You agree NOT to use the Platform to:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
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
                    Offer illegal services or services that violate Indian law
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400">•</span>
                  <span>
                    Harass, threaten, abuse, or discriminate against any user
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                Violation of any of the above may result in immediate suspension
                or permanent termination of your account without refund.
              </p>
            </section>

            {/* Section 9 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  9. Ratings and Reviews
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Users may leave honest ratings and reviews after a completed
                transaction. Reviews must be:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Based on genuine, first-hand experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Free from abusive, defamatory, or discriminatory language
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Not incentivized or manipulated</span>
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                GullyGig Connect reserves the right to remove reviews that
                violate these guidelines.
              </p>
            </section>

            {/* Section 10 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  10. Intellectual Property
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                All content on the Platform, including the GullyGig Connect
                name, logo, design, software, and text, is the intellectual
                property of GullyGig Connect and is protected under Indian
                copyright and trademark law. You may not reproduce, distribute,
                or create derivative works without our prior written consent.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                By uploading content to the Platform (such as profile photos or
                service descriptions), you grant GullyGig Connect a
                non-exclusive, royalty-free licence to display and use that
                content on the Platform.
              </p>
            </section>

            {/* Section 11 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  11. Suspension and Termination
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                GullyGig Connect reserves the right to suspend or terminate your
                account at any time if:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mt-3">
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
                  <span>Your conduct harms other users or the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>We receive repeated credible complaints about you</span>
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                You may also close your account at any time by contacting us at
                talktous.at.damusia@gmail.com. Termination does not relieve you
                of obligations incurred prior to termination.
              </p>
            </section>

            {/* Section 12 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  12. Limitation of Liability
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                To the maximum extent permitted by Indian law, GullyGig Connect
                shall not be liable for:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    •
                  </span>
                  <span>
                    Any indirect, incidental, or consequential damages arising
                    from use of the Platform
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
                    Any harm caused by services arranged through the Platform
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                Our total liability to any user, in any circumstance, shall not
                exceed the total commission earned from that user in the 3
                months preceding the claim.
              </p>
            </section>

            {/* Section 13 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  13. Indemnification
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                You agree to indemnify and hold harmless GullyGig Connect, its
                founders, employees, and partners from any claims, losses,
                damages, or expenses (including legal fees) arising out of: (a)
                your use of the Platform, (b) your violation of these Terms, or
                (c) any services you provide or receive through the Platform.
              </p>
            </section>

            {/* Section 14 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  14. Governing Law and Dispute Resolution
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                These Terms are governed by the laws of India. Any disputes
                arising from or related to these Terms or the Platform shall be
                subject to the exclusive jurisdiction of the courts in Mumbai,
                Maharashtra.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mt-3">
                We encourage users to first attempt to resolve disputes amicably
                by contacting us at talktous.at.damusia@gmail.com before
                initiating any legal proceedings.
              </p>
            </section>

            {/* Section 15 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  15. Changes to These Terms
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                We may update these Terms from time to time. We will notify you
                of any material changes via email or a notice on the Platform at
                least 7 days before the changes take effect. Continued use of
                the Platform after the effective date constitutes your
                acceptance of the revised Terms.
              </p>
            </section>

            {/* Section 16 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                16. Severability
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                If any provision of these Terms is found to be invalid or
                unenforceable by a court of law, the remaining provisions shall
                continue in full force and effect.
              </p>
            </section>

            {/* Section 17 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                17. Entire Agreement
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and GullyGig Connect regarding your
                use of the Platform and supersede all prior agreements or
                understandings.
              </p>
            </section>

            {/* Section 18 */}
            <section className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                18. Contact Us
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-3">
                For any questions or concerns regarding these Terms, please
                contact:
              </p>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
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
          </motion.div>
        </div>
      </div>
    </main>
  );
}
