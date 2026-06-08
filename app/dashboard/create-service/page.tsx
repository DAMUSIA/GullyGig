"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Globe, 
  Award,
  CheckCircle,
  AlertCircle,
  Calendar,
  Image as ImageIcon,
  ChevronRight,
  Info
} from "lucide-react";
import Image from "next/image";

// --- Types ---
interface ServiceFormData {
  // Service Information
  category: string;
  subCategory: string;
  description: string;
  experience: string;
  // Pricing
  priceType: 'hourly' | 'fixed';
  price: string;
  // Location
  city: string;
  locality: string;
  pincode: string;
  // Availability
  selectedDays: string[];
  fromTime: string;
  toTime: string;
  // Additional Details
  languages: string;
  qualifications: string;
  shortBio: string;
  // Verification
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
}

interface ServicePreview {
  id: string;
  name: string;
  isVerified: boolean;
  title: string;
  category: string;
  price: string;
  rating: number;
  reviewCount: number;
  description: string;
  experience: string;
  location: string;
  availableDays: string[];
  availableTime: string;
  languages: string;
  image?: string;
}

// --- Constants ---
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EXPERIENCE_OPTIONS = ['0-1 Years', '1-3 Years', '3-5 Years', '5-8 Years', '8+ Years'];
const PRICE_TYPES = [
  { value: 'hourly' as const, label: 'Per Hour', placeholder: '₹ 300 / hour' },
  { value: 'fixed' as const, label: 'Fixed Price', placeholder: '₹ 5000 / month' }
];

// Category configurations
const CATEGORIES = [
  { value: 'Tutor', label: 'Tutor', subCategories: ['Math Tutor', 'Science Tutor', 'English Tutor', 'Language Tutor'] },
  { value: 'Tailor', label: 'Tailor', subCategories: ['Blouse Stitching', 'Dress Stitching', 'Alterations'] },
  { value: 'Car washing', label: 'Car Washing', subCategories: ['Exterior Wash', 'Full Service', 'Interior Detailing'] },
  { value: 'Cooking', label: 'Cooking', subCategories: ['Home Tiffin', 'Event Catering', 'Meal Prep'] },
  { value: 'Cleaning', label: 'Cleaning', subCategories: ['Home Cleaning', 'Office Cleaning', 'Deep Cleaning'] }
];

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Tutor: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    Tailor: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    "Car washing": "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    Cooking: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    Cleaning: "bg-gradient-to-r from-green-500 to-green-600 text-white",
  };
  return colors[category] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
};

// Helper to format availability text
const formatAvailability = (days: string[]): string => {
  if (days.length === 0) return 'Not specified';
  if (days.length === 7) return 'Available daily';
  if (days.length > 3) return `${days.length} days/week`;
  return days.join(', ');
};

