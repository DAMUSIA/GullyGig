// components/poster/PosterGenerator.tsx
"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

import PosterTemplate from "./PosterTemplate";
import { ServiceData } from "@/lib/api";

const templates = [
  { id: "business", name: "Modern Business" },
  { id: "local", name: "Local Service" },
  { id: "education", name: "Tutor & Education" },
  { id: "freelancer", name: "Freelancer Portfolio" },
  { id: "dark", name: "Premium Dark" },
  { id: "whatsapp", name: "WhatsApp Status" },
  { id: "instaStory", name: "Instagram Story" },
  { id: "instaPost", name: "Instagram Post" },
  { id: "flyer", name: "Flyer" },
  { id: "minimal", name: "Minimal Professional" },
];

const accentColors = [
  { id: "blue", label: "Blue", value: "#2563EB" }, // indigo-600
  { id: "navy", label: "Navy", value: "#1E3A8A" }, // indigo-900
  { id: "sky", label: "Sky", value: "#0EA5E9" }, // sky-500
  { id: "gradient", label: "Gradient", value: "linear-gradient(135deg, #2563EB, #0EA5E9)" },
];

const typographyOptions = [
  { id: "modern", label: "Modern" },
  { id: "professional", label: "Professional" },
  { id: "bold", label: "Bold" },
  { id: "minimal", label: "Minimal" },
];

export default function PosterGenerator({ service }: { service: ServiceData }) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [orientation, setOrientation] = useState("portrait");
  const [accent, setAccent] = useState(accentColors[0].id);
  const [typography, setTypography] = useState(typographyOptions[0].id);
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadImage = async (type: "png" | "jpg" | "pdf") => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { useCORS: true, scale: 2 });
    const dataUrl = canvas.toDataURL(`image/${type}`);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${service.title.replace(/\s+/g, "_")}_${selectedTemplate}.${type}`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-indigo-600">Create Advertisement Poster</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Generate professional marketing posters for your service in one click.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Turn your service portfolio into beautiful shareable advertisements for social media, WhatsApp, and print.
        </p>
      </header>

      {/* Control Panel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg glassmorphism">
        {/* Template selection */}
        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">Template</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        {/* Orientation */}
        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">Orientation</label>
          <select
            className="w-full p-2 border rounded"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
            <option value="square">Square</option>
          </select>
        </div>
        {/* Accent color */}
        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">Accent Color</label>
          <select
            className="w-full p-2 border rounded"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          >
            {accentColors.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        {/* Typography */}
        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">Typography</label>
          <select
            className="w-full p-2 border rounded"
            value={typography}
            onChange={(e) => setTypography(e.target.value)}
          >
            {typographyOptions.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Poster Preview */}
      <section className="flex justify-center">
        <div
          ref={previewRef}
          className="relative p-4 bg-white dark:bg-gray-900 rounded-xl shadow-xl glassmorphism"
          style={{
            width:
              orientation === "portrait"
                ? "350px"
                : orientation === "landscape"
                ? "500px"
                : "350px",
            height:
              orientation === "portrait"
                ? "500px"
                : orientation === "landscape"
                ? "350px"
                : "350px",
          }}
        >
          <PosterTemplate
            service={service}
            template={selectedTemplate}
            accent={accentColors.find((c) => c.id === accent)!.value}
            typography={typography}
          />
        </div>
      </section>

      {/* Download & Actions */}
      <section className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => downloadImage("png")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadImage("jpg")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
        >
          Download JPG
        </button>
        <button
          onClick={() => downloadImage("pdf")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
        >
          Download PDF
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Generate New Poster
        </button>
      </section>
    </div>
  );
}
