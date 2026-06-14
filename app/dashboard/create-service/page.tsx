"use client";

import React, { useState } from "react";
import ServiceInformation from "@/components/create-service/ServiceInformation";
import Pricing from "@/components/create-service/Pricing";
import Location from "@/components/create-service/Location";
import Availability from "@/components/create-service/Availability";
import AdditionalDetails from "@/components/create-service/AdditionalDetails";
import VerificationAndTrust from "@/components/create-service/VerificationAndTrust";
import FormActions from "@/components/create-service/FormActions";
import { ServiceFormData } from "@/lib/service.types";

// Constants
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EXPERIENCE_OPTIONS = [
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5-8 Years",
  "8+ Years",
];
const PRICE_TYPES = [
  { value: "hourly" as const, label: "Per Hour", placeholder: "₹ 300 / hour" },
  {
    value: "fixed" as const,
    label: "Fixed Price",
    placeholder: "₹ 5000 / month",
  },
];

const CATEGORIES = [
  {
    value: "Tutor",
    label: "Tutor",
    subCategories: ["Math Tutor", "Science Tutor", "English Tutor", "Language Tutor"],
  },
  {
    value: "Tailor",
    label: "Tailor",
    subCategories: ["Blouse Stitching", "Dress Stitching", "Alterations"],
  },
  {
    value: "Car washing",
    label: "Car Washing",
    subCategories: ["Exterior Wash", "Full Service", "Interior Detailing"],
  },
  {
    value: "Cooking",
    label: "Cooking",
    subCategories: ["Home Tiffin", "Event Catering", "Meal Prep"],
  },
  {
    value: "Cleaning",
    label: "Cleaning",
    subCategories: ["Home Cleaning", "Office Cleaning", "Deep Cleaning"],
  },
];

export default function CreateServicePage() {
  const [formData, setFormData] = useState<ServiceFormData>({
    category: "Tutor",
    subCategory: "",
    description: "",
    experience: "",
    priceType: "hourly",
    price: "",
    city: "Mumbai",
    locality: "",
    pincode: "",
    selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    fromTime: "17:00",
    toTime: "21:00",
    languages: "English, Hindi",
    qualifications: "",
    shortBio: "",
    phoneVerified: true,
    emailVerified: true,
    idVerified: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ServiceFormData) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev: ServiceFormData) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d: string) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Service published successfully! (Demo)");
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData);
    alert("Draft saved! (Demo)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-sans tracking-tight">
            Create Service
          </h1>
          <p className="text-gray-600 mt-2 font-sans">
            Fill in the details below to list your service and reach more customers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ServiceInformation
            formData={formData}
            CATEGORIES={CATEGORIES}
            EXPERIENCE_OPTIONS={EXPERIENCE_OPTIONS}
            onInputChange={handleInputChange}
          />

          <Pricing
            formData={formData}
            PRICE_TYPES={PRICE_TYPES}
            onInputChange={handleInputChange}
          />

          <Location
            formData={formData}
            onInputChange={handleInputChange}
          />

          <Availability
            formData={formData}
            WEEKDAYS={WEEKDAYS}
            onDayToggle={handleDayToggle}
            onInputChange={handleInputChange}
          />

          <AdditionalDetails
            formData={formData}
            onInputChange={handleInputChange}
          />

          <VerificationAndTrust formData={formData} />

          <FormActions onSaveDraft={handleSaveDraft} />
        </form>
      </div>
    </div>
  );
}