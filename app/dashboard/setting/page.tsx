"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Lock,
  LogOut,
  Trash2,
  Bell,
  MessageSquare,
  Settings as SettingsIcon,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Globe,
  Clock,
  Edit2,
  HelpCircle,
  Smartphone,
  PhoneCall,
  TrendingUp,
  Star,
  X,
  Save,
} from "lucide-react";

// Mock user data
const userData = {
  fullName: "Divya Sharma",
  email: "divya.sharma@gmail.com",
  phone: "+91 98765 43210",
  location: "Andheri West, Mumbai, Maharashtra",
  bio: "Maths tutor with 2 years of experience. I love teaching and helping students learn. I specialize in making complex math concepts simple and fun for students of all ages.",
  defaultServiceArea: "Andheri West, Jogeshwari, Goregaon",
  travelDistance: "Up to 5 km",
  availabilityStatus: "Available",
  profileVisibility: "Everyone",
  twoFactorEnabled: false,
  activeSessions: 1,
};

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    serviceInquiries: true,
    newReviews: true,
    bookingRequests: true,
    promotionalUpdates: false,
  });

  const [communication, setCommunication] = useState({
    showPhoneNumber: true,
    allowWhatsApp: true,
    allowDirectCalls: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Edit Profile State
  const [editProfileData, setEditProfileData] = useState({
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    bio: userData.bio,
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCommunicationToggle = (key: keyof typeof communication) => {
    setCommunication((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    console.log("Password changed");
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleEditProfile = () => {
    // Update user data with edited values
    userData.fullName = editProfileData.fullName;
    userData.email = editProfileData.email;
    userData.phone = editProfileData.phone;
    userData.location = editProfileData.location;
    userData.bio = editProfileData.bio;

    console.log("Profile updated:", editProfileData);
    setShowEditProfileModal(false);
  };

  const handleLogout = () => {
    console.log("Logged out");
    setShowLogoutModal(false);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-500 ml-11">
            Manage your account, preferences and privacy settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Account Settings
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your personal information
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {/* Full Name */}
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Full Name
                        </p>
                        <p className="text-gray-900 font-medium mt-1">
                          {userData.fullName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditProfileModal(true)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Email Address
                        </p>
                        <p className="text-gray-900 mt-1">{userData.email}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Phone Number
                        </p>
                        <p className="text-gray-900 mt-1">{userData.phone}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Location
                        </p>
                        <p className="text-gray-900 mt-1">
                          {userData.location}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      Help Center
                    </button>
                  </div>
                </div>

                {/* Bio - Now as Paragraph */}
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Bio
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">
                          {userData.bio}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700 whitespace-nowrap ml-4">
                      Contact Support
                    </button>
                  </div>
                </div>

                {/* Security */}
                <div className="px-6 py-4 bg-blue-50/30">
                  <div className="flex gap-3 mb-4">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Security
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Keep your account safe
                      </p>
                    </div>
                  </div>

                  <div className="ml-8 space-y-3">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
                    >
                      Change Password
                    </button>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-900">Password</p>
                        <p className="text-xs text-gray-500">•••••••</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-900">
                          Two-Step Verification
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData.twoFactorEnabled ? "On" : "Off"}
                        </p>
                      </div>
                      <button className="text-blue-600 text-sm hover:text-blue-700">
                        {userData.twoFactorEnabled ? "Disable" : "Enable"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-900">Login Sessions</p>
                        <p className="text-xs text-gray-500">
                          {userData.activeSessions} active session
                        </p>
                      </div>
                      <button className="text-blue-600 text-sm hover:text-blue-700">
                        Manage
                      </button>
                    </div>

                    <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                      <p className="text-xs text-blue-800 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        Add a clear bio and keep your contact information
                        updated to get more customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Manage how you receive notifications
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      New Service Inquiries
                    </p>
                    <p className="text-sm text-gray-500">
                      Get notified when someone contacts you
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle("serviceInquiries")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.serviceInquiries
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.serviceInquiries
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">New Reviews</p>
                    <p className="text-sm text-gray-500">
                      Get notified when you receive a review
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle("newReviews")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.newReviews ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.newReviews
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      Booking Requests
                    </p>
                    <p className="text-sm text-gray-500">
                      Get notified about new booking requests
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle("bookingRequests")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.bookingRequests
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.bookingRequests
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      Promotional Updates
                    </p>
                    <p className="text-sm text-gray-500">
                      Receive tips and updates from Kaamoo Connect
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationToggle("promotionalUpdates")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.promotionalUpdates
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.promotionalUpdates
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Communication Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Communication
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Choose how customers can contact you
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      Show Phone Number
                    </p>
                    <p className="text-sm text-gray-500">
                      Display your phone number on your profile
                    </p>
                  </div>
                  <button
                    onClick={() => handleCommunicationToggle("showPhoneNumber")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      communication.showPhoneNumber
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        communication.showPhoneNumber
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <p className="font-medium text-gray-900">
                        Allow WhatsApp Contact
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Allow customers to contact you on WhatsApp
                    </p>
                  </div>
                  <button
                    onClick={() => handleCommunicationToggle("allowWhatsApp")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      communication.allowWhatsApp
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        communication.allowWhatsApp
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-blue-600" />
                      <p className="font-medium text-gray-900">
                        Allow Direct Calls
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Allow customers to call you directly
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCommunicationToggle("allowDirectCalls")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      communication.allowDirectCalls
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        communication.allowDirectCalls
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Service Preferences */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Service Preferences
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set your service preferences
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Default Service Area
                  </p>
                  <p className="text-sm text-gray-900">
                    {userData.defaultServiceArea}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Travel Distance
                  </p>
                  <p className="text-sm text-gray-900">
                    {userData.travelDistance}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Availability Status
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    <Clock className="w-3 h-3" />
                    {userData.availabilityStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Privacy
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Manage your privacy settings
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Who can view your profile
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Control profile visibility
                    </p>
                  </div>
                  <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>Everyone</option>
                    <option>Only Verified Users</option>
                    <option>Only Me</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h2 className="text-base font-semibold text-red-900">
                    Danger Zone
                  </h2>
                </div>
                <p className="text-xs text-red-500 mt-1">
                  Irreversible account actions
                </p>
              </div>

              <div className="p-5 space-y-3">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Logout
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      Delete Account
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <h3 className="font-semibold">Pro Tip</h3>
              </div>
              <p className="text-sm text-white/90">
                Complete your profile and verify your contact info to get more
                booking requests from customers in your area!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowEditProfileModal(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white sticky top-0 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="w-7 h-7 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Profile
                  </h2>
                </div>
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="px-8 py-8 space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editProfileData.fullName}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editProfileData.email}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editProfileData.phone}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editProfileData.location}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editProfileData.bio}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        bio: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base resize-none"
                    placeholder="Tell us about yourself"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Share your experience, skills, and what makes you unique.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 px-8 py-6 bg-gray-50 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutModal(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <LogOut className="w-7 h-7 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Logout</h2>
                </div>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="px-8 py-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Are you sure you want to logout from your account?
                </p>
                <p className="text-gray-500 text-base mt-3">
                  You will need to login again to access your account.
                </p>
              </div>

              <div className="flex gap-4 px-8 py-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors text-base shadow-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Trash2 className="w-7 h-7 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Delete Account
                  </h2>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="px-8 py-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Are you sure you want to delete your account?
                </p>
                <div className="p-5 bg-red-50 rounded-xl border-2 border-red-200">
                  <p className="text-red-700 font-semibold text-base">
                    ⚠️ This action cannot be undone.
                  </p>
                  <p className="text-red-600 text-base mt-2">
                    All your data, services, and bookings will be permanently
                    deleted.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 px-8 py-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors text-base shadow-md"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowPasswordModal(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Lock className="w-7 h-7 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Change Password
                  </h2>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="px-8 py-8 space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex gap-4 px-8 py-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow-md"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
