import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Layout from "./components/layout/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smart City Command Center - AI-Powered Urban Management",
  description: "Transform your city with AI-powered urban management. Real-time analytics, predictive insights, and automated decision-making for smarter cities.",
  keywords: ["smart city", "AI", "urban management", "traffic optimization", "environmental monitoring"],
  authors: [{ name: "Smart City AI" }],
  openGraph: {
    title: "Smart City Command Center",
    description: "AI-powered platform for intelligent urban management",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart City Command Center",
    description: "Transform your city with AI-powered urban management",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
