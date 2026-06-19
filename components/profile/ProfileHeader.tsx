"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Edit,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  X,
  Navigation,
  Award,
  Star,
  Shield,
} from "lucide-react";
import { UserProfile } from "@/lib/supabase";

interface ProfileHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  isSaving: boolean;
  formData: {
    full_name: string;
    email: string;
    phone_no: string;
    location: string;
  };
  isLocating: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onInputChange: (name: string, value: string) => void;
  onGPSLocation: () => void;
}

export default function ProfileHeader({
  profile,
  isEditing,
  isSaving,
  formData,
  isLocating,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onGPSLocation,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatJoinedDate = (dateStr?: string) => {
    if (!dateStr) return "Joined recently";
    try {
      const date = new Date(dateStr);
      return `Joined ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    } catch {
      return "Joined recently";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-50 rounded-full blur-3xl" />

      <div className="relative p-4 sm:p-6 md:p-8">
        {/* Mobile: Stack vertically, Desktop: Row layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          {/* Left Section - Avatar & Info */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6 w-full">
            {/* Avatar - Centered on mobile */}
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {getInitials(
                    isEditing ? formData.full_name : profile.full_name,
                  )}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 sm:border-4 border-white shadow">
                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </div>
            </div>

            {/* Info Section - Full width on mobile */}
            <div className="text-center sm:text-left flex-1 min-w-0 w-full">
              {isEditing ? (
                <div className="space-y-3 sm:space-y-4 w-full">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        onInputChange("full_name", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-900"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone_no}
                        onChange={(e) =>
                          onInputChange("phone_no", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-900"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-900"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-gray-500">
                        Location
                      </label>
                      <button
                        type="button"
                        onClick={onGPSLocation}
                        disabled={isLocating}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {isLocating ? "Locating..." : "Use GPS"}
                        </span>
                        <span className="sm:hidden">
                          {isLocating ? "..." : "GPS"}
                        </span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        onInputChange("location", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-900"
                      placeholder="e.g., Andheri West, Mumbai"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
                    {profile.full_name}
                  </h2>

                  {/* Badges - Wrap on mobile */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start mb-3">
                    <span className="px-2 py-0.5 sm:px-2.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Top Rated
                    </span>
                    <span className="px-2 py-0.5 sm:px-2.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Verified
                    </span>
                    <span className="px-2 py-0.5 sm:px-2.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Trusted
                    </span>
                  </div>

                  {/* Contact Info - Stack on mobile, row on desktop */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    {profile.phone_no && (
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-0 py-1 sm:py-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {profile.phone_no}
                        </span>
                      </span>
                    )}
                    {profile.email && (
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-0 py-1 sm:py-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {profile.email}
                        </span>
                      </span>
                    )}
                    {profile.location && (
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-0 py-1 sm:py-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {profile.location}
                        </span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-0 py-1 sm:py-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      <span className="whitespace-nowrap">
                        {formatJoinedDate(profile.created_at)}
                      </span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons - Full width on mobile */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {isEditing ? (
              <>
                <button
                  onClick={onCancel}
                  disabled={isSaving}
                  className="flex-1 px-4 sm:px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Cancel</span>
                </button>
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="flex-1 px-4 sm:px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    {isSaving ? "Saving..." : "Save"}
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={onEdit}
                className="w-full px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
              >
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
