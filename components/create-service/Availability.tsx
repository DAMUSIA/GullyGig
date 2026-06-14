"use client";

import React from "react";
import { ServiceFormData } from "@/lib/service.types";

interface AvailabilityProps {
  formData: ServiceFormData;
  WEEKDAYS: string[];
  onDayToggle: (day: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Availability({ formData, WEEKDAYS, onDayToggle, onInputChange }: AvailabilityProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-sans">
        Availability
      </h2>
      <p className="text-sm text-gray-500 mb-6 font-sans">
        When are you available?
      </p>

      <div className="mb-6">
        <fieldset>
          <legend className="block text-sm font-semibold text-gray-700 mb-3 font-sans">
            Select Days
          </legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => onDayToggle(day)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  formData.selectedDays.includes(day)
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={formData.selectedDays.includes(day) ? "true" : "false"}
              >
                {day}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="fromTime" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            From
          </label>
          <input
            id="fromTime"
            type="time"
            name="fromTime"
            value={formData.fromTime}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>
        <div>
          <label htmlFor="toTime" className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
            To
          </label>
          <input
            id="toTime"
            type="time"
            name="toTime"
            value={formData.toTime}
            onChange={onInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-sans bg-white"
          />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3 font-sans">
        Available Time: {formData.fromTime} to {formData.toTime}
      </p>
    </div>
  );
}