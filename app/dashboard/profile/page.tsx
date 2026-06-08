"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Edit, 
  Clock, 
  CheckCircle, 
  XCircle,
  Award,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  MessageCircle,
  ThumbsUp,
  Eye,
  TrendingUp,
  X,
  Camera,
  Save
} from "lucide-react";

// Define types
interface Service {
  id: number;
  title: string;
  level: string;
  price: string;
  icon: string;
  active: boolean;
}

interface AvailabilitySlot {
  day: string;
  time: string;
  available: boolean;
}

interface VerificationItem {
  label: string;
  verified: boolean;
}

interface ProfileData {
  name: string;
  location: string;
  age: string;
  joined: string;
  about: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("services");
  
  // Services state
  const [services, setServices] = useState<Service[]>([
    { id: 1, title: "Maths Tutor", level: "Classes 6 - 10", price: "300", icon: "📐", active: true },
    { id: 2, title: "Science Tutor", level: "Classes 6 - 10", price: "300", icon: "🔬", active: true },
    { id: 3, title: "Homework Help", level: "All Subjects", price: "250", icon: "📚", active: true },
  ]);
  const [editingService, setEditingService] = useState<number | null>(null);
  const [editServiceData, setEditServiceData] = useState({ title: "", level: "", price: "" });
  