// --- Main Component ---
export default function CreateServicePage() {
  // State for form data
  const [formData, setFormData] = useState<ServiceFormData>({
    category: 'Tutor',
    subCategory: '',
    description: '',
    experience: '',
    priceType: 'hourly',
    price: '',
    city: 'Mumbai',
    locality: '',
    pincode: '',
    selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    fromTime: '17:00',
    toTime: '21:00',
    languages: 'English, Hindi',
    qualifications: '',
    shortBio: '',
    phoneVerified: true,
    emailVerified: true,
    idVerified: false,
  });

  // State for service preview
  const [preview] = useState<ServicePreview>({
    id: 'preview-1',
    name: 'Priya Sharma',
    isVerified: true,
    title: 'Math Tutor for Classes 6-10',
    category: 'Tutor',
    price: '₹300 / hour',
    rating: 4.8,
    reviewCount: 24,
    description: 'I provide home and online tuition for Mathematics and Science for classes 6 to 10. Personalized learning and concept clarity is my priority.',
    experience: '3-5 Years',
    location: 'Andheri West, Mumbai',
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
    availableTime: '05:00 PM - 09:00 PM',
    languages: 'English, Hindi',
    image: '/api/placeholder/200/150',
  });

  // --- Event Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation would go here
    alert('Service published successfully! (Demo)');
  };

  const handleSaveDraft = () => {
    alert('Draft saved! (Demo)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header / Navigation Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-white/10 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent font-['Inter'] tracking-tight">
                Kaamao
              </h1>
              <span className="ml-2 text-sm text-blue-200 font-light">Mumbai, India</span>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <label htmlFor="search" className="sr-only">Search for services</label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search for services..."
                  className="w-full px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300"
                  aria-label="Search for services"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Create Service Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-['Inter'] tracking-tight">
                Create Service
              </h1>
              <p className="text-gray-600 mt-2 font-['Inter']">
                Fill in the details below to list your service and reach more customers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 font-['Inter']">
                  Service Information
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-['Inter']">Tell customers what service you provide</p>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Service Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Service Category"
                      title="Service Category"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subCategory" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Sub-category
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Sub-category"
                      title="Sub-category"
                    >
                      <option value="">Select a sub-category</option>
                      {CATEGORIES.find(c => c.value === formData.category)?.subCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="I provide home and online tuition for Mathematics and Science for classes 6 to 10. Personalized learning and concept clarity is my priority."
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Service Description"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Experience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Experience Level"
                      title="Experience Level"
                    >
                      <option value="">Select experience</option>
                      {EXPERIENCE_OPTIONS.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 font-['Inter']">
                  Pricing
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-['Inter']">Set your pricing details</p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100" role="note" aria-label="Pricing tip">
                  <p className="text-sm text-blue-800 font-['Inter']">💡 Pricing Tips: Research similar services in your area to set a competitive price.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="priceType" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Price Type
                    </label>
                    <select
                      id="priceType"
                      name="priceType"
                      value={formData.priceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Price Type"
                      title="Price Type"
                    >
                      {PRICE_TYPES.map(pt => (
                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Price Amount
                    </label>
                    <input
                      id="price"
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder={PRICE_TYPES.find(pt => pt.value === formData.priceType)?.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Price Amount"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 font-['Inter']">
                  Location
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-['Inter']">Where do you provide your services?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="locality" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Area / Locality
                    </label>
                    <input
                      id="locality"
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleInputChange}
                      placeholder="Andheri West"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Area or Locality"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Pincode
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400058"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 font-['Inter']">
                  Availability
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-['Inter']">When are you available?</p>
                
                <div className="mb-6">
                  <fieldset>
                    <legend className="block text-sm font-semibold text-gray-700 mb-3 font-['Inter']">Select Days</legend>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                            formData.selectedDays.includes(day)
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-pressed={formData.selectedDays.includes(day) ? "true" : "false"}
                          aria-label={`Toggle ${day}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fromTime" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      From
                    </label>
                    <input
                      id="fromTime"
                      type="time"
                      name="fromTime"
                      value={formData.fromTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Start time"
                    />
                  </div>
                  <div>
                    <label htmlFor="toTime" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      To
                    </label>
                    <input
                      id="toTime"
                      type="time"
                      name="toTime"
                      value={formData.toTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="End time"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 font-['Inter']">
                  Available Time: {formData.fromTime} to {formData.toTime}
                </p>
              </div>

              {/* Additional Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 font-['Inter']">
                  Additional Details (Optional)
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-['Inter']">Add more information to build trust</p>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="languages" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Languages Known
                    </label>
                    <input
                      id="languages"
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                      placeholder="English, Hindi, Marathi..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Languages Known"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="qualifications" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Qualifications / Certifications
                    </label>
                    <input
                      id="qualifications"
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      placeholder="B.Sc. Mathematics, B.Ed."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Qualifications or Certifications"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shortBio" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                      Short Bio
                    </label>
                    <textarea
                      id="shortBio"
                      name="shortBio"
                      value={formData.shortBio}
                      onChange={handleInputChange}
                      placeholder="I am passionate about teaching and helping students achieve their academic goals."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all duration-200 font-['Inter'] bg-white"
                      aria-label="Short Biography"
                    />
                  </div>
                </div>
              </div>

              {/* Verification & Trust */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 font-['Inter']">
                  Verification & Trust
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-['Inter']">Complete your verification to build more trust</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-green-600" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-700">Phone Verified</span>
                    </div>
                    <CheckCircle size={20} className="text-green-600" aria-label="Verified" />
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-4.5 h-4.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Email Verified</span>
                    </div>
                    <CheckCircle size={20} className="text-green-600" aria-label="Verified" />
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Award size={18} className="text-gray-500" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-700">ID Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={20} className="text-orange-500" aria-label="Not verified" />
                      <span className="text-xs font-semibold text-orange-600">Not Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg font-['Inter']"
                  aria-label="Save service as draft"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg font-['Inter']"
                  aria-label="Publish service listing"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Preview and Tips */}
          <aside className="w-80 flex-shrink-0 space-y-6">
            {/* Service Preview Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-2 text-lg font-['Inter']">Service Preview</h3>
              <p className="text-xs text-gray-500 mb-4 font-['Inter']">This is how customers will see your service</p>
              
              <div className="rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src={preview.image || '/api/placeholder/200/150'} 
                  alt={preview.title} 
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm font-['Inter']">{preview.name}</span>
                      {preview.isVerified && (
                        <CheckCircle size={14} className="text-blue-500" aria-label="Verified provider" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Verified</span>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 text-sm mb-2 font-['Inter']">{preview.title}</h4>
                  <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${getCategoryColor(preview.category)}`}>
                    {preview.category}
                  </span>
                  
                  <div className="mt-3">
                    <span className="font-bold text-blue-600 text-lg font-['Inter']">{preview.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" aria-label="Rating" />
                    <span className="text-sm font-semibold text-gray-700">{preview.rating}</span>
                    <span className="text-xs text-gray-500">({preview.reviewCount} reviews)</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2 font-['Inter']">{preview.description}</p>
                  
                  <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Award size={12} className="text-gray-500" aria-hidden="true" /> 
                      <span className="font-['Inter']">Experience: {preview.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-gray-500" aria-hidden="true" /> 
                      <span className="font-['Inter']">{preview.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gray-500" aria-hidden="true" /> 
                      <span className="font-['Inter']">Available: {formatAvailability(preview.availableDays)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-500" aria-hidden="true" /> 
                      <span className="font-['Inter']">{preview.availableTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="text-gray-500" aria-hidden="true" /> 
                      <span className="font-['Inter']">Languages: {preview.languages}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md font-['Inter']">
                    Contact Provider
                  </button>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-5 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg font-['Inter']">
                <Info size={18} className="text-blue-600" aria-hidden="true" /> Tips for better visibility
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <ImageIcon size={16} className="text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-gray-800 font-['Inter']">Add clear photos</span>
                    <p className="text-xs text-gray-600 mt-0.5">Services with photos get 3x more views</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-800 font-['Inter']">Write detailed description</span>
                    <p className="text-xs text-gray-600 mt-0.5">Explain your service and experience</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-800 font-['Inter']">Set competitive price</span>
                    <p className="text-xs text-gray-600 mt-0.5">Research and set the right price</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-gray-800 font-['Inter']">Complete verification</span>
                    <p className="text-xs text-gray-600 mt-0.5">Verified profiles get more trust</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-5 pt-4 border-t border-blue-200">
                <div className="bg-white/60 rounded-xl p-3">
                  <p className="text-xs text-gray-700 mb-2 font-['Inter']">Need Help? Check our guide to create the best service listing.</p>
                  <button className="text-blue-700 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-200 font-['Inter']">
                    View Guide <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}