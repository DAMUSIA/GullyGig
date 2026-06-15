"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Quote } from "lucide-react";
import { UserProfile } from "@/lib/supabase";

interface ProfileDetailsProps {
  profile: UserProfile;
  isEditing: boolean;
  formData: {
    about: string;
  };
  onInputChange: (name: string, value: string) => void;
}

export default function ProfileDetails({
  profile,
  isEditing,
  formData,
  onInputChange,
}: ProfileDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/30">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          About Me
        </h3>
      </div>

      <div className="p-4 sm:p-6">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={formData.about}
              onChange={(e) => onInputChange("about", e.target.value)}
              rows={6}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-900 resize-none text-sm"
              placeholder="Share your teaching experience, qualifications, teaching style..."
            />
            <p className="text-xs text-gray-400 text-right">
              {formData.about?.length || 0}/500 characters
            </p>
          </div>
        ) : (
          <div className="relative">
            <Quote className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 text-blue-100" />
            <p className="text-gray-600 leading-relaxed pl-5 text-sm sm:text-base">
              {profile.about ||
                "Passionate educator dedicated to making learning enjoyable and effective. Specializing in making complex concepts simple through real-world examples."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
