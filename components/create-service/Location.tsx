"use client";

import React from "react";
import { ServiceFormData } from "@/lib/service.types";

interface LocationProps {
  formData: ServiceFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Location({ formData, onInputChange }: LocationProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-sans">
        Location
      </h2>
      <p className="text-sm text-gray-500 mb-6 font-sans">
        Where do you provide your services?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            City
          </label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>
        <div>
          <label htmlFor="locality" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Area / Locality
          </label>
          <input
            id="locality"
            type="text"
            name="locality"
            value={formData.locality}
            onChange={onInputChange}
            placeholder="Andheri West"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Pincode
          </label>
          <input
            id="pincode"
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={onInputChange}
            placeholder="400058"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>
      </div>
    </div>
  );
}