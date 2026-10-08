"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Phone,
  Mail,
  ShieldCheck,
  X,
  Play,
  Share2,
  ExternalLink,
  Plus,
  ArrowRight,
  HelpCircle,
  Video,
  Trash2,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaDiscord,
  FaTelegram,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa6";
import { getCurrentUser, supabase } from "@/lib/supabase";
import { TutorServiceFormData, PricingTier, CustomSocialLink } from "@/lib/service.types";
import { getYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/url";
import { SUPPORT_NUMBERS, SUPPORT_NUMBERS_STRING } from "@/lib/contacts";

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
  "Night",
  "Flexible",
  "24x7",
  "On-Demand",
];

const SUGGESTED_PRICE_UNITS = [
  "Per Service",
  "Per Session",
  "Per Student",
  "Custom / Flexible",
  "Negotiable",
  "Per Month",
  "Per Hour",
  "One-time",
];

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
  "Tailor": "Professional Tailoring & Fitting",
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

const TOTAL_STEPS = 10;

/**
 * Renders the service creation page with flexible manual pricing, social links,
 * intro video, payment activation support, and create another service capability.
 */
export default function CreateServicePage() {
  const router = useRouter();

  // App state
  const [user, setUser] = useState<ServiceUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdServiceId, setCreatedServiceId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactRequested, setContactRequested] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Security & Permission States
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [existingService, setExistingService] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Form State
  const initialFormState: TutorServiceFormData = {
    title: "",
    category: "",
    customCategory: "",
    description: "",
    service_modes: [],
    city: "",
    area: "",
    address: "",
    latitude: null,
    longitude: null,
    availability: [],
    custom_availability: "",
    languages: ["English"],
    starting_price: null,
    price_unit: "Per Month",
    pricing_note: "",
    pricing_tiers: [
      { label: "General Plan", price: "", unit: "per month" },
    ],
    contact_numbers: [],
    intro_video_url: "",
    social_links: {
      whatsapp: "",
      instagram: "",
      facebook: "",
      linkedin: "",
      discord: "",
      telegram: "",
      youtube: "",
      website: "",
      custom_links: [],
    },
  };

  const [formData, setFormData] = useState<TutorServiceFormData>(initialFormState);
  const [customUnit, setCustomUnit] = useState("");
  const [customAvailTag, setCustomAvailTag] = useState("");
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
            contact_numbers: prev.contact_numbers?.length ? prev.contact_numbers : [userPhone],
            social_links: {
              ...prev.social_links,
              whatsapp: prev.social_links?.whatsapp || userPhone,
            },
          }));
        }

        // Get session token for secure API checks
        if (supabase) {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData?.session?.access_token || null;
          setAuthToken(token);

          // Check if user already has an existing service (Strict 1 service per account limit)
          const { data: userServices } = await supabase
            .from("services")
            .select("id, title")
            .eq("user_id", currentUser.id)
            .limit(1);

          if (userServices && userServices.length > 0) {
            setExistingService({
              id: userServices[0].id,
              title: userServices[0].title || "My Service Listing",
            });
          }

          let verifiedPaid = false;
          let userSocials: Record<string, any> = {};
          let userIntroVideo = "";

          // 1. Try secure status check API first (handles phone, email, and ID matching with service role)
          if (token) {
            try {
              const statusRes = await fetch("/api/auth/status", {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.isPaid) {
                  verifiedPaid = true;
                }
                if (statusData.profile?.social_links) {
                  userSocials = statusData.profile.social_links;
                }
                if (statusData.profile?.intro_video_url) {
                  userIntroVideo = statusData.profile.intro_video_url;
                }
              }
            } catch (statusErr) {
              console.warn("Status API check non-fatal error:", statusErr);
            }
          }

          // 2. Direct Supabase query fallback
          if (!verifiedPaid) {
            const { data: profile } = await supabase
              .from("users")
              .select("is_paid, intro_video_url, social_links")
              .eq("id", currentUser.id)
              .maybeSingle();

            if (profile?.is_paid === true || String(profile?.is_paid) === "true") {
              verifiedPaid = true;
            }
            if (profile?.social_links) {
              userSocials = { ...userSocials, ...(profile.social_links as Record<string, any>) };
            }
            if (profile?.intro_video_url) {
              userIntroVideo = userIntroVideo || profile.intro_video_url;
            }
          }

          // 3. User metadata fallback
          if (!verifiedPaid && (currentUser.user_metadata as any)?.is_paid) {
            verifiedPaid = true;
          }

          setIsPaid(verifiedPaid);

          setFormData((prev) => ({
            ...prev,
            intro_video_url: prev.intro_video_url || userIntroVideo || userSocials.intro_video_url || "",
            social_links: {
              whatsapp: userSocials.whatsapp || prev.social_links?.whatsapp || userPhone || "",
              instagram: userSocials.instagram || prev.social_links?.instagram || "",
              facebook: userSocials.facebook || prev.social_links?.facebook || "",
              linkedin: userSocials.linkedin || prev.social_links?.linkedin || "",
              discord: userSocials.discord || prev.social_links?.discord || "",
              telegram: userSocials.telegram || prev.social_links?.telegram || "",
              youtube: userSocials.youtube || prev.social_links?.youtube || "",
              website: userSocials.website || prev.social_links?.website || "",
              custom_links: Array.isArray(userSocials.custom_links)
                ? userSocials.custom_links
                : prev.social_links?.custom_links || [],
            },
          }));
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

  // Pricing Tiers Handlers
  const handleAddTier = () => {
    setFormData((prev) => ({
      ...prev,
      pricing_tiers: [
        ...(prev.pricing_tiers || []),
        { label: "", price: "", unit: "per month" },
      ],
    }));
  };

  const handleUpdateTier = (
    index: number,
    field: "label" | "price" | "unit",
    value: string | number,
  ) => {
    setFormData((prev) => {
      const tiers = [...(prev.pricing_tiers || [])];
      if (tiers[index]) {
        tiers[index] = {
          ...tiers[index],
          [field]: value,
        };
      }
      return { ...prev, pricing_tiers: tiers };
    });
  };

  const handleRemoveTier = (index: number) => {
    setFormData((prev) => {
      const tiers = [...(prev.pricing_tiers || [])].filter((_, i) => i !== index);
      return { ...prev, pricing_tiers: tiers };
    });
  };

  // Custom Social Links Handlers
  const handleAddCustomSocial = () => {
    setFormData((prev) => {
      const customLinks = prev.social_links?.custom_links || [];
      return {
        ...prev,
        social_links: {
          ...prev.social_links,
          custom_links: [...customLinks, { name: "", url: "" }],
        },
      };
    });
  };

  const handleUpdateCustomSocial = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    setFormData((prev) => {
      const customLinks = [...(prev.social_links?.custom_links || [])];
      if (customLinks[index]) {
        customLinks[index] = { ...customLinks[index], [field]: value };
      }
      return {
        ...prev,
        social_links: {
          ...prev.social_links,
          custom_links: customLinks,
        },
      };
    });
  };

  const handleRemoveCustomSocial = (index: number) => {
    setFormData((prev) => {
      const customLinks = [...(prev.social_links?.custom_links || [])].filter(
        (_, i) => i !== index,
      );
      return {
        ...prev,
        social_links: {
          ...prev.social_links,
          custom_links: customLinks,
        },
      };
    });
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
    address: string;
    latitude: number | null;
    longitude: number | null;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // Handle social link updates
  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
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
        "Account activation required. Please call support at 88795 14626 to activate your service listing.",
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

    // Determine lowest price and cleaned tiers
    const validTierPrices = (formData.pricing_tiers || [])
      .map((t) => (t.price !== "" && t.price !== null && t.price !== undefined ? Number(t.price) : null))
      .filter((p): p is number => p !== null && !isNaN(p) && p >= 0);

    const lowestTierPrice = validTierPrices.length > 0 ? Math.min(...validTierPrices) : null;

    const finalPrice =
      lowestTierPrice !== null
        ? lowestTierPrice
        : formData.starting_price !== null && formData.starting_price !== undefined
        ? parseInt(formData.starting_price.toString(), 10)
        : null;

    const cleanedTiers = (formData.pricing_tiers || [])
      .filter((t) => t.label?.trim() || (t.price !== "" && t.price !== null && t.price !== undefined))
      .map((t) => ({
        label: t.label?.trim() || "General Plan",
        price: t.price !== "" && t.price !== null && t.price !== undefined ? Number(t.price) : 0,
        unit: t.unit?.trim() || "per month",
      }));

    const finalUnit = cleanedTiers.length > 0
      ? cleanedTiers[0].unit
      : formData.price_unit === "Custom"
      ? customUnit.trim() || "Custom / Flexible"
      : formData.price_unit || "Per Month";

    const cleanedCustomLinks = (formData.social_links?.custom_links || [])
      .filter((l) => l.name?.trim() && l.url?.trim())
      .map((l) => ({ name: l.name.trim(), url: l.url.trim() }));

    const payload = {
      title: formData.title.trim(),
      category: finalCategory,
      description: formData.description.trim() || "",
      service_modes:
        formData.service_modes.length > 0 ? formData.service_modes : [],
      city: formData.city.trim() || "",
      area: formData.area.trim() || null,
      address: formData.address?.trim() || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      availability:
        formData.availability.length > 0 ? formData.availability : [],
      custom_availability: formData.custom_availability?.trim() || "",
      languages:
        formData.languages.length > 0 ? formData.languages : ["English"],
      starting_price: finalPrice,
      price_unit: finalUnit,
      pricing_note: formData.pricing_note?.trim() || "",
      pricing_tiers: cleanedTiers,
      contact_numbers: cleanContacts,
      intro_video_url: formData.intro_video_url?.trim() || "",
      social_links: {
        ...formData.social_links,
        custom_links: cleanedCustomLinks,
      },
    };

    try {
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
          data.error || `Failed to publish service. Please try again or call ${SUPPORT_NUMBERS_STRING}.`,
        );
      }

      if (data.service?.id) {
        setCreatedServiceId(data.service.id);
      }
      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error("Failed to publish service:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : `Unable to publish your service at this moment. Please call support at ${SUPPORT_NUMBERS_STRING}.`;
      setDbError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setCreatedServiceId(null);
    setCurrentStep(1);
    setIsTitleManuallyEdited(false);
    setDbError(null);
    setFormData({
      ...initialFormState,
      city: formData.city,
      area: formData.area,
      latitude: formData.latitude,
      longitude: formData.longitude,
      contact_numbers: user?.user_metadata?.phone_no
        ? [user.user_metadata.phone_no]
        : formData.contact_numbers,
      social_links: formData.social_links,
      intro_video_url: formData.intro_video_url,
    });
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
              verified service partners. Contact our team at any of our official numbers below to activate your provider listing immediately.
            </p>
          </div>

          {/* Contact Support Details Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w mx-auto text-left space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                GullyGig Official Help &amp; Support Lines
              </span>
            </div>

            <div className="space-y-3">
              {SUPPORT_NUMBERS.map((contact, idx) => (
                <div
                  key={contact.raw}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Support Line {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                      {contact.international}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={contact.tel}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Call</span>
                    </a>
                    <a
                      href={contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}

              {/* Email */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Official Email Support
                  </span>
                  <a
                    href="mailto:support@gullygig.in"
                    className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    support@gullygig.in
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic pt-1">
              * Call or WhatsApp <strong>88795 14626</strong>, <strong>755 930 2315</strong>, or <strong>82630 81521</strong> to activate your provider account.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w mx-auto">
            <a
              href="tel:8879514626"
              className="w-full sm:flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Primary (88795 14626)</span>
            </a>

            <a
              href="https://wa.me/918879514626?text=Hello%20GullyGig%20Support!%20I%20want%20to%20activate%20my%20service%20provider%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setAuthLoading(true);
                window.location.reload();
              }}
              className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SERVICE LIMIT REACHED (MAX 1 SERVICE PER ACCOUNT)
  // =========================================================================
  if (existingService) {
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
          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Account Limit: 1/1 Service
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-18 h-18 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner mx-auto border border-blue-100">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-3 max-w mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Maximum 1 Service Listing Per Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Service Limit Reached
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Each provider account on GullyGig is permitted to create exactly <strong>1 service listing</strong>. You already have an active service published:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Active Service Listing</span>
              <span className="text-base font-extrabold text-slate-900 block">
                {existingService.title}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => router.push(`/p/${existingService.id}`)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View My Service</span>
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Go to Dashboard</span>
            </button>
          </div>

          {/* Help & Support Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w mx-auto text-left space-y-4 shadow-xs mt-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Need to Change or Upgrade Your Service?
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If you want to edit your fee structure, update timings, or change your category, you can modify it directly from your dashboard or call our support team for instant assistance:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SUPPORT_NUMBERS.map((contact, idx) => (
                <div
                  key={contact.raw}
                  className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-2"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Support {idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 font-mono block">
                      {contact.international}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={contact.tel}
                      className="flex-1 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg transition text-center flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>Call</span>
                    </a>
                    <a
                      href={contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg transition text-center flex items-center justify-center gap-1"
                    >
                      <FaWhatsapp className="w-3 h-3 text-emerald-600" />
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
        return "Pricing & Fee Structure";
      case 8:
        return "Contact Numbers";
      case 9:
        return "Video Demo & Social Links";
      case 10:
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

  const videoId = getYouTubeVideoId(formData.intro_video_url);

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
              Teaching / Service Modes
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
            address={formData.address || ""}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={handleLocationChange}
          />
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Availability Days &amp; Times
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Select quick slots, add your own custom tags, or type your weekly schedule.
              </p>
            </div>

            {/* Presets Grid */}
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

            {/* Active custom tags display */}
            {formData.availability.filter((a) => !AVAILABILITY_OPTIONS.includes(a)).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full">
                  Custom Timing Tags:
                </span>
                {formData.availability
                  .filter((a) => !AVAILABILITY_OPTIONS.includes(a))
                  .map((customTag) => (
                    <span
                      key={customTag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold"
                    >
                      <span>{customTag}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(customTag)}
                        className="text-blue-500 hover:text-red-500 transition cursor-pointer"
                        title="Remove tag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            {/* Custom Tag Input */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-600">
                Add Custom Timing / Slot Tag
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAvailTag}
                  onChange={(e) => setCustomAvailTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const tag = customAvailTag.trim();
                      if (tag && !formData.availability.includes(tag)) {
                        setFormData((prev) => ({
                          ...prev,
                          availability: [...prev.availability, tag],
                        }));
                        setCustomAvailTag("");
                      }
                    }
                  }}
                  placeholder="e.g. Mon &amp; Wed 6-8 PM, Sundays Only, Alternate Days..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const tag = customAvailTag.trim();
                    if (tag && !formData.availability.includes(tag)) {
                      setFormData((prev) => ({
                        ...prev,
                        availability: [...prev.availability, tag],
                      }));
                      setCustomAvailTag("");
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                >
                  + Add Tag
                </button>
              </div>
            </div>

            {/* Custom Detailed Schedule Textarea */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-slate-600">
                Detailed Custom Schedule / Timings Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={formData.custom_availability || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    custom_availability: e.target.value,
                  }))
                }
                rows={2}
                placeholder="e.g. Monday to Friday: 4:00 PM – 8:30 PM, Saturdays: 10:00 AM – 1:00 PM, or flexible on mutual agreement."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
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
      case 7: {
        const validPrices = (formData.pricing_tiers || [])
          .map((t) => (t.price !== "" && t.price !== null && t.price !== undefined ? Number(t.price) : null))
          .filter((p): p is number => p !== null && !isNaN(p) && p >= 0);
        const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;

        return (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/90 rounded-2xl p-4.5 text-xs text-blue-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold text-sm block text-blue-950">
                    Customizable Pricing Plans &amp; Tiers
                  </span>
                  <p className="text-blue-800/90 leading-relaxed text-[11px]">
                    Create flexible pricing plans for different age groups, course levels, or batches (e.g. <em>10-15 year old: ₹500/month</em>, <em>15+ year old: ₹1000/month</em>). We automatically highlight your lowest starting rate!
                  </p>
                </div>
              </div>
              {minPrice !== null && (
                <div className="hidden sm:flex flex-col items-end shrink-0 bg-white/90 border border-blue-200/80 px-3 py-1.5 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts From</span>
                  <span className="text-sm font-extrabold text-blue-600 font-mono">₹{minPrice}</span>
                </div>
              )}
            </div>

            {/* Pricing Tiers List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  Fee Structure / Tier Plans ({formData.pricing_tiers?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Pricing Tier
                </button>
              </div>

              {(!formData.pricing_tiers || formData.pricing_tiers.length === 0) ? (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
                  <p className="text-xs text-slate-500 font-medium">
                    No pricing tiers added yet. You can add specific rates for age groups, classes, or sessions.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddTier}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add First Pricing Tier
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.pricing_tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 transition-all hover:border-slate-300 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-extrabold">
                            #{idx + 1}
                          </span>
                          <span>Tier / Plan Details</span>
                        </span>
                        {formData.pricing_tiers && formData.pricing_tiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(idx)}
                            className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete tier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Plan / Audience Name */}
                        <div className="sm:col-span-6 space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">
                            Audience / Plan Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={tier.label}
                            onChange={(e) => handleUpdateTier(idx, "label", e.target.value)}
                            placeholder="e.g. 10-15 year old, College Students, Beginner Batch"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>

                        {/* Price (₹) */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">
                            Fee / Price (₹) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={tier.price ?? ""}
                            onChange={(e) => handleUpdateTier(idx, "price", e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>

                        {/* Frequency / Unit */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">
                            Billing Frequency
                          </label>
                          <input
                            type="text"
                            value={tier.unit}
                            onChange={(e) => handleUpdateTier(idx, "unit", e.target.value)}
                            placeholder="e.g. per month, per hour, per session"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add more button */}
              {formData.pricing_tiers && formData.pricing_tiers.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="w-full py-2.5 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Pricing Tier (e.g. 15+ year old -&gt; 1000 per month)</span>
                </button>
              )}
            </div>

            {/* Additional Custom Fee Notes */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Additional Fee Details / Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={formData.pricing_note || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pricing_note: e.target.value,
                  }))
                }
                placeholder="e.g. Special discounts for group bookings, 1 free demo class included, materials provided separately."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 resize-none"
              />
            </div>
          </div>
        );
      }
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
          <div className="space-y-6">
            {/* YouTube Intro Video Section */}
            <div className="space-y-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                <FaYoutube className="w-4 h-4 text-red-600" />
                <span>Introduction / Demo YouTube Video (Plays on Portfolio)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Paste any YouTube video link (watch URL, shorts, or youtu.be). It will be embedded cleanly on your public portfolio page.
              </p>
              <input
                type="url"
                value={formData.intro_video_url || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    intro_video_url: e.target.value,
                  }))
                }
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800"
              />

              {videoId && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-3 h-3" /> Valid YouTube Video Linked
                  </span>
                  <div className="aspect-video w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(formData.intro_video_url) || ""}
                      title="YouTube Introduction Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Social Profiles &amp; Chat Channels (Optional)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Connect your social media and instant chat channels for direct client inquiries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaWhatsapp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp Number / Link</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.whatsapp || ""}
                    onChange={(e) => handleSocialChange("whatsapp", e.target.value)}
                    placeholder="9876543210 or wa.me/..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaInstagram className="w-3.5 h-3.5 text-pink-500" />
                    <span>Instagram Profile</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.instagram || ""}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourhandle or @handle"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-slate-800"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaFacebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook Page / Profile</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.facebook || ""}
                    onChange={(e) => handleSocialChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaLinkedin className="w-3.5 h-3.5 text-sky-600" />
                    <span>LinkedIn URL</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.linkedin || ""}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                  />
                </div>

                {/* Discord */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaDiscord className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Discord Server / ID</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.discord || ""}
                    onChange={(e) => handleSocialChange("discord", e.target.value)}
                    placeholder="https://discord.gg/... or username"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  />
                </div>

                {/* Telegram */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaTelegram className="w-3.5 h-3.5 text-sky-500" />
                    <span>Telegram Link / Handle</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.telegram || ""}
                    onChange={(e) => handleSocialChange("telegram", e.target.value)}
                    placeholder="https://t.me/username or @username"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                  />
                </div>

                {/* YouTube Channel */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaYoutube className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube Channel URL</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.youtube || ""}
                    onChange={(e) => handleSocialChange("youtube", e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-800"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <FaGlobe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Personal Website / Portfolio Link</span>
                  </div>
                  <input
                    type="text"
                    value={formData.social_links?.website || ""}
                    onChange={(e) => handleSocialChange("website", e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                  />
                </div>
              </div>

              {/* Custom Social / Chat Channels Builder */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Custom Social &amp; Chat Channels</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomSocial}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Custom Link
                  </button>
                </div>

                {formData.social_links?.custom_links && formData.social_links.custom_links.length > 0 && (
                  <div className="space-y-2">
                    {formData.social_links.custom_links.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleUpdateCustomSocial(idx, "name", e.target.value)}
                          placeholder="Platform (e.g. Threads, Medium)"
                          className="w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateCustomSocial(idx, "url", e.target.value)}
                          placeholder="URL or handle (https://...)"
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSocial(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Remove custom link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 10:
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
            Publish your verified tutoring profile to GullyGig marketplace &amp; public portfolio
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">Support:</span>
            <a href="tel:8879514626" className="hover:text-blue-600 font-mono">88795 14626</a>
            <span className="text-slate-300">•</span>
            <a href="tel:7559302315" className="hover:text-blue-600 font-mono">755 930 2315</a>
            <span className="text-slate-300">•</span>
            <a href="tel:8263081521" className="hover:text-blue-600 font-mono">82630 81521</a>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {dbError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{dbError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-red-600 text-[11px]">Call support:</span>
            <a href="tel:8879514626" className="font-extrabold underline hover:text-red-900">88795 14626</a>
            <span>/</span>
            <a href="tel:7559302315" className="font-extrabold underline hover:text-red-900">755 930 2315</a>
            <span>/</span>
            <a href="tel:8263081521" className="font-extrabold underline hover:text-red-900">82630 81521</a>
          </div>
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
                <div className="space-y-2 max-w mx-auto">
                  <h2 className="text-2xl font-extrabold text-slate-800">
                    Ready to launch your service?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    Follow the guided 10-step setup to customize your listing, schedule, pricing, YouTube video, and social profiles.
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
                      Step {currentStep} of {TOTAL_STEPS}
                    </span>
                    <span className="text-slate-700">
                      {getStepTitle(currentStep)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
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
                      if (currentStep < TOTAL_STEPS) {
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
                      {currentStep === TOTAL_STEPS
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
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 w-max text-center space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Service Listing Published!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w mx-auto">
                  Congratulations! Your service listing is now active. Local clients can discover your profile, watch your demo video, and contact you directly.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs text-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-bold text-slate-800">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-slate-800">
                    {formData.category === "Other"
                      ? formData.customCategory
                      : formData.category}
                  </span>
                </div>
                {formData.starting_price && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fee:</span>
                    <span className="font-bold text-blue-600">
                      ₹{formData.starting_price} ({formData.price_unit})
                    </span>
                  </div>
                )}
                {formData.city && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-bold text-slate-800">{formData.city}</span>
                  </div>
                )}
              </div>

              {/* Single Service Limit Notice & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-blue-50 border border-blue-200/70 rounded-2xl text-center">
                  <span className="text-xs font-extrabold text-blue-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" />
                    Your 1 Allowed Service Listing is Live!
                  </span>
                  <span className="text-[11px] text-blue-600 block mt-0.5">
                    Each account has a limit of 1 active service. You can update or edit your listing anytime from your dashboard.
                  </span>
                </div>

                <div className="space-y-2">
                  {createdServiceId && (
                    <button
                      type="button"
                      onClick={() => router.push(`/p/${createdServiceId}`)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Live Public Portfolio</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
                  >
                    <span>Go to Dashboard</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
