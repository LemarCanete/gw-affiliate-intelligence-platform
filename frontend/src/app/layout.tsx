import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from "@/components/Cookies";
import { GoogleAnalytics } from '@next/third-parties/google'

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_PRODUCTNAME,
  description: "Rank on Google. Get cited by AI. The SEO/GEO content platform that automates keyword research, article generation, and citation monitoring.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme = process.env.NEXT_PUBLIC_THEME
  if(!theme) {
    theme = "theme-sass3"
  }
  const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${theme} ${ubuntu.variable} font-sans`}>
      {children}
      <Analytics />
      <CookieConsent />
      { gaID && (
          <GoogleAnalytics gaId={gaID}/>
      )}

    </body>
    </html>
  );
}
