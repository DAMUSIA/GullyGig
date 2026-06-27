"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";

import { getCurrentUser, supabase } from "@/lib/supabase";
import { TutorServiceFormData } from "@/lib/service.types";

import SearchableDropdown from "@/components/create-service/SearchableDropdown";
import LocationSelector from "@/components/create-service/LocationSelector";
import LanguageSelector from "@/components/create-service/LanguageSelector";
import LivePreviewCard from "@/components/create-service/LivePreviewCard";
import PublishStickyBar from "@/components/create-service/PublishStickyBar";

// Constants
const CATEGORIES = [
  "Academic Tutor",
  "Mathematics Tutor",
  "Science Tutor",
  "English Tutor",
  "Coding Teacher",
  "Language Teacher",
  "Dance Teacher",
  "Music Teacher",
  "Guitar Teacher",
  "Singing Teacher",
  "Piano Teacher",
  "Yoga Trainer",
  "Fitness Trainer",
  "Personal Trainer",
  "Art Teacher",
  "Drawing Teacher",
  "Tailor",
  "Other",
];

const TEACHING_MODES = ["At My Place", "At Customer's Place", "Online"];
const AVAILABILITY_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Morning",
  "Afternoon",
  "Evening",
  "Flexible",
];
const PRICE_UNITS = ["Per Hour", "Per Session", "Per Day", "Per Month"];

const CATEGORY_TITLE_MAPPING: Record<string, string> = {
  "Academic Tutor": "Academic Tutor",
  "Mathematics Tutor": "Mathematics Tutor",
  "Science Tutor": "Science Tutor",
  "English Tutor": "English Tutor",
  "Coding Teacher": "Coding Teacher",
  "Language Teacher": "Language Teacher",
  "Dance Teacher": "Dance Instructor",
  "Music Teacher": "Music Teacher",
  "Guitar Teacher": "Guitar Teacher",
  "Singing Teacher": "Vocal Coach",
  "Piano Teacher": "Piano Teacher",
  "Yoga Trainer": "Yoga Trainer",
  "Fitness Trainer": "Fitness Trainer",
  "Personal Trainer": "Personal Trainer",
  "Art Teacher": "Art Teacher",
  "Drawing Teacher": "Drawing Teacher",
  "Exam Preparation Coach": "Exam Prep Coach",
};

interface ServiceUser {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    phone_no?: string;
  };
}

/**
 * Renders the service creation page with authentication, a multi-step setup flow, and publishing to Supabase.
 */
