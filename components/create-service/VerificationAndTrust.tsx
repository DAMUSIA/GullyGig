"use client";

import React from "react";
import { Phone, Award, CheckCircle, AlertCircle } from "lucide-react";
import { ServiceFormData } from "@/lib/service.types";

interface VerificationAndTrustProps {
  formData: ServiceFormData;
}

export default function VerificationAndTrust({ formData }: VerificationAndTrustProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-sans">
        Verification & Trust
      </h2>
      <p className="text-sm text-gray-500 mb-6 font-sans">
        Complete your verification to build more trust
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Phone Verified
            </span>
          </div>
          {formData.phoneVerified ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertCircle size={20} className="text-amber-500" />
          )}
        </div>
        
        <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center gap-3">
            <svg
              className="w-4.5 h-4.5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Email Verified
            </span>
          </div>
          {formData.emailVerified ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertCircle size={20} className="text-amber-500" />
          )}
        </div>
        
        <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Award size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              ID Verification
            </span>
          </div>
          <div className="flex items-center gap-2">
            {formData.idVerified ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <>
                <AlertCircle size={20} className="text-amber-500" />
                <span className="text-xs font-semibold text-amber-600">
                  Not Verified
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}