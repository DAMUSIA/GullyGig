"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  PhoneCall,
  Globe,
  QrCode,
  Star,
  SlidersHorizontal,
  BarChart3,
  Heart,
  ArrowUpRight,
} from "lucide-react";

const FEATURES_DATA = [
  {
    icon: MapPin,
    title: "Hyperlocal Search & Map",
    desc: "Pinpoint verified tutors, coaches, and local experts right in your area with fast distance and city filters.",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient:
      "from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "Nearby Search",
  },
  {
    icon: PhoneCall,
    title: "Direct One-Tap Contact",
    desc: "Reach out instantly via direct phone call or WhatsApp message with 0% platform cuts and zero middleman delays.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient:
      "from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "Direct Chat",
  },
  {
    icon: Globe,
    title: "Live Public Portfolios",
    desc: "Share your dedicated service link on WhatsApp, Instagram, or social media to showcase ratings, rates, and video bios.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient:
      "from-violet-50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: "Instant Link",
  },
  {
    icon: QrCode,
    title: "Ad Poster Generator",
    desc: "Generate high-resolution marketing flyers and posters with customized QR codes and rates ready to print or download.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient:
      "from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "Print & Share",
  },
  {
    icon: Star,
    title: "Verified Community Ratings",
    desc: "Build credibility with genuine student and neighbor reviews, verifiable feedback, and transparent 5-star ratings.",
    gradient: "from-yellow-500 to-amber-600",
    bgGradient:
      "from-yellow-50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    badge: "Trust & Safety",
  },
  {
    icon: SlidersHorizontal,
    title: "Custom Service Filters",
    desc: "Filter seamlessly by delivery mode (Online / Offline), spoken languages, flexible availability, and budget range.",
    gradient: "from-sky-500 to-blue-600",
    bgGradient:
      "from-sky-50 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20",
    iconColor: "text-sky-600 dark:text-sky-400",
    badge: "Precise Match",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Track total portfolio views, user likes, inquiry volume, and engagement metrics with real-time visual charts.",
    gradient: "from-indigo-500 to-cyan-600",
    bgGradient:
      "from-indigo-50 to-cyan-50/50 dark:from-indigo-950/30 dark:to-cyan-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badge: "Growth Stats",
  },
  {
    icon: Heart,
    title: "Favorites & Quick Access",
    desc: "Bookmark your favorite providers with a single tap so you can easily re-contact and book services whenever needed.",
    gradient: "from-rose-500 to-pink-600",
    bgGradient:
      "from-rose-50 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    badge: "1-Tap Save",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 py-24 bg-slate-50/60 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1240px] px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-900/40 mb-3.5 inline-block">
              Everything Included
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-2 mb-4">
              All-In-One Local Service Network
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Powerful tools built for independent service providers, tutors,
              and local neighbors to connect directly without intermediary fees.
            </p>
          </motion.div>
        </div>

        {/* 4 by 4 (2 Rows) Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES_DATA.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.2 },
                }}
                className="group relative bg-white dark:bg-slate-900/90 rounded-3xl p-6 md:p-7 border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-blue-500/8 dark:hover:shadow-blue-500/5 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Large Icon & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feat.bgGradient} border border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform duration-300`}
                    >
                      <IconComponent
                        className={`h-7 w-7 sm:h-8 sm:w-8 ${feat.iconColor}`}
                      />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                {/* Micro Footer Line */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Learn more
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
