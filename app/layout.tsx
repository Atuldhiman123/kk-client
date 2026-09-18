import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RatnaFloatingButton } from "@/components/layout/RatnaFloatingButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kundli Kendra | Authentic Vedic Astrology & Consultations",
  description:
    "Book a personalized astrology consultation with Kundli Kendra for career, marriage, love, business, health and more. Accurate predictions & confidential sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col overflow-x-hidden w-full">
        <Providers>
          {children}
          <RatnaFloatingButton />
        </Providers>
      </body>
    </html>
  );
}
