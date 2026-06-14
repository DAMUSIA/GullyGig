"use client";

import React from "react";
import { ServiceFormData } from "@/lib/service.types";

interface Category {
  value: string;
  label: string;
  subCategories: string[];
}

interface ServiceInformationProps {
  formData: ServiceFormData;
  CATEGORIES: Category[];
  EXPERIENCE_OPTIONS: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function ServiceInformation({ 
  formData, 
  CATEGORIES, 
  EXPERIENCE_OPTIONS, 
  onInputChange 
}: ServiceInformationProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-sans">
        Service Information
      </h2>
      <p className="text-sm text-gray-500 mb-6 font-sans">
        Tell customers what service you provide
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Service Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subCategory" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Sub-category
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          >
            <option value="">Select a sub-category</option>
            {CATEGORIES.find((c) => c.value === formData.category)?.subCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="I provide home and online tuition for Mathematics and Science for classes 6 to 10. Personalized learning and concept clarity is my priority."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200 font-sans bg-white"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Experience
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          >
            <option value="">Select experience</option>
            {EXPERIENCE_OPTIONS.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}