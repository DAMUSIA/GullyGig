"use client";

import React from "react";
import { ServiceFormData } from "@/lib/service.types";

interface AdditionalDetailsProps {
  formData: ServiceFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function AdditionalDetails({ formData, onInputChange }: AdditionalDetailsProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-sans">
        Additional Details (Optional)
      </h2>
      <p className="text-sm text-gray-500 mb-6 font-sans">
        Add more information to build trust
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="languages" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Languages Known
          </label>
          <input
            id="languages"
            type="text"
            name="languages"
            value={formData.languages}
            onChange={onInputChange}
            placeholder="English, Hindi, Marathi..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>

        <div>
          <label htmlFor="qualifications" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Qualifications / Certifications
          </label>
          <input
            id="qualifications"
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={onInputChange}
            placeholder="B.Sc. Mathematics, B.Ed."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>

        <div>
          <label htmlFor="shortBio" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Short Bio
          </label>
          <textarea
            id="shortBio"
            name="shortBio"
            value={formData.shortBio}
            onChange={onInputChange}
            placeholder="I am passionate about teaching and helping students achieve their academic goals."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200 font-sans bg-white"
          />
        </div>
      </div>
    </div>
  );
}