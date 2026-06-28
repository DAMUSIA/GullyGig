"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "../Icon";

const PROVIDER_STEPS = [
  {
    n: "1",
    title: "Create Your Listing",
    desc: "List your skills, experience, qualifications, and local availability details.",
  },
  {
    n: "2",
    title: "Receive Client Inquiries",
    desc: "Chat with neighbors directly and confirm service details on your own terms.",
  },
  {
    n: "3",
    title: "Grow Your Brand",
    desc: "Gain visibility, obtain ratings, reviews, and earn repeat local referrals.",
  },
];

const CUSTOMER_STEPS = [
  {
    n: "1",
    title: "Find Local Expertise",
    desc: "Search for specific skills or browse categories within your local area.",
  },
  {
    n: "2",
    title: "Check Reputation",
    desc: "View provider ratings and feedback left by other neighbors to ensure trust.",
  },
  {
    n: "3",
    title: "Contact Directly",
    desc: "Reach out via phone, email, or chat to schedule and discuss project details.",
  },
];

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

/**
 * Renders the "How GullyGig Works" section with provider and customer steps.
 *
 * @returns The section content for the platform's provider and customer onboarding overview.
 */
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 py-24 bg-brand-primary text-white transition-colors duration-300 relative overflow-hidden"
    >
      {/* Decorative rings */}
      <div className="absolute top-0 right-0 w-96 h-96 border-4 border-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 border-4 border-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />

      <div className="mx-auto max-w-[1140px] px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-extrabold mb-4 text-white">
              How GullyGig Works
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-[500px] mx-auto">
              Bridging the gap between neighbors. Whether you want to showcase a
              service or find one, we&apos;ve simplified the process.
            </p>
          </motion.div>
        </div>

        {/* Two Columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* For Providers Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{
              y: -8,
              scale: 1.02,
              rotateX: 1.5,
              rotateY: -1.5,
              boxShadow: "0 25px 35px -5px rgba(255, 255, 255, 0.1)",
            }}
            className="bg-white dark:bg-white rounded-[32px] border border-white/10 p-8 flex flex-col justify-between shadow-2xl shadow-blue-950/20 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-bg-light flex items-center justify-center">
                  <Icon
                    name="work"
                    fill
                    className="text-xl text-brand-primary"
                  />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-900">
                  For Providers
                </h3>
              </div>

              <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {PROVIDER_STEPS.map((step) => (
                  <motion.div
                    key={step.n}
                    variants={itemVariants}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-extrabold text-brand-primary border border-brand-primary-light bg-brand-bg-light">
                      {step.n}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-900 mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-[13px] text-slate-600 dark:text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/Auth?mode=register"
                className="inline-block text-center text-sm font-bold text-brand-primary border border-brand-primary-light bg-brand-bg-light rounded-full px-8 py-3.5 hover:bg-brand-bg-hover transition-all active:scale-95 shadow-sm"
              >
                Join as Provider
              </Link>
            </div>
          </motion.div>

          {/* For Customers Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{
              y: -8,
              scale: 1.02,
              rotateX: 1.5,
              rotateY: -1.5,
              boxShadow: "0 25px 35px -5px rgba(255, 255, 255, 0.1)",
            }}
            className="bg-white dark:bg-white rounded-[32px] border border-white/10 p-8 flex flex-col justify-between shadow-2xl shadow-blue-950/20 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-bg-light flex items-center justify-center">
                  <Icon
                    name="person_search"
                    className="text-xl text-brand-primary"
                  />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-900">
                  For Customers
                </h3>
              </div>

              <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {CUSTOMER_STEPS.map((step) => (
                  <motion.div
                    key={step.n}
                    variants={itemVariants}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-extrabold text-brand-primary border border-brand-primary-light bg-brand-bg-light">
                      {step.n}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-900 mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-[13px] text-slate-600 dark:text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/services"
                className="inline-block text-center text-sm font-bold text-white bg-brand-primary rounded-full px-8 py-3.5 hover:opacity-95 transition-all active:scale-95 shadow-md shadow-blue-500/10"
              >
                Find a Service
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
