import fs from "fs";
import path from "path";
import { Suspense } from "react";
import LegalClientPage from "./LegalClientPage";

export default function LegalPage() {
  const privacyPath = path.join(process.cwd(), "docs", "content", "privacy_policy.md");
  const termsPath = path.join(process.cwd(), "docs", "content", "term_and_services.md");
  
  const privacyContent = fs.readFileSync(privacyPath, "utf-8");
  const termsContent = fs.readFileSync(termsPath, "utf-8");

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center font-[Manrope,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading Legal Pages...</span>
        </div>
      </div>
    }>
      <LegalClientPage privacyContent={privacyContent} termsContent={termsContent} />
    </Suspense>
  );
}
