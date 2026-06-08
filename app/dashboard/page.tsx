"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Kaamao</h1>
        <p className="text-gray-600 mt-2">Your service marketplace dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
          <p className="text-xs text-green-600 mt-2">↑ 2 new this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">5</p>
          <p className="text-xs text-gray-500 mt-2">3 pending confirmation</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹12,500</p>
          <p className="text-xs text-green-600 mt-2">↑ ₹2,500 this month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">24 ★4.8</p>
          <p className="text-xs text-gray-500 mt-2">12 positive reviews</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Maths Tutoring</p>
                <p className="text-sm text-gray-500">Rahul Sharma • Today, 10:00 AM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Science Tutoring</p>
                <p className="text-sm text-gray-500">Priya Patel • Tomorrow, 3:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Confirmed</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Homework Help</p>
                <p className="text-sm text-gray-500">Amit Kumar • Yesterday, 5:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Completed</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            <div className="pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <span className="text-sm font-medium text-gray-900">Priya Verma</span>
              </div>
              <p className="text-sm text-gray-600">Very good teacher! My son has improved a lot.</p>
              <p className="text-xs text-gray-400 mt-1">2 weeks ago</p>
            </div>
            <div className="pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <span className="text-sm font-medium text-gray-900">Rohit Mehta</span>
              </div>
              <p className="text-sm text-gray-600">Explains concepts very clearly and patiently.</p>
              <p className="text-xs text-gray-400 mt-1">1 month ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}