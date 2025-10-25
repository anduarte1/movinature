import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "movinature - Outdoor Activities for Kids & Families",
    template: "%s | movinature",
  },
  description: "Discover and book amazing outdoor activities and physical experiences for kids and families. From hiking and climbing to water sports and camping - find the perfect adventure.",
  keywords: ["outdoor activities", "kids activities", "family activities", "nature experiences", "physical activities", "hiking", "camping", "water sports", "climbing"],
  authors: [{ name: "movinature" }],
  creator: "movinature",
  publisher: "movinature",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://movinature.com",
    siteName: "movinature",
    title: "movinature - Outdoor Activities for Kids & Families",
    description: "Discover and book amazing outdoor activities and physical experiences for kids and families.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "movinature - Outdoor Activities Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "movinature - Outdoor Activities for Kids & Families",
    description: "Discover and book amazing outdoor activities and physical experiences for kids and families.",
    images: ["/og-image.jpg"],
    creator: "@movinature",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // TODO: Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics gaId={gaId} />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
