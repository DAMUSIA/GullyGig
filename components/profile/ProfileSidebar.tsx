"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Shield, User } from "lucide-react";
import { UserProfile } from "@/lib/supabase";

interface VerificationItem {
  label: string;
  verified: boolean;
}

interface ProfileSidebarProps {
  profile: UserProfile;
  isEditing: boolean;
  formData: {
    gender: string;
    dob: string;
  };
  onInputChange: (name: string, value: string) => void;
}

export default function ProfileSidebar({
  profile,
  isEditing,
  formData,
  onInputChange,
}: ProfileSidebarProps) {
  // Verification state (Phone is verified if user has phone_no, Email is verified if user has email)
  const verification: VerificationItem[] = [
    { label: "Phone Verified", verified: !!profile.phone_no },
    { label: "Email Verified", verified: !!profile.email && !profile.email.endsWith("@kaamao.com") },
    { label: "ID Verification", verified: false },
    { label: "Background Check", verified: false },
  ];

  const startVerification = (item: VerificationItem) => {
    alert(`Starting ${item.label} verification process...`);
  };

  return (
    <div className="space-y-6">
      {/* Personal Details Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100/50"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
          <User className="w-6 h-6 text-blue-600" />
          Personal Details
        </h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => onInputChange("gender", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold text-gray-900 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => onInputChange("dob", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold text-gray-900"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm sm:text-base text-gray-700">
            <div className="flex justify-between items-center border-b border-gray-50 pb-2.5">
              <span className="text-gray-500 font-extrabold uppercase tracking-wider text-[11px] sm:text-xs">Gender</span>
              <span className="font-extrabold text-gray-900">{profile.gender || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5">
              <span className="text-gray-500 font-extrabold uppercase tracking-wider text-[11px] sm:text-xs">Birth Date</span>
              <span className="font-extrabold text-gray-900">
                {profile.dob ? new Date(profile.dob).toLocaleDateString(undefined, { dateStyle: "medium" }) : "Not specified"}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100/50"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
          <Shield className="w-6 h-6 text-blue-600" />
          Verification Status
        </h3>
        <div className="space-y-4">
          {verification.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm sm:text-base"
            >
              <span className="text-gray-700 font-bold">{item.label}</span>
              {item.verified ? (
                <span className="text-green-650 flex items-center gap-1.5 font-bold whitespace-nowrap">
                  <CheckCircle className="w-5 h-5 text-green-600" /> Verified
                </span>
              ) : (
                <button
                  onClick={() => startVerification(item)}
                  className="text-orange-500 flex items-center gap-1.5 hover:text-orange-600 transition font-bold whitespace-nowrap cursor-pointer border-0 bg-transparent"
                >
                  <XCircle className="w-5 h-5" /> Verify
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
