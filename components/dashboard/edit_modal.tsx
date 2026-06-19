"use client";

import React, { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";

interface ServiceItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  service_modes: string[];
  availability: string[];
  languages: string[];
  starting_price: number | null;
  price_unit: string | null;
  views_count: number;
  likes_count: number;
  reviews_count: number;
  rating_average: number;
  is_active: boolean;
  created_at: string;
  contact_numbers?: string[];
}

interface EditServiceModalProps {
  service: ServiceItem;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    price: number | null;
    priceUnit: string;
    isActive: boolean;
    contactNumbers: string[];
  }) => void;
  isSaving: boolean;
}

export function EditServiceModal({
  service,
  onClose,
  onSave,
  isSaving,
}: EditServiceModalProps) {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState<number | null>(service.starting_price);
  const [priceUnit, setPriceUnit] = useState(service.price_unit || "Per Hour");
  const [isActive, setIsActive] = useState(service.is_active);
  const [contactNumbers, setContactNumbers] = useState<string[]>(
    service.contact_numbers || [],
  );

  // Validate phone number - exactly 10 digits, numbers only
  const validatePhoneNumber = (value: string): boolean => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.length === 10;
  };

  // Clean phone number to only digits
  const cleanPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const handleContactChange = (index: number, value: string) => {
    // Only allow numbers
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);

    const updated = [...contactNumbers];
    updated[index] = limitedDigits;
    setContactNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean all contact numbers
    const cleanContacts = contactNumbers
      .map((n) => cleanPhoneNumber(n))
      .filter(Boolean);

    // Validate each contact number
    const invalidNumbers = cleanContacts.filter((num) => num.length !== 10);
    if (invalidNumbers.length > 0) {
      alert(
        `Invalid phone number(s): ${invalidNumbers.join(", ")}. Please enter exactly 10 digits.`,
      );
      return;
    }

    if (cleanContacts.length === 0) {
      alert("At least one valid contact number is required.");
      return;
    }

    onSave({
      title,
      description,
      price,
      priceUnit,
      isActive,
      contactNumbers: cleanContacts,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer"
      />

      <div className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">
                Edit Service
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your listing details
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0 cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Unit
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  disabled={price === null}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 disabled:opacity-50 cursor-pointer transition-all"
                >
                  <option value="Per Hour">Per Hour</option>
                  <option value="Per Session">Per Session</option>
                  <option value="Per Day">Per Day</option>
                  <option value="Per Month">Per Month</option>
                </select>
              </div>
            </div>

            {/* Contact Numbers Section */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Contact Numbers
                <span className="text-red-500 ml-1">*</span>
                <span className="text-[10px] font-normal text-slate-400 ml-2">
                  (Enter exactly 10 digits)
                </span>
              </label>
              <div className="space-y-2">
                {contactNumbers.map((num, idx) => {
                  const isValid = num.length === 10;
                  const isComplete = num.length > 0;

                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          required
                          value={num}
                          onChange={(e) =>
                            handleContactChange(idx, e.target.value)
                          }
                          placeholder="Enter 10-digit phone number"
                          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all ${
                            isComplete && !isValid
                              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                              : isValid
                                ? "border-green-400 focus:border-green-500 focus:ring-green-500/20"
                                : "border-slate-200"
                          }`}
                        />
                        {isComplete && isValid && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs font-bold">
                            ✓
                          </span>
                        )}
                        {isComplete && !isValid && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-[10px] font-bold">
                            Need 10 digits
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = contactNumbers.filter(
                            (_, i) => i !== idx,
                          );
                          setContactNumbers(updated);
                        }}
                        className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setContactNumbers([...contactNumbers, ""])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  + Add Contact Number
                </button>
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter up to 10 digits (numbers only). Example: 9876543210
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div>
                <span className="text-sm font-bold text-slate-700 block">
                  Active Status
                </span>
                <span className="text-[10px] text-slate-400">
                  Service discoverable on marketplace
                </span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
