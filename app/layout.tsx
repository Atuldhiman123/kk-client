import type { Metadata } from "next";
import { Outfit, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AiChatWidget } from "@/components/ai/AiChatWidget";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${outfit.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <AiChatWidget />
        </Providers>
      </body>
    </html>
  );
}
