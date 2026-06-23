"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "../Icon";

const FEATURES_DATA = [
  {
    icon: "explore",
    title: "Hyperlocal Search & Map",
    desc: "Pinpoint verified tutors, dance coaches, and yoga guides right in your city with seamless Google Maps routing.",
  },
  {
    icon: "contact_phone",
    title: "Direct One-Tap Connection",
    desc: "Reach out instantly via phone call or WhatsApp. Skip the middlemen and the booking fees entirely!",
  },
  {
    icon: "public",
    title: "Public Service Portfolios",
    desc: "Share your personal profile link on social media or WhatsApp status to display pricing, languages, and reviews.",
  },
  {
    icon: "qr_code_2",
    title: "Ad Poster Generator",
    desc: "Create beautifully themed marketing posters containing QR codes, pricing tags, and contact details to print or share.",
  },
  {
    icon: "reviews",
    title: "Community Ratings & Reviews",
    desc: "Read genuine reviews from neighbors or share your own experience to help build a trustworthy network.",
  },
  {
    icon: "tune",
    title: "Custom Service Filters",
    desc: "Filter listings by teaching modes (online/offline), language choices, flexible availability, and budget.",
  },
  {
    icon: "bar_chart",
    title: "Interactive Analytics",
    desc: "Monitor views, likes, and direct inquiries with automated, real-time charts to grow your client base.",
  },
  {
    icon: "favorite",
    title: "One-Tap Favorites Saver",
    desc: "Save your preferred tutors and helpers with a single tap so you can reach them whenever you need.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 py-20 bg-white dark:bg-slate-950 transition-colors duration-300 relative"
    >
      <div className="mx-auto max-w-[1140px] px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-slate-800 dark:text-white mb-3">
              Platform Features
            </h2>
            <div className="mx-auto mb-5 h-1 w-14 rounded-full bg-brand-primary" />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[480px] mx-auto">
              Everything you need to discover community talent and show your
              skills with zero middleman friction.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES_DATA.map((feat) => (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
                rotateX: 2,
                rotateY: -2,
                boxShadow: "0 25px 35px -5px rgba(37, 99, 235, 0.12)",
              }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-primary-light dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-bg-light dark:bg-slate-800 mb-6">
                <Icon
                  name={feat.icon}
                  fill
                  className="text-xl text-brand-primary"
                />
              </div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200 mb-2.5">
                {feat.title}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
