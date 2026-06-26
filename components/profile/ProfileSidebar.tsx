"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Shield,
  User,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { UserProfile } from "@/lib/supabase";

interface VerificationItem {
  label: string;
  verified: boolean;
  description?: string;
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
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);

  const calculateAge = (dobString?: string | null) => {
    if (!dobString) return null;
    try {
      const birthDate = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  const age = calculateAge(profile.dob);

  const verification: VerificationItem[] = [
    {
      label: "Phone Verification",
      verified: !!profile.phone_no,
      description: "Identity confirmed via OTP",
    },
    {
      label: "Email Verification",
      verified:
        !!profile.email &&
        !profile.email.endsWith("@gullygig.in") &&
        !profile.email.endsWith("@kaamao.com"),
      description: "Email address confirmed",
    },
  ];

  const startVerification = (item: VerificationItem) => {
    alert(`Starting ${item.label} process...`);
  };

  const verifiedCount = verification.filter((v) => v.verified).length;
  const trustScore = Math.round((verifiedCount / verification.length) * 100);

  return (
    <div className="space-y-4">
      {/* Personal Details Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50/30">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Personal Information
          </h3>
        </div>

        <div className="p-4 sm:p-5">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => onInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => onInputChange("dob", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Gender</span>
                <span className="font-medium text-gray-900 text-sm">
                  {profile.gender || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Birth Date</span>
                <span className="font-medium text-gray-900 text-sm">
                  {profile.dob
                    ? new Date(profile.dob).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })
                    : "Not specified"}
                </span>
              </div>
              {age && (
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-gray-500 text-sm">Age</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {age} years
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Verification Status Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Verification
            </h3>
            <button
              onClick={() =>
                setShowVerificationDetails(!showVerificationDetails)
              }
              className="p-0.5 hover:bg-gray-100 rounded transition-colors"
            >
              {showVerificationDetails ? (
                <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* Trust Score */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Verification Status</span>
              <span className="font-medium text-blue-600">{trustScore}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {verification.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-1"
              >
                <div>
                  <span className="text-gray-700 text-sm">{item.label}</span>
                  {showVerificationDetails && item.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.verified ? (
                  <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <button
                    onClick={() => startVerification(item)}
                    className="text-blue-600 flex items-center gap-1 hover:text-blue-700 text-xs font-medium"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Verify
                  </button>
                )}
              </div>
            ))}
          </div>

          {trustScore === 100 && (
            <div className="mt-4 p-2.5 bg-blue-50 rounded-lg flex items-center gap-2 border border-blue-100">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-xs text-blue-700">
                All verifications complete!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