export default function CreateServicePage() {
  const router = useRouter();

  // App state
  const [user, setUser] = useState<ServiceUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<TutorServiceFormData>({
    title: "",
    category: "",
    customCategory: "",
    description: "",
    service_modes: [],
    city: "",
    area: "",
    latitude: null,
    longitude: null,
    availability: [],
    languages: ["English"],
    starting_price: null,
    price_unit: "Per Hour",
    contact_numbers: [],
  });

  // Track if user has edited the title manually
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Authentication Check
  useEffect(() => {
    async function checkUser() {
      try {
        const result = await getCurrentUser();
        if (!result.user) {
          router.push("/Auth");
          return;
        }
        const currentUser = result.user as ServiceUser;
        setUser(currentUser);

        // Pre-fill contact numbers with user phone number if available
        const userPhone = currentUser.user_metadata?.phone_no;
        if (userPhone) {
          setFormData((prev) => ({
            ...prev,
            contact_numbers: [userPhone],
          }));
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/Auth");
      } finally {
        setAuthLoading(false);
      }
    }
    checkUser();
  }, [router]);

  // Phone number validation helpers
  const cleanPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const handleContactChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const limitedDigits = digitsOnly.slice(0, 10);

    const updated = [...(formData.contact_numbers || [])];
    updated[index] = limitedDigits;
    setFormData((prev) => ({ ...prev, contact_numbers: updated }));
  };

  // Handle Category selection
  const handleCategoryChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, category: val };

      if (!isTitleManuallyEdited) {
        const suggestion = CATEGORY_TITLE_MAPPING[val];
        if (suggestion) {
          updated.title = suggestion;
        } else if (val === "Other") {
          updated.title = "";
        }
      }
      return updated;
    });
  };

  // Handle Title input change - Limited to 80 characters
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Limit to 80 characters
    if (val.length <= 80) {
      setIsTitleManuallyEdited(true);
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  // Toggle multi-select mode chips
  const handleToggleMode = (mode: string) => {
    setFormData((prev) => {
      const current = prev.service_modes;
      const service_modes = current.includes(mode)
        ? current.filter((m) => m !== mode)
        : [...current, mode];
      return { ...prev, service_modes };
    });
  };

  // Toggle availability options
  const handleToggleAvailability = (option: string) => {
    setFormData((prev) => {
      const current = prev.availability;
      const availability = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, availability };
    });
  };

  // Handle location update
  const handleLocationChange = (fields: {
    city: string;
    area: string;
    latitude: number | null;
    longitude: number | null;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // ============================================
  // VALIDATION - Only essential fields required
  // ============================================
  const isFormValid = () => {
    // ESSENTIAL: Title is required (min 3 chars, max 80 chars)
    const titleLength = formData.title.trim().length;
    if (titleLength < 3 || titleLength > 80) return false;

    // ESSENTIAL: Category is required
    if (formData.category === "") return false;
    if (
      formData.category === "Other" &&
      (formData.customCategory || "").trim() === ""
    )
      return false;

    // ESSENTIAL: At least one contact number with 10 digits
    const cleanContacts = (formData.contact_numbers || [])
      .map((n) => cleanPhoneNumber(n))
      .filter(Boolean);

    if (cleanContacts.length === 0) return false;
    const allValid = cleanContacts.every((num) => num.length === 10);
    if (!allValid) return false;

    // OPTIONAL: Everything else is optional
    return true;
  };

  // Handle publishing service
  const handlePublish = async () => {
    if (!isFormValid() || !user) return;

    setIsSubmitting(true);
    setDbError(null);

    // Clean contact numbers
    const cleanContacts = (formData.contact_numbers || [])
      .map((n) => cleanPhoneNumber(n))
      .filter(Boolean);

    // Compute category
    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory?.trim() || "Other"
        : formData.category;

    // Parse starting price
    const finalPrice =
      formData.starting_price !== null && formData.starting_price !== undefined
        ? parseInt(formData.starting_price.toString(), 10)
        : null;

    const insertData = {
      user_id: user.id,
      title: formData.title.trim(),
      category: finalCategory,
      description: formData.description.trim() || "", // DB constraint requires NOT NULL
      service_modes:
        formData.service_modes.length > 0 ? formData.service_modes : [], // DB constraint requires NOT NULL
      city: formData.city.trim() || "", // DB constraint requires NOT NULL
      area: formData.area.trim() || null, // Optional
      latitude: formData.latitude, // Optional
      longitude: formData.longitude, // Optional
      availability:
        formData.availability.length > 0 ? formData.availability : [], // DB constraint requires NOT NULL
      languages:
        formData.languages.length > 0 ? formData.languages : ["English"], // Optional
      starting_price: finalPrice, // Optional
      price_unit: finalPrice ? formData.price_unit : null, // Optional
      is_active: true,
      views_count: 0,
      contact_numbers: cleanContacts,
    };

    try {
      if (!supabase) {
        throw new Error(
          "Supabase service is not configured on your environment",
        );
      }

      const { data: serviceData, error } = await supabase
        .from("services")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Database error details:", error);
        throw new Error(error.message);
      }

      if (serviceData) {
        const { error: analyticsError } = await supabase
          .from("service_analytics")
          .insert([
            {
              service_id: serviceData.id,
              total_views: 0,
              unique_visitors: 0,
              total_likes: 0,
              total_contacts: 0,
              total_reviews: 0,
              average_rating: 0,
            },
          ]);

        if (analyticsError) {
          console.warn(
            "Could not pre-populate analytics record:",
            analyticsError,
          );
        }
      }

      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error("Failed to publish service:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setDbError(errMsg || "Failed to publish service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Use full page navigation so the dashboard remounts and refetches
    // all services from Supabase (router.push alone reuses the cached page)
    window.location.href = "/dashboard";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">
            Checking credentials...
          </p>
        </div>
      </div>
    );
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "What service do you provide?";
      case 2:
        return "Service Title";
      case 3:
        return "How do you provide service?";
      case 4:
        return "Location Details";
      case 5:
        return "Availability";
      case 6:
        return "Languages Known";
      case 7:
        return "Pricing Details";
      case 8:
        return "Contact Numbers";
      case 9:
        return "About Yourself (Description)";
      default:
        return "";
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.category) return false;
        if (
          formData.category === "Other" &&
          !(formData.customCategory || "").trim()
        )
          return false;
        return true;
      case 2: {
        const titleLength = formData.title.trim().length;
        return titleLength >= 3 && titleLength <= 80;
      }
      case 8: {
        const contacts = formData.contact_numbers || [];
        if (contacts.length === 0) return false;
        // All non-empty contacts must be exactly 10 digits
        return (
          contacts.every((n) => {
            const clean = n.replace(/\D/g, "");
            return clean.length === 0 || clean.length === 10;
          }) && contacts.some((n) => n.replace(/\D/g, "").length === 10)
        );
      }
      default:
        return true;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <SearchableDropdown
              label="Service Category"
              required
              options={CATEGORIES}
              value={formData.category}
              onChange={handleCategoryChange}
              customValue={formData.customCategory}
              onCustomChange={(val) =>
                setFormData((prev) => ({ ...prev, customCategory: val }))
              }
              placeholder="Choose a category (e.g. Science Tutor, Piano Teacher)"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <label
                  htmlFor="service-title"
                  className="font-semibold text-slate-700"
                >
                  Service Title <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-[10px] font-semibold ${
                    formData.title.trim().length >= 3 &&
                    formData.title.trim().length <= 80
                      ? "text-slate-400"
                      : "text-amber-500"
                  }`}
                >
                  {formData.title.trim().length} / 80
                </span>
              </div>
              <input
                id="service-title"
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Private Mathematics Tutor"
                maxLength={80}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
              />
              <p className="text-[10px] text-slate-400">
                Minimum 3 characters, maximum 80 characters. Suggestive based on
                category.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Where do you provide service?{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {TEACHING_MODES.map((mode) => {
                  const isSelected = formData.service_modes.includes(mode);
                  return (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => handleToggleMode(mode)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all active:scale-95 cursor-pointer shadow-xs ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-55/40"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white" />
                      )}
                      <span>{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <LocationSelector
              city={formData.city}
              area={formData.area}
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={handleLocationChange}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                When are you usually available?{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {AVAILABILITY_OPTIONS.map((option) => {
                  const isSelected = formData.availability.includes(option);
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleToggleAvailability(option)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all active:scale-95 cursor-pointer shadow-xs ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-55/40"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white" />
                      )}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <LanguageSelector
              selectedLanguages={formData.languages}
              onChange={(languages) =>
                setFormData((prev) => ({ ...prev, languages }))
              }
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="starting-price"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Starting Price{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="starting-price"
                    type="number"
                    min="0"
                    max="9999"
                    value={formData.starting_price || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Limit to 4 digits
                      if (val.length <= 4) {
                        setFormData((prev) => ({
                          ...prev,
                          starting_price: val === "" ? null : Number(val),
                        }));
                      }
                    }}
                    placeholder="e.g. 500"
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                  <div className="absolute left-3.5 top-3.5 flex items-center justify-center">
                    <span className="text-sm font-extrabold text-slate-400">
                      ₹
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Maximum 4 digits (e.g., 500, 1500, 9999)
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Price Unit{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PRICE_UNITS.map((unit) => {
                    const isSelected = formData.price_unit === unit;
                    const isDisabled = formData.starting_price === null;
                    return (
                      <button
                        type="button"
                        key={unit}
                        onClick={() => {
                          if (!isDisabled) {
                            setFormData((prev) => ({
                              ...prev,
                              price_unit: unit,
                            }));
                          }
                        }}
                        disabled={isDisabled}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all active:scale-95 cursor-pointer shadow-xs ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-55/40"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed hover:bg-white hover:border-slate-200" : ""}`}
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-white" />
                        )}
                        <span>{unit}</span>
                      </button>
                    );
                  })}
                </div>
                {formData.starting_price === null && (
                  <p className="text-[10px] text-amber-500 mt-1">
                    Set a starting price first to select a price unit
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Contact numbers for Customers to reach you{" "}
                <span className="text-red-500">*</span>
                <span className="text-[10px] font-normal text-slate-400 ml-2">
                  (Enter exactly 10 digits)
                </span>
              </label>

              {(formData.contact_numbers || []).map((num, idx) => {
                const cleanNum = cleanPhoneNumber(num);
                const isValid = cleanNum.length === 10;
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
                        className={`w-full px-4 py-2.5 bg-white border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium transition-all ${
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
                        const updated = (formData.contact_numbers || []).filter(
                          (_, i) => i !== idx,
                        );
                        setFormData((prev) => ({
                          ...prev,
                          contact_numbers: updated,
                        }));
                      }}
                      className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    contact_numbers: [...(prev.contact_numbers || []), ""],
                  }));
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                + Add Contact Number
              </button>
              <p className="text-[10px] text-slate-400 mt-1">
                Enter up to 10 digits (numbers only). Example: 9876543210
              </p>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="teaching-description"
                className="block text-sm font-semibold text-slate-700"
              >
                About Your Service{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
                <span className="text-xs font-normal text-gray-400 ml-2">
                  (Max 500 characters)
                </span>
              </label>
              <textarea
                id="teaching-description"
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  const value = e.target.value;
                  // Limit to 500 characters
                  if (value.length <= 100) {
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }));
                  }
                }}
                placeholder="Describe what you do and who you help."
                maxLength={100}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed font-sans resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400">
                  Optional: Add details to help Customers/parents understand
                  your teaching style.
                </p>
                <span className="text-[10px] text-slate-400">
                  {formData.description.length}/100
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8 max-w-4xl">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-lg border border-blue-100/40 tracking-wide mb-3 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Quick Tutor Launch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight font-sans">
            Create Service
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
            Tell Customers what you do and start receiving enquiries. Simple,
            fast, and listing in under 30 seconds.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              * Required fields
            </span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              All other fields are optional
            </span>
          </div>
        </div>

        {dbError && (
          <div className="mb-6 max-w-4xl p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-red-800">
                Unable to Publish Service
              </h4>
              <p className="text-xs text-red-600 mt-1">{dbError}</p>
            </div>
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Sticky Live Preview Column (Renders at top on mobile, right on desktop) */}
          <div className="xl:col-span-4 xl:sticky xl:top-24 w-full order-1 xl:order-2">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 mb-4 w-full shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                Tips for high click rate
              </h4>
              <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-5 font-medium leading-relaxed">
                <li>
                  Pick the closest teaching category to match Customer search
                  phrases.
                </li>
                <li>Write a clean, action-oriented Service Title.</li>
                <li>
                  Add a valid 10-digit contact number for Customers to reach
                  you.
                </li>
                <li>
                  Optional details like location, pricing, and description help
                  attract more Customers.
                </li>
              </ul>
            </div>

            <LivePreviewCard data={formData} />
          </div>

          {/* Form Side (Renders below preview on mobile, left on desktop) */}
          <div className="xl:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-8 order-2 xl:order-1">
            {currentStep === 0 ? (
              <div className="text-center py-10 px-4 space-y-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100/40">
                  <Sparkles className="h-7 w-7 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-850">
                    Create Service
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-none font-medium">
                    Set up your professional tutoring service profile in a few
                    steps. We will generate a public portfolio and scan-to-call
                    posters for you!
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition cursor-pointer active:scale-95 shadow-md shadow-blue-500/10"
                >
                  Create a Tutoring Service
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Step {currentStep} of 9
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-700 mt-2">
                      {getStepTitle(currentStep)}
                    </h4>
                  </div>
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${(currentStep / 9) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Render active step input */}
                <div className="py-2">{renderStepContent(currentStep)}</div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-extrabold rounded-xl transition cursor-pointer active:scale-95"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-extrabold rounded-xl transition cursor-pointer active:scale-95"
                    >
                      Cancel
                    </button>
                  )}
                  <div className="ml-auto">
                    <button
                      type="button"
                      disabled={!isStepValid(currentStep) || isSubmitting}
                      onClick={() => {
                        if (currentStep < 9) {
                          setCurrentStep(currentStep + 1);
                        } else {
                          handlePublish();
                        }
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                    >
                      {isSubmitting && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      <span>
                        {currentStep === 9
                          ? isSubmitting
                            ? "Publishing..."
                            : "Publish Service"
                          : "Next"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS DIALOG AND MOPUP REMOVED IN STICKY BAR */}

      {/* Success Dialog Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              style={{ width: "min(520px, calc(100vw - 32px))" }}
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 max-h-[calc(100vh-3rem)] overflow-y-auto text-center"
            >
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner relative mx-auto mb-5">
                <CheckCircle2 className="h-9 w-9" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-ping"></span>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight mb-3">
                  Teaching Service Published!
                </h2>
                <p
                  className="text-sm sm:text-base text-slate-500 leading-7 mx-auto"
                  style={{
                    maxWidth: "420px",
                    overflowWrap: "break-word",
                    wordBreak: "normal",
                  }}
                >
                  Congratulations! Your listing has been published. Local
                  Customers and parents searching for{" "}
                  <strong className="font-bold text-slate-700 break-words">
                    {formData.title}
                  </strong>{" "}
                  will now be able to discover and contact you.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 w-full text-left border border-slate-100 text-sm text-slate-650 space-y-3 font-medium mb-5">
                <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                  <span className="text-slate-500">Category:</span>
                  <span className="text-slate-800 break-words">
                    {formData.category === "Other"
                      ? formData.customCategory
                      : formData.category}
                  </span>
                </div>
                {formData.city && (
                  <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-800 break-words">
                      {[formData.area, formData.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {formData.starting_price && (
                  <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                    <span className="text-slate-500">Price:</span>
                    <span className="text-slate-800 break-words">
                      ₹{formData.starting_price} /{" "}
                      {formData.price_unit.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-750 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

//
