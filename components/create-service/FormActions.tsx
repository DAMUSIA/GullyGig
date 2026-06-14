"use client";

import React from "react";

interface FormActionsProps {
  onSaveDraft: () => void;
}

export default function FormActions({ onSaveDraft }: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <button
        type="button"
        onClick={onSaveDraft}
        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg font-sans"
      >
        Save as Draft
      </button>
      <button
        type="submit"
        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg font-sans"
      >
        Publish Service
      </button>
    </div>
  );
}