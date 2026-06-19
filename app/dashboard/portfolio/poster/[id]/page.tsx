"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Share2,
  FileText,
  FileImage,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getCurrentUser, supabase } from "@/lib/supabase";
import PosterTemplate from "@/components/poster/PosterTemplates";

const templates = [
  {
    id: "business",
    name: "Modern Business",
    desc: "Corporate blue-gradient design",
  },
  {
    id: "local",
    name: "Local Service",
    desc: "Clean layout highlighting location",
  },
  {
    id: "tutor",
    name: "Tutor & Education",
    desc: "Friendly scholastic aesthetic",
  },
  {
    id: "freelancer",
    name: "Freelancer Portfolio",
    desc: "High-tech clean dark theme",
  },
  { id: "dark", name: "Premium Dark", desc: "Luxe gold-bordered dark style" },
  {
    id: "whatsapp",
    name: "WhatsApp Status",
    desc: "Optimized 9:16 vertical layout",
  },
  {
    id: "instaStory",
    name: "Instagram Story",
    desc: "Vibrant story layout (9:16)",
  },
  { id: "instaPost", name: "Instagram Post", desc: "Square layout (1:1)" },
  { id: "flyer", name: "Print Flyer", desc: "Classic structured flyer (A4)" },
  {
    id: "minimal",
    name: "Minimal Professional",
    desc: "Ultra-clean serif design",
  },
];

const typographyOptions = [
  { id: "modern", label: "Modern (Sans-serif)" },
  { id: "professional", label: "Professional (Serif)" },
  { id: "bold", label: "High-Impact (Bold Capitalized)" },
  { id: "minimal", label: "Technical (Monospace)" },
];

// Accent colors removed for design consistency

const ctaOptions = [
  { id: "Call Now", label: "Call Now" },
  { id: "Book Today", label: "Book Today" },
  { id: "Contact Us", label: "Contact Us" },
  { id: "Hire Now", label: "Hire Now" },
];

interface ServiceItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  area: string | null;
  starting_price: number | null;
  price_unit: string | null;
  contact_numbers?: string[];
  rating_average?: number;
  users?: {
    full_name: string;
    about: string | null;
  };
}

