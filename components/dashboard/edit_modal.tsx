"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  Loader2,
  Trash2,
  Layers,
  MapPin,
  Globe,
  Calendar,
  Phone,
  DollarSign,
  Plus,
  Sparkles,
} from "lucide-react";

export interface ServiceItem {
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

export interface EditServiceData {
  title: string;
  category: string;
  description: string;
  price: number | null;
  priceUnit: string;
  city: string;
  area: string;
  serviceModes: string[];
  languages: string[];
  availability: string[];
  isActive: boolean;
  contactNumbers: string[];
}

interface EditServiceModalProps {
  service: ServiceItem;
  onClose: () => void;
  onSave: (data: EditServiceData) => void;
  onDelete: (serviceId: string) => void;
  isSaving: boolean;
}

const COMMON_CATEGORIES = [
  "Academic Tuition",
  "Music & Instruments",
  "Fitness & Gym",
  "Yoga & Meditation",
  "Dance & Performing Arts",
  "Cooking & Culinary",
  "Tailoring & Crafts",
  "Tech & Coding",
  "Art & Design",
  "Language Classes",
  "Home Services",
  "Other",
];

const AVAILABLE_MODES = [
  "At My Place",
  "At Customer's Place",
  "Online",
];

const POPULAR_LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
];

const COMMON_AVAILABILITY = [
  "Weekdays",
  "Weekends",
  "Morning",
  "Afternoon",
  "Evening",
  "Flexible",
];

export function EditServiceModal({
  service,
  onClose,
  onSave,
  onDelete,
  isSaving,
}: EditServiceModalProps) {
  const [title, setTitle] = useState(service.title || "");
  const [category, setCategory] = useState(service.category || "Academic Tuition");
  const [description, setDescription] = useState(service.description || "");
  const [price, setPrice] = useState<number | null>(service.starting_price);
  const [priceUnit, setPriceUnit] = useState(service.price_unit || "Per Hour");
  const [city, setCity] = useState(service.city || "");
  const [area, setArea] = useState(service.area || "");
  const [serviceModes, setServiceModes] = useState<string[]>(
    service.service_modes && service.service_modes.length > 0
      ? service.service_modes
      : ["At My Place"],
  );
  const [languages, setLanguages] = useState<string[]>(
    service.languages && service.languages.length > 0
      ? service.languages
      : ["English"],
  );
  const [customLanguage, setCustomLanguage] = useState("");
  const [availability, setAvailability] = useState<string[]>(
    service.availability && service.availability.length > 0
      ? service.availability
      : ["Flexible"],
  );
  const [isActive, setIsActive] = useState(service.is_active);
  const [contactNumbers, setContactNumbers] = useState<string[]>(
    service.contact_numbers && service.contact_numbers.length > 0
      ? service.contact_numbers
      : [""],
  );
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Clean phone number to only digits
  const cleanPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const handleContactChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const limitedDigits = digitsOnly.slice(0, 10);
    const updated = [...contactNumbers];
    updated[index] = limitedDigits;
    setContactNumbers(updated);
  };

  const toggleMode = (mode: string) => {
    if (serviceModes.includes(mode)) {
      if (serviceModes.length > 1) {
        setServiceModes(serviceModes.filter((m) => m !== mode));
      }
    } else {
      setServiceModes([...serviceModes, mode]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleAddCustomLanguage = () => {
    const trimmed = customLanguage.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed]);
      setCustomLanguage("");
    }
  };

  const toggleAvailability = (item: string) => {
    if (availability.includes(item)) {
      if (availability.length > 1) {
        setAvailability(availability.filter((a) => a !== item));
      }
    } else {
      setAvailability([...availability, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      alert("Service title must be at least 3 characters.");
      return;
    }

    if (description.trim().length < 20) {
      alert("Description must be at least 20 characters.");
      return;
    }

    if (!city.trim()) {
      alert("Please enter a valid city for your service location.");
      return;
    }

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
      alert("At least one valid 10-digit contact number is required.");
      return;
    }

    onSave({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      price,
      priceUnit: priceUnit.trim() || "Per Hour",
      city: city.trim(),
      area: area.trim(),
      serviceModes,
      languages,
      availability,
      isActive,
      contactNumbers: cleanContacts,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
      />

      <div className="relative w-full max-w-[640px] bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
                  Service Management
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Edit Service Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update all information for your public listing and portfolio
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Section 1: Basic Information */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                Basic Information
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mathematics & Science Tutor for Class 8-12"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Primary Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all cursor-pointer"
                >
                  {COMMON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Description & Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your qualifications, teaching methodology, experience, and what makes your service standout..."
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none transition-all"
                />
              </div>
            </div>

            {/* Section 2: Location & Service Modes */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                Location & Service Modes
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Pune, Delhi"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Locality / Area
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Andheri West, Kothrud"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  How do you offer your service?
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_MODES.map((mode) => {
                    const isSelected = serviceModes.includes(mode);
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => toggleMode(mode)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Pricing */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-blue-600" />
                Pricing
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Starting Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price !== null && price !== undefined ? price : ""}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 500 (Leave blank for custom)"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Pricing Model / Unit
                  </label>
                  <input
                    type="text"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    placeholder="e.g. Per Hour, Per Month, Flexible"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Languages & Availability */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-600" />
                Languages & Schedule
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {POPULAR_LANGUAGES.map((lang) => {
                    const isSelected = languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : ""}
                        {lang}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="Add other language..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLanguage}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Availability Schedule
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_AVAILABILITY.map((avail) => {
                    const isSelected = availability.includes(avail);
                    return (
                      <button
                        key={avail}
                        type="button"
                        onClick={() => toggleAvailability(avail)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {avail}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 5: Contact Numbers */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                Direct Contact Numbers
                <span className="text-red-500">*</span>
              </span>

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
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-500" />
                          </span>
                        )}
                        {isComplete && !isValid && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-[10px] font-bold">
                            Need 10 digits
                          </span>
                        )}
                      </div>
                      {contactNumbers.length > 1 && (
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
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setContactNumbers([...contactNumbers, ""])}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Another Phone Number
                </button>
              </div>
            </div>

            {/* Section 6: Listing Status */}
            <div className="flex items-center justify-between bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Active Listing Status
                </span>
                <span className="text-xs text-slate-500">
                  {isActive
                    ? "Your service is live and discoverable on public directory"
                    : "Listing is paused and hidden from public search"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Danger Zone */}
            <div className="mt-4 pt-4 border-t border-red-100 bg-red-50/30 rounded-2xl p-4 border border-dashed border-red-200">
              <span className="text-xs font-bold text-red-700 uppercase block mb-1">
                Danger Zone
              </span>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed font-medium">
                Deleting this service is permanent and cannot be undone. All reviews, likes, and performance analytics will be permanently removed.
              </p>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 border border-red-200/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete This Service</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Updates...
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

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-[400px] bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-850">
                  Delete Service Listing?
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Are you sure you want to permanently delete{" "}
                  <strong>{service.title}</strong>? This will delete all student reviews, user likes, page views, and performance analytics. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
                >
                  Keep Service
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmDelete(false);
                    onDelete(service.id);
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  Yes, Delete Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

