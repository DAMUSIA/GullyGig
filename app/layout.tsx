import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: "LocalSkill Connect | Empower Your Skills, Earn Locally",
  description:
    "Connect with your neighbors and turn your everyday expertise into local opportunities. LocalSkill Connect is the hyperlocal service marketplace for your community.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "LocalSkill Connect | Empower Your Skills, Earn Locally",
    description:
      "Connect with your neighbors. Turn your skills into local opportunities. Find services near you or offer your expertise.",
    images: [{ url: "/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Google Fonts — Manrope */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
