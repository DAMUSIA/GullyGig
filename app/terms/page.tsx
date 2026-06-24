"use client";

import Link from "next/link";
import { FileText, Shield, ArrowRight } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Legal &amp; Privacy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Learn about our policies and how we protect your rights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Terms of Service Card */}
          <Link
            href="/terms/terms_service"
            className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-slate-200 dark:border-slate-700 hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Terms of Service
                  </h2>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Read our terms and conditions for using the Kaamao platform
                </p>
              </div>
            </div>
          </Link>

          {/* Privacy Policy Card */}
          <Link
            href="/terms/privacy_policy"
            className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-slate-200 dark:border-slate-700 hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Privacy Policy
                  </h2>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Learn how we collect, use, and protect your personal
                  information
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Contact Section */}
        <div className="mt-12 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Have Questions?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            If you have any questions about our terms or privacy practices,
            please don&apos;t hesitate to contact us.
          </p>
          <Link
            href="mailto:support@kaamao.com"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-dark font-semibold hover:underline transition-colors"
          >
            support@kaamao.com
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
