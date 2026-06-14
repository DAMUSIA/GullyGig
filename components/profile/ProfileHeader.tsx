"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit, CheckCircle, Phone, Mail, MapPin, Calendar, Save, X, Navigation } from "lucide-react";
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
  // Get initials for avatar placeholder
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format the joined date
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100/50"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="relative p-6 sm:p-10 md:p-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 w-full md:w-auto text-center sm:text-left flex-1">
            <div className="relative flex-shrink-0">
              {/* Profile avatar increased to w-40 h-40 */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-3xl sm:text-5xl font-extrabold text-white">
                  {getInitials(isEditing ? formData.full_name : profile.full_name)}
                </span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-1.5 border-4 border-white shadow-md">
                <CheckCircle className="w-4.5 h-4.5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1 w-full space-y-4">
              {isEditing ? (
                <div className="space-y-4 w-full">
                  <div>
                    <label className="block text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => onInputChange("full_name", e.target.value)}
                      className="w-full max-w-xl px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold text-gray-900"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div>
                      <label className="block text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone_no}
                        onChange={(e) => onInputChange("phone_no", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold text-gray-900"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold text-gray-900"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="max-w-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-wider">
                        Location
                      </label>
                      <button
                        type="button"
                        onClick={onGPSLocation}
                        disabled={isLocating}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer border-0 bg-transparent disabled:opacity-50"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        {isLocating ? "Locating..." : "Detect via GPS"}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => onInputChange("location", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold text-gray-900"
                      placeholder="e.g. Andheri West, Mumbai"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 break-words flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                    {profile.full_name}
                    {profile.gender && (
                      <span className="text-xs sm:text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-normal self-center">
                        {profile.gender}
                      </span>
                    )}
                  </h2>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5 mt-2.5">
                    <span className="px-3.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                      ⭐ Verified Provider
                    </span>
                    <span className="px-3.5 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                      🏆 Top Rated
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-3 mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 font-medium">
                    {profile.phone_no && (
                      <span className="flex items-center gap-2 justify-center sm:justify-start">
                        <Phone className="w-4.5 h-4.5 text-green-500" />
                        {profile.phone_no}
                      </span>
                    )}
                    {profile.email && (
                      <span className="flex items-center gap-2 justify-center sm:justify-start break-all">
                        <Mail className="w-4.5 h-4.5 text-blue-500" />
                        {profile.email}
                      </span>
                    )}
                    {profile.location && (
                      <span className="flex items-center gap-2 justify-center sm:justify-start">
                        <MapPin className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                        {profile.location}
                      </span>
                    )}
                    <span className="flex items-center gap-2 justify-center sm:justify-start whitespace-nowrap">
                      <Calendar className="w-4.5 h-4.5 text-purple-500" />
                      {formatJoinedDate(profile.created_at)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gray-100 text-gray-700 text-sm sm:text-base font-semibold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
                >
                  <X className="w-4.5 h-4.5" />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-0 shadow-md shadow-blue-500/10 disabled:opacity-50"
                >
                  <Save className="w-4.5 h-4.5" />
                  <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onEdit}
                className="w-full px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-bold whitespace-nowrap shadow-lg shadow-blue-500/15 cursor-pointer border-0"
              >
                <Edit className="w-4.5 h-4.5" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