export default function PosterGeneratorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<ServiceItem | null>(null);

  // Settings states
  const [selectedTemplate, setSelectedTemplate] = useState("business");
  const [orientation, setOrientation] = useState("portrait"); // "portrait" | "landscape" | "square"
  const [typography, setTypography] = useState("modern");
  const [ctaText, setCtaText] = useState("Call Now");

  // Export states
  const [exportingFormat, setExportingFormat] = useState<
    "png" | "jpg" | "pdf" | "share" | null
  >(null);
  const isExporting = exportingFormat !== null;
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  // Load service
  useEffect(() => {
    if (!id) return;

    async function loadServiceData() {
      try {
        setLoading(true);
        const { user } = (await getCurrentUser()) as {
          user: { id: string } | null;
        };
        if (!user) {
          router.push("/login");
          return;
        }

        if (!supabase) throw new Error("Supabase is not configured.");

        const { data, error: fetchError } = await supabase
          .from("services")
          .select("*, users:user_id(full_name, about)")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (fetchError) throw fetchError;
        setService(data as unknown as ServiceItem);

        // Adjust default orientation based on template
        if (data.category) {
          // Preset settings
        }
      } catch (err: unknown) {
        console.error("Poster loading error:", err);
        setError(
          "Failed to load service details. Make sure you own this listing.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadServiceData();
  }, [id, router]);

  // Handle template switch auto-orientation
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === "whatsapp" || templateId === "instaStory") {
      setOrientation("portrait-tall");
    } else if (templateId === "instaPost") {
      setOrientation("square");
    } else {
      setOrientation("portrait");
    }
  };

  // Export Logic using html2canvas & jspdf
  const exportPoster = async (format: "png" | "jpg" | "pdf" | "share") => {
    if (!previewRef.current || !service) return;
    setExportingFormat(format);
    setExportSuccess(false);

    try {
      // Dynamic import
      const html2canvas = (await import("html2canvas-pro")).default;

      // To capture the layout perfectly at high resolution:
      // We temporarily force the element to render at a large high-res dimension on screen, capture it, and restore.
      const element = previewRef.current;

      const canvas = await html2canvas(element, {
        scale: 3, // 3x scale for ultra crisp text and graphics
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const cleanTitle = service.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      if (format === "share") {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert("Failed to share image.");
            setExportingFormat(null);
            return;
          }
          const file = new File([blob], `${cleanTitle}-poster.png`, {
            type: "image/png",
          });
          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            try {
              await navigator.share({
                files: [file],
                title: service.title,
                text: `Check out my service poster for "${service.title}"!`,
              });
              setExportSuccess(true);
              setExportMessage("Poster shared successfully!");
            } catch (shareErr) {
              console.log("Sharing cancelled:", shareErr);
            }
          } else {
            // Fallback
            const link = document.createElement("a");
            link.download = `${cleanTitle}-poster.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            setExportSuccess(true);
            setExportMessage(
              "Sharing not supported natively. Poster downloaded as PNG.",
            );
          }
          setExportingFormat(null);
        }, "image/png");
      } else if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        const orientationMode = canvas.width > canvas.height ? "l" : "p";
        const pdf = new jsPDF({
          orientation: orientationMode,
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${cleanTitle}-poster.pdf`);
        setExportSuccess(true);
        setExportMessage("PDF downloaded successfully!");
        setExportingFormat(null);
      } else {
        // PNG or JPG
        const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
        const imgData = canvas.toDataURL(mimeType, 1.0);

        const link = document.createElement("a");
        link.download = `${cleanTitle}-poster.${format}`;
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportSuccess(true);
        setExportMessage(`${format.toUpperCase()} downloaded successfully!`);
        setExportingFormat(null);
      }
    } catch (err) {
      console.error("Export poster error:", err);
      alert("Failed to export poster. Please try again.");
      setExportingFormat(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500 mt-3">
            Loading poster generator...
          </p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xl max-w-md w-full text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-slate-800">
            Poster Error
          </h2>
          <p className="text-sm text-slate-500">
            {error || "Service listing not found."}
          </p>
          <button
            onClick={() => router.push("/dashboard/portfolio")}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Back to Portfolios
          </button>
        </div>
      </div>
    );
  }

  // Host URL detection
  const currentHost =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://kaamao.com";
  const portfolioUrl = `${currentHost}/p/${service.id}`;
  const locationStr = [service.area, service.city].filter(Boolean).join(", ");
  const contacts = service.contact_numbers || [];

  // Determine size helper for preview container
  const getOrientationStyles = () => {
    switch (orientation) {
      case "portrait-tall": // 9:16 WhatsApp / Instagram Story
        return { width: "320px", height: "570px" };
      case "square": // 1:1 Instagram Post
        return { width: "380px", height: "380px" };
      case "landscape": // Landscape ad
        return { width: "480px", height: "330px" };
      case "portrait": // 1:1.4 Flyer / Business standard
      default:
        return { width: "360px", height: "504px" };
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto font-sans">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/portfolio")}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            title="Back to Portfolios"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Premium Ad Poster Generator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate marketing flyers for social media
            </p>
          </div>
        </div>

        <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100/50 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {service.category}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SETTINGS PANEL (renders 2nd on mobile, 1st on desktop) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 order-2 lg:order-1">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2.5">
            Ad Customization
          </h3>

          {/* 1. Template select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              1. Select Template Design
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`p-3 text-left border rounded-xl transition duration-150 cursor-pointer ${
                    selectedTemplate === t.id
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="block text-xs font-bold">{t.name}</span>
                  <span className="block text-[9px] text-slate-400 font-medium mt-0.5 leading-tight">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Orientation Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              2. Dimensions / Orientation
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "portrait", label: "Portrait" },
                { id: "portrait-tall", label: "Story (9:16)" },
                { id: "square", label: "Square (1:1)" },
                { id: "landscape", label: "Landscape" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setOrientation(opt.id)}
                  className={`py-2 px-1 text-center border rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                    orientation === opt.id
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-650"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Typography select */}
          <div className="space-y-2">
            <label
              htmlFor="typography-select"
              className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider"
            >
              3. Font Typography style
            </label>
            <select
              id="typography-select"
              value={typography}
              onChange={(e) => setTypography(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
            >
              {typographyOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Call-to-action text */}
          <div className="space-y-2">
            <label
              htmlFor="cta-select"
              className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider"
            >
              4. Call-To-Action Button Label
            </label>
            <select
              id="cta-select"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
            >
              {ctaOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW & ACTIONS (renders 1st on mobile, 2nd on desktop) */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          {/* Notifications area */}
          {exportSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center gap-3 text-xs font-semibold text-emerald-700 animate-in fade-in duration-200">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{exportMessage}</span>
            </div>
          )}

          {/* Interactive Preview Container */}
          <div className="bg-slate-100 border border-slate-200 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[480px] sm:min-h-[550px] shadow-inner relative overflow-x-auto max-w-full">
            {/* Background grids */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider absolute top-4 left-6">
              Live Mockup Preview
            </span>

            <div className="shadow-2xl rounded-2xl overflow-hidden scale-90 sm:scale-100 transition-all duration-350">
              <div
                ref={previewRef}
                id="poster-canvas-target"
                className="overflow-hidden bg-white select-none transition-all duration-300"
                style={getOrientationStyles()}
              >
                <PosterTemplate
                  title={service.title}
                  category={service.category}
                  description={service.description}
                  startingPrice={service.starting_price}
                  priceUnit={service.price_unit}
                  location={locationStr}
                  contactNumbers={contacts}
                  portfolioUrl={portfolioUrl}
                  providerName={service.users?.full_name || "Verified Tutor"}
                  ratingAverage={service.rating_average || 5.0}
                  templateId={selectedTemplate}
                  typography={typography}
                  ctaText={ctaText}
                />
              </div>
            </div>
          </div>

          {/* Actions & Export Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              Export and Download Formats
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => exportPoster("png")}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer transition-colors duration-150"
              >
                {exportingFormat === "png" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileImage className="h-4 w-4" />
                )}
                <span>Download PNG</span>
              </button>

              <button
                onClick={() => exportPoster("jpg")}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer transition-colors duration-150"
              >
                {exportingFormat === "jpg" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileImage className="h-4 w-4" />
                )}
                <span>Download JPG</span>
              </button>

              <button
                onClick={() => exportPoster("pdf")}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-2xl shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer transition-colors duration-150"
              >
                {exportingFormat === "pdf" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => exportPoster("share")}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-2xl shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer transition-colors duration-150"
              >
                {exportingFormat === "share" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                <span>Share Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
