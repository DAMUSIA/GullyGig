"use client";

import React from "react";

interface PricingFormData {
  priceType: string;
  price: string;
}

interface PriceType {
  value: string;
  label: string;
  placeholder?: string;
}

interface PricingProps {
  formData: PricingFormData;
  PRICE_TYPES: PriceType[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function Pricing({ formData, PRICE_TYPES, onInputChange }: PricingProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-sans">
        Pricing
      </h2>
      <p className="text-sm text-gray-500 mb-6 font-sans">
        Set your pricing details
      </p>

      <div className="bg-gradient-to-r from-blue-600/5 to-blue-800/5 rounded-xl p-4 mb-6 border border-blue-600/10">
        <p className="text-sm text-blue-600 font-sans">
          💡 Pricing Tips: Research similar services in your area to set a competitive price.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="priceType" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Price Type
          </label>
          <select
            id="priceType"
            name="priceType"
            value={formData.priceType}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          >
            {PRICE_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            Price Amount
          </label>
          <input
            id="price"
            type="text"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            placeholder={PRICE_TYPES.find((pt) => pt.value === formData.priceType)?.placeholder}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>
      </div>
    </div>
  );
}