"use client";

import { useSearchParams } from "next/navigation";
import AuthPage from "@/components/AuthPage";
import { Suspense } from "react";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  return <AuthPage defaultMode={mode} />;
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
