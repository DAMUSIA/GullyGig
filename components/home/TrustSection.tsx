"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Icon from "../Icon";

const TRUST_CHECKS = [
  "Verified Neighborhood Profiles",
  "Direct Contact Communication",
  "Community-Driven Ratings & Reviews",
  "Localized Skill Categorization",
];

export default function TrustSection() {
  const router = useRouter();

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="mx-auto max-w-[1140px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Image with Floating verified badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="rounded-[32px] overflow-hidden h-[440px] w-full shadow-2xl relative border-4 border-slate-50 dark:border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home_page_images/trust-neighbors.png"
              alt="Community trust"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            {/* Watermark logo */}
            <div className="absolute bottom-6 left-6 flex items-center gap-1.5 text-white font-extrabold text-sm drop-shadow-md">
              <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Icon name="check" className="text-[10px]" fill />
              </div>
              <span>GullyGig</span>
            </div>
          </div>

          {/* Floating verified trust card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700/50 p-5 w-[230px] transition-colors duration-300"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-brand-bg-light dark:bg-slate-700">
                <Icon
                  name="verified_user"
                  fill
                  className="text-sm text-brand-primary"
                />
              </div>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Hyperlocal trust
              </p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every provider details are community verified for safe connections
              and references.
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Content & Checklist */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-extrabold text-slate-800 dark:text-white mb-6 leading-[1.2]">
            Building Stronger <br />
            Neighborhoods{" "}
            <span className="text-brand-primary">Through Trust</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-[460px]">
            We believe the best expertise is often right down the street. Our
            platform isn&apos;t just about tasks; it&apos;s about reconnecting
            neighbors through a valuable and verified local search discovery
            network.
          </p>

          <ul className="space-y-4 mb-8">
            {TRUST_CHECKS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3.5"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-brand-primary text-white shadow-sm shadow-blue-500/10">
                  <Icon name="check" fill className="text-xs text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>

          <button
            onClick={() => router.push("/legal?tab=terms")}
            className="text-sm font-bold text-brand-primary border border-brand-primary-light bg-brand-bg-light hover:bg-brand-bg-hover rounded-xl px-7 py-3.5 transition-all active:scale-95 cursor-pointer hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-750"
            suppressHydrationWarning
          >
            Learn About Our Safety Standards
          </button>
        </motion.div>
      </div>
    </section>
  );
}
