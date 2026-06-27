"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, User, ChevronDown, ChevronUp } from "lucide-react";
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
  onShowToast: (message: string, type?: "success" | "error") => void;
}

/**
 * Renders profile details and verification options in a sidebar.
 *
 * @param profile - The profile data to display when not editing.
 * @param isEditing - Controls whether the personal information fields are editable.
 * @param formData - The current gender and date of birth form values.
 * @param onInputChange - Handles updates to the editable personal information fields.
 * @param onShowToast - Shows status messages for verification actions.
 */
export default function ProfileSidebar({
  profile,
  isEditing,
  formData,
  onInputChange,
  onShowToast,
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

  // Get min and max date for birth (100 years ago to 18 years ago)
  const getDateLimits = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - 18); // Must be at least 18 years old

    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - 120); // Max 120 years old

    return {
      max: maxDate.toISOString().split("T")[0],
      min: minDate.toISOString().split("T")[0],
    };
  };

  const dateLimits = getDateLimits();

  const verification: VerificationItem[] = [
    {
      label: "Phone Verification",
      verified: false,
      description: "Confirm identity via secure OTP",
    },
    {
      label: "Email Verification",
      verified: false,
      description: "Confirm email address ownership",
    },
    {
      label: "Profile Verification",
      verified: false,
      description: "Verify profile photo and details",
    },
  ];

  const startVerification = (item: VerificationItem) => {
    onShowToast(`${item.label} is coming soon!`, "error");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Additional validation to prevent invalid dates
    if (value) {
      const dateParts = value.split("-");
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        // Reject years with more than 4 digits or invalid range
        if (
          year < 1900 ||
          year > new Date().getFullYear() ||
          dateParts[0].length > 4
        ) {
          onShowToast(
            "Please enter a valid birth year (1900 - current year)",
            "error",
          );
          return;
        }
      }
    }

    onInputChange("dob", value);
  };

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
                  onChange={handleDateChange}
                  min={dateLimits.min}
                  max={dateLimits.max}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                />
                <p className="text-xs text-gray-400 mt-1">
                  You must be at least 18 years old
                </p>
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
          <div className="space-y-2.5">
            {verification.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 py-1"
              >
                <div>
                  <span className="text-gray-700 text-sm font-semibold">
                    {item.label}
                  </span>
                  {showVerificationDetails && item.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => startVerification(item)}
                  className="text-blue-650 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
