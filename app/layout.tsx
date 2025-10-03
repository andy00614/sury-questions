import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Survey Question Platform",
    template: "%s | Survey Question Platform"
  },
  description: "Professional survey and market research platform with interactive prototype testing capabilities. Collect valuable user feedback through engaging questionnaires and prototype experiences.",
  keywords: [
    "survey",
    "questionnaire",
    "market research",
    "user experience",
    "prototype testing",
    "feedback collection",
    "data analytics",
    "user research"
  ],
  authors: [{ name: "Survey Question Platform" }],
  creator: "Survey Question Platform",
  publisher: "Survey Question Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Survey Question Platform",
    title: "Survey Question Platform - Professional Market Research Tool",
    description: "Create engaging surveys with interactive prototype testing. Collect valuable user feedback and insights for your market research.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Survey Question Platform - Market Research Tool",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Survey Question Platform - Professional Market Research Tool",
    description: "Create engaging surveys with interactive prototype testing. Collect valuable user feedback and insights for your market research.",
    images: ["/og-image.png"],
    creator: "@surveyplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.svg" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
