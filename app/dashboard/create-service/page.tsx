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
  Lock,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  X,
  Briefcase,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { getCurrentUser, supabase } from "@/lib/supabase";
import { TutorServiceFormData } from "@/lib/service.types";

import SearchableDropdown from "@/components/create-service/SearchableDropdown";
import LocationSelector from "@/components/create-service/LocationSelector";
import LanguageSelector from "@/components/create-service/LanguageSelector";
import LivePreviewCard from "@/components/create-service/LivePreviewCard";

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
 * Renders the service creation page with strict payment validation, 1-service restriction, and guided wizard.
 */
export default function CreateServicePage() {
  const router = useRouter();

  // App state
  const [user, setUser] = useState<ServiceUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactRequested, setContactRequested] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Security & Permission States
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [existingServicesCount, setExistingServicesCount] = useState<number>(0);
  const [existingServiceId, setExistingServiceId] = useState<string | null>(
    null,
  );

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

  // Authentication & Permission Check
  useEffect(() => {
    async function checkUserAndPermissions() {
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

        // Get session token for secure API checks
        if (supabase) {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData?.session?.access_token || null;
          setAuthToken(token);

          // Fetch user payment status and existing services count directly from Supabase
          const { data: profile } = await supabase
            .from("users")
            .select("is_paid")
            .eq("id", currentUser.id)
            .single();

          setIsPaid(!!profile?.is_paid);

          const { data: userServices } = await supabase
            .from("services")
            .select("id, title")
            .eq("user_id", currentUser.id);

          const count = userServices?.length || 0;
          setExistingServicesCount(count);
          if (count > 0 && userServices?.[0]) {
            setExistingServiceId(userServices[0].id);
          }
        }
      } catch (err) {
        console.error("Auth / Permission check error:", err);
        router.push("/Auth");
      } finally {
        setAuthLoading(false);
      }
    }
    checkUserAndPermissions();
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
  // VALIDATION
  // ============================================
  const isFormValid = () => {
    const titleLength = formData.title.trim().length;
    if (titleLength < 3 || titleLength > 80) return false;

    if (formData.category === "") return false;
    if (
      formData.category === "Other" &&
      (formData.customCategory || "").trim() === ""
    )
      return false;

    const cleanContacts = (formData.contact_numbers || [])
      .map((n) => cleanPhoneNumber(n))
      .filter(Boolean);

    if (cleanContacts.length === 0) return false;
    const allValid = cleanContacts.every((num) => num.length === 10);
    if (!allValid) return false;

    return true;
  };

  // Handle publishing service securely through API
  const handlePublish = async () => {
    if (!isFormValid() || !user) return;

    if (!isPaid) {
      setDbError(
        "Account activation required. Please contact support to activate your service listing.",
      );
      return;
    }

    if (existingServicesCount >= 1) {
      setDbError(
        "You already have an active service listing. Each account is limited to 1 service.",
      );
      return;
    }

    setIsSubmitting(true);
    setDbError(null);

    const cleanContacts = (formData.contact_numbers || [])
      .map((n) => cleanPhoneNumber(n))
      .filter(Boolean);

    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory?.trim() || "Other"
        : formData.category;

    const finalPrice =
      formData.starting_price !== null && formData.starting_price !== undefined
        ? parseInt(formData.starting_price.toString(), 10)
        : null;

    const payload = {
      title: formData.title.trim(),
      category: finalCategory,
      description: formData.description.trim() || "",
      service_modes:
        formData.service_modes.length > 0 ? formData.service_modes : [],
      city: formData.city.trim() || "",
      area: formData.area.trim() || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      availability:
        formData.availability.length > 0 ? formData.availability : [],
      languages:
        formData.languages.length > 0 ? formData.languages : ["English"],
      starting_price: finalPrice,
      price_unit: finalPrice ? formData.price_unit : null,
      contact_numbers: cleanContacts,
    };

    try {
      // Use secure API endpoint with bearer token
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to publish service. Please try again.",
        );
      }

      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error("Failed to publish service:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Unable to publish your service at this moment. Please try again.";
      setDbError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    window.location.href = "/dashboard";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">
            Checking your provider status...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: UNPAID USER / ACTIVATION REQUIRED GATE
  // =========================================================================
  if (!isPaid) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Top Status Tag */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-18 h-18 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner mx-auto border border-amber-100">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-3 max-w mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Activate Your Provider Listing
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Service listings on GullyGig are exclusively available for
              verified and active service partners. Please contact our support
              team to activate your account.
            </p>
          </div>

          {/* Contact Support Details Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w mx-auto text-left space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Sparkles className="w-4 h-4 text-blue-600" />
              GullyGig Support Team
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Support Line 1
                </span>
                <a
                  href="tel:7559302315"
                  className="text-sm font-bold text-slate-800 hover:text-blue-600 flex items-center gap-2 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  +91 7559302315
                </a>
              </div>

              {/* Phone 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Support Line 2
                </span>
                <a
                  href="tel:8263081521"
                  className="text-sm font-bold text-slate-800 hover:text-blue-600 flex items-center gap-2 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  +91 8263081521
                </a>
              </div>

              {/* Email */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-xs space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Official Email Support
                </span>
                <a
                  href="mailto:support@gullygig.in"
                  className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  support@gullygig.in
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic pt-1">
              * Once your payment is verified, our team will activate your
              service creation access and we will contact you soon!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w mx-auto">
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full sm:flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Support</span>
            </button>

            <a
              href="https://wa.me/918263081521?text=Hello%20GullyGig%20Support!%20I%20want%20to%20activate%20my%20service%20provider%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>

        {/* Contact Support Modal */}
        <AnimatePresence>
          {showContactModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/50 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 max-w-md w-full text-center space-y-5"
              >
                <button
                  onClick={() => setShowContactModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                  <Phone className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Get in Touch with GullyGig
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Our team is ready to assist you with onboarding, payments,
                    and account activation.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <a
                      href="mailto:support@gullygig.in"
                      className="text-blue-600 hover:underline font-bold"
                    >
                      support@gullygig.in
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone 1:</span>
                    <a
                      href="tel:7559302315"
                      className="text-slate-800 hover:text-blue-600 font-bold"
                    >
                      7559302315
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone 2:</span>
                    <a
                      href="tel:8263081521"
                      className="text-slate-800 hover:text-blue-600 font-bold"
                    >
                      8263081521
                    </a>
                  </div>
                </div>

                {contactRequested ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold">
                    ✓ Request received! We will contact you soon.
                  </div>
                ) : (
                  <button
                    onClick={() => setContactRequested(true)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    Confirm Request &amp; Notify Team
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: USER ALREADY HAS 1 SERVICE (STRICT 1 SERVICE PER USER RULE)
  // =========================================================================
  if (existingServicesCount >= 1) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Top Status Tag */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />1 Service
            Limit Active
          </span>
        </div>

        {/* Existing Service Alert Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
            <Briefcase className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-800">
              Service Listing Limit Reached
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              GullyGig strictly allows{" "}
              <strong>one active service listing</strong> per provider account
              to ensure optimal quality and maximum focus.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 max-w-md mx-auto text-left text-xs font-semibold text-slate-600 space-y-2">
            <p className="text-slate-800 font-bold">Need to make changes?</p>
            <p>
              You can easily update your service title, pricing, location,
              modes, and description from your main Dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl transition shadow-md shadow-blue-500/15 cursor-pointer"
            >
              Manage in Dashboard
            </button>
            {existingServiceId && (
              <button
                onClick={() => router.push(`/p/${existingServiceId}`)}
                className="w-full sm:flex-1 py-3 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl transition cursor-pointer"
              >
                View Public Portfolio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: PAID USER CREATING SERVICE (WIZARD & PREVIEW)
  // =========================================================================
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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Service Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Expert Class 10 Math Tutor"
                maxLength={80}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-1">
                <span>Must be between 3 and 80 characters</span>
                <span>{formData.title.length}/80</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Teaching Modes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TEACHING_MODES.map((mode) => {
                const selected = formData.service_modes.includes(mode);
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleToggleMode(mode)}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 cursor-pointer text-center ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <LocationSelector
            city={formData.city}
            area={formData.area}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={handleLocationChange}
          />
        );
      case 5:
        return (
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Availability Days &amp; Times
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVAILABILITY_OPTIONS.map((opt) => {
                const selected = formData.availability.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleAvailability(opt)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all duration-200 cursor-pointer text-center ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 6:
        return (
          <LanguageSelector
            selectedLanguages={formData.languages}
            onChange={(langs) =>
              setFormData((prev) => ({ ...prev, languages: langs }))
            }
          />
        );
      case 7:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Starting Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.starting_price ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      starting_price: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    }))
                  }
                  placeholder="e.g. 500"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Price Unit
                </label>
                <select
                  value={formData.price_unit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price_unit: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 cursor-pointer"
                >
                  {PRICE_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Primary Contact Number (10 Digits){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.contact_numbers?.[0] || ""}
                onChange={(e) => handleContactChange(0, e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Secondary Contact Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.contact_numbers?.[1] || ""}
                onChange={(e) => handleContactChange(1, e.target.value)}
                placeholder="e.g. 8765432109"
                maxLength={10}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Description / Bio
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Tell clients about your teaching experience, methodology, achievements, and teaching background..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 resize-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Header & Paid Status Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">
              Create Service Listing
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Publish your verified tutoring profile to GullyGig marketplace &amp;
            public portfolio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Paid &amp; Verified Provider
          </span>
        </div>
      </div>

      {/* Error notification */}
      {dbError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      {/* Main Grid: Form Wizard and Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Preview Card */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="sticky top-24">
            <LivePreviewCard data={formData} />
          </div>
        </div>

        {/* Wizard Form */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {currentStep === 0 ? (
              <div className="text-center space-y-6 py-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl font-extrabold text-slate-800">
                    Ready to launch your service?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    Follow the guided 9-step setup to customize your listing,
                    schedule, location, and pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  <span>Start Step-by-Step Setup</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Step Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-blue-600 uppercase tracking-wider">
                      Step {currentStep} of 9
                    </span>
                    <span className="text-slate-700">
                      {getStepTitle(currentStep)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(currentStep / 9) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Active Step Content */}
                <div className="py-2 min-h-[220px]">
                  {renderStepContent(currentStep)}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition cursor-pointer active:scale-95"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition cursor-pointer active:scale-95"
                    >
                      Cancel
                    </button>
                  )}

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
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-500/15"
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
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 max-w-lg w-full text-center space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Service Listing Published!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                  Congratulations! Your service listing is now live. Local
                  clients can discover your profile, explore details, and
                  contact you directly.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs text-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-bold text-slate-800">
                    {formData.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-slate-800">
                    {formData.category === "Other"
                      ? formData.customCategory
                      : formData.category}
                  </span>
                </div>
                {formData.city && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">City:</span>
                    <span className="font-bold text-slate-800">
                      {formData.city}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
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
