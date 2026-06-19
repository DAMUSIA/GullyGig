import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs font-semibold text-slate-400 animate-pulse uppercase tracking-wider">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}
