"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "../Icon";

const FEATURES_DATA = [
  {
    icon: "location_on",
    title: "Location-Based Discovery",
    desc: "Find skilled professionals right in your neighborhood with our hyper-local map radius matching.",
  },
  {
    icon: "contact_mail",
    title: "Direct Contact Options",
    desc: "Reach out via phone, email, or direct messaging instantly. No bookings or commission fees.",
  },
  {
    icon: "manage_accounts",
    title: "Verified Skill Profiles",
    desc: "Browse detailed experience, work portfolios, and credential verification checks with ease.",
  },
  {
    icon: "reviews",
    title: "Community Reviews",
    desc: "Read reviews and ratings left by actual neighbors to ensure high credibility and trust.",
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
