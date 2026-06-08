"use client";

import React, { useState } from "react";
import { X, MapPin, Phone } from "lucide-react";

interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  location: string;
  contact: string;
  postedDate: string;
  image?: string;
}

const categoryColors: Record<string, string> = {
  Tutor: "bg-blue-100 text-blue-700",
  Tailor: "bg-orange-100 text-orange-700",
  "Car washing": "bg-purple-100 text-purple-700",
  Cooking: "bg-orange-100 text-orange-700",
  Cleaning: "bg-green-100 text-green-700",
  Others: "bg-gray-100 text-gray-700",
};

const mockServices: Service[] = [
  {
    id: "1",
    category: "Tutor",
    title: "Maths Tuition (Class 8-10)",
    description:
      "2 hours daily personalized sessions focused on competitive base and board exams with weekly assessments.",
    price: "₹ 1500/month",
    location: "Andheri East",
    contact: "+91 98765 43210",
    postedDate: "Posted 2 days",
    image: "/api/placeholder/200/150",
  },
  {
    id: "2",
    category: "Cooking",
    title: "Daily Home Tiffin",
    description:
      "Fresh lunch and dinner service Mon-Fri. Healthy, home-cooked food delivered to your office or home.",
    price: "₹ 2500/month",
    location: "Vile Parle West",
    contact: "+91 99887 66554",
    postedDate: "Posted 1 week",
    image: "/api/placeholder/200/150",
  },
  {
    id: "3",
    category: "Tailor",
    title: "Blouse & Dress Stitching",
    description:
      "Expert tailoring for ethnic wear. Custom fitting and design available. Doorstep pickup and delivery.",
    price: "Negotiable",
    location: "Bandra West",
    contact: "+91 87654 32109",
    postedDate: "Posted 3 days",
    image: "/api/placeholder/200/150",
  },
];

export default function CreateServicePage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [formData, setFormData] = useState({
    category: "",
    customCategory: "",
    title: "",
    description: "",
    price: "",
    location: "",
    contact: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.category ||
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.location ||
      !formData.contact
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.category === "Others" && !formData.customCategory) {
      alert("Please enter a custom category");
      return;
    }

    // Create new service
    const newService: Service = {
      id: Date.now().toString(),
      category:
        formData.category === "Others"
          ? formData.customCategory
          : formData.category,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      location: formData.location,
      contact: formData.contact,
      postedDate: "Posted just now",
      image: "/api/placeholder/200/150",
    };

    // Add to top of list
    setServices((prev) => [newService, ...prev]);

    // Reset form
    setFormData({
      category: "",
      customCategory: "",
      title: "",
      description: "",
      price: "",
      location: "",
      contact: "",
    });
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  const getCategoryColor = (category: string): string => {
    return categoryColors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a New Service
          </h1>
          <p className="text-gray-600 mb-8">
            Share your skill - start earning from home
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select a category</option>
                <option value="Tutor">Tutor</option>
                <option value="Tailor">Tailor</option>
                <option value="Car washing">Car washing</option>
                <option value="Cooking">Cooking</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Custom Category (shown when "Others" is selected) */}
            {formData.category === "Others" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Category
                </label>
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleInputChange}
                  placeholder="Enter your service category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            )}

            {/* Service Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Home Tiffin Service for Office"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Price and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="₹ 500/month or Negotiable"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Andheri East, Mumbai"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Your 10-digit mobile number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Publish Service
            </button>
          </form>
        </div>

        {/* Services List Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Published Services
          </h2>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-blue-600 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6 flex gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                            service.category
                          )}`}
                        >
                          {service.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {service.postedDate}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                        aria-label="Delete service"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{service.price}</span>
                        <span>/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={16} className="text-gray-500" />
                        <span>{service.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">
                  No services published yet. Create your first service above!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