  // Availability state
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { day: "Monday - Friday", time: "5:00 PM - 8:00 PM", available: true },
    { day: "Saturday", time: "10:00 AM - 1:00 PM", available: true },
    { day: "Sunday", time: "Not Available", available: false },
  ]);
  const [showEditAvailability, setShowEditAvailability] = useState(false);
  const [tempAvailability, setTempAvailability] = useState<AvailabilitySlot[]>([...availability]);
  
  // Verification state
  const [verification] = useState<VerificationItem[]>([
    { label: "Phone Verified", verified: true },
    { label: "Email Verified", verified: true },
    { label: "ID Verification", verified: false },
    { label: "Background Check", verified: false },
  ]);
  
  // Edit profile modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Divya Sharma",
    location: "Andheri West, Mumbai",
    age: "22",
    joined: "May 2024",
    about: "I am a passionate tutor with 2+ years of experience teaching Mathematics and Science to students of classes 6-10. My teaching methodology focuses on concept clarity with regular practice sessions and doubt clearing."
  });

  const stats: Stat[] = [
    { label: "Students Taught", value: "45+", icon: BookOpen, color: "blue" },
    { label: "Hours Completed", value: "320", icon: Clock, color: "green" },
    { label: "5-Star Reviews", value: "28", icon: Star, color: "yellow" },
    { label: "Satisfaction Rate", value: "98%", icon: ThumbsUp, color: "purple" },
  ];

  // Service functions
  const deleteService = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const toggleServiceStatus = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };

  const startEditService = (service: Service) => {
    setEditingService(service.id);
    setEditServiceData({
      title: service.title,
      level: service.level,
      price: service.price
    });
  };

  const saveEditService = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, ...editServiceData } : service
    ));
    setEditingService(null);
  };

  const cancelEditService = () => {
    setEditingService(null);
    setEditServiceData({ title: "", level: "", price: "" });
  };

  // Availability functions
  const updateAvailability = () => {
    setAvailability([...tempAvailability]);
    setShowEditAvailability(false);
  };

  const toggleDayAvailability = (index: number) => {
    const updated = [...tempAvailability];
    updated[index].available = !updated[index].available;
    if (!updated[index].available) {
      updated[index].time = "Not Available";
    } else {
      updated[index].time = updated[index].day === "Sunday" ? "10:00 AM - 2:00 PM" : "5:00 PM - 8:00 PM";
    }
    setTempAvailability(updated);
  };

  const updateTimeSlot = (index: number, time: string) => {
    const updated = [...tempAvailability];
    updated[index].time = time;
    setTempAvailability(updated);
  };

  // Verification functions
  const startVerification = (item: VerificationItem) => {
    alert(`Starting ${item.label} verification process...`);
  };

  // Quick Actions
  const quickActions = [
    { label: "Account Settings", icon: Settings, action: () => alert("Opening Account Settings...") },
    { label: "Message Center", icon: MessageCircle, action: () => alert("Opening Message Center...") },
    { label: "View Analytics", icon: Eye, action: () => alert("Opening Analytics Dashboard...") },
    { label: "Logout", icon: LogOut, action: () => {
      if (confirm("Are you sure you want to logout?")) {
        router.push("/login");
      }
    } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl sm:text-3xl font-bold text-white">DS</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-4 border-white">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{profileData.name}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">⭐ Verified Provider</span>
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">🏆 Top Rated</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> Phone</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> Email</span>
                        <span className="flex items-center gap-1 break-words"><MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" /> {profileData.location}</span>
                        <span className="flex items-center gap-1 whitespace-nowrap"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" /> Joined {profileData.joined}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditProfile(true)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium whitespace-nowrap"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Edit</span>
                  </motion.button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl"
                    >
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-blue-600" />
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500 break-words">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* About Me Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                About Me
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">{profileData.about}</p>
            </motion.div>

            {/* Tabs for Services and Reviews */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                {["services", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 sm:py-4 text-center font-medium transition-all relative text-sm sm:text-base ${
                      activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "services" && (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 sm:p-6"
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {services.map((service) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300"
                        >
                          {editingService === service.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editServiceData.title}
                                onChange={(e) => setEditServiceData({...editServiceData, title: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Service title"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={editServiceData.level}
                                onChange={(e) => setEditServiceData({...editServiceData, level: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Level"
                              />
                              <input
                                type="text"
                                value={editServiceData.price}
                                onChange={(e) => setEditServiceData({...editServiceData, price: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Price"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEditService(service.id)}
                                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditService}
                                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className="text-xl sm:text-2xl">{service.icon}</div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{service.title}</h4>
                                  <p className="text-gray-500 text-xs sm:text-sm">{service.level}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-2">
                                    <span className="text-xl sm:text-2xl font-bold text-blue-600">₹{service.price}</span>
                                    <span className="text-xs sm:text-sm text-gray-500">/ hour</span>
                                    <button
                                      onClick={() => toggleServiceStatus(service.id)}
                                      className={`text-xs px-2 py-0.5 sm:py-1 rounded-full ${
                                        service.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {service.active ? "Active" : "Inactive"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditService(service)}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteService(service.id)}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 sm:p-6"
                  >
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { name: "Priya Verma", rating: 5, comment: "Very good teacher! My son has improved a lot in Maths.", time: "2 weeks ago" },
                        { name: "Rohit Mehta", rating: 5, comment: "Explains concepts very clearly and is very patient.", time: "1 month ago" },
                        { name: "Anjali Patil", rating: 5, comment: "Highly recommended. Very punctual and dedicated.", time: "1 month ago" },
                      ].map((review, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-b border-gray-100 pb-3 sm:pb-4 last:border-0"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">{review.name}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                ))}
                                <span className="text-xs text-gray-500 ml-2">{review.time}</span>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm">Reply</button>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm mt-2 break-words">{review.comment}</p>
                        </motion.div>
                      ))}
                      
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-gray-900 text-sm sm:text-base">4.9 out of 5</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">Based on 32 reviews</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Availability
                </h3>
                <button
                  onClick={() => {
                    setTempAvailability([...availability]);
                    setShowEditAvailability(true);
                  }}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {availability.map((slot, idx) => (
                  <div key={idx} className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm">
                    <span className="text-gray-600">{slot.day}</span>
                    <span className={slot.available ? "text-gray-900 font-medium" : "text-gray-400"}>{slot.time}</span>
                    {slot.available ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Service Area Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Service Area
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Andheri West", "Jogeshwari", "Goregaon", "Versova"].map((area, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs sm:text-sm rounded-lg"
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                Can travel up to 5 km
              </div>
            </motion.div>

            {/* Why Choose Me Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Why Choose Me
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Friendly & patient approach",
                  "Regular doubt solving",
                  "Focus on concept clarity",
                  "Flexible timings",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-700"
                  >
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span className="break-words">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Verification Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Verification Status
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {verification.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    {item.verified ? (
                      <span className="text-green-600 flex items-center gap-1 whitespace-nowrap"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Verified</span>
                    ) : (
                      <button
                        onClick={() => startVerification(item)}
                        className="text-orange-500 flex items-center gap-1 hover:text-orange-600 transition whitespace-nowrap"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Verify
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 5 }}
                    onClick={action.action}
                    className="w-full flex items-center justify-between py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 transition-colors group text-xs sm:text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <action.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {action.label}
                    </span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditProfile(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Profile
              </h3>
              <button 
                onClick={() => setShowEditProfile(false)} 
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-white">DS</span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-blue-700 transition">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Click to change photo</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    About Me
                  </label>
                  <textarea
                    value={profileData.about}
                    onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex gap-3">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditProfile(false);
                  alert("Profile updated successfully!");
                }}
                className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Availability Modal */}
      {showEditAvailability && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditAvailability(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Availability</h3>
              <button onClick={() => setShowEditAvailability(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {tempAvailability.map((slot, idx) => (
                <div key={idx} className="space-y-2 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">{slot.day}</label>
                    <button
                      onClick={() => toggleDayAvailability(idx)}
                      className={`text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full ${
                        slot.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {slot.available ? "Available" : "Unavailable"}
                    </button>
                  </div>
                  {slot.available && (
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) => updateTimeSlot(idx, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g., 5:00 PM - 8:00 PM"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={updateAvailability}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition font-medium text-sm sm:text-base"
              >
                Save Availability
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}