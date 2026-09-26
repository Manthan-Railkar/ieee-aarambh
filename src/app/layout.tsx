import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "IEEE - AARAMBH 2026",
  description:
    "Experience the cinematic commencement into campus life. Discover events, orientation schedules, culture, and opportunities at Aarambh.",
  keywords: ["IEEE", "Aarambh", "College Orientation", "Campus Walkthrough", "Freshers 2026", "Cinematic Experience"],
  icons: {
    icon: [
      { url: "/assets/ieee_logo.png", type: "image/png" },
    ],
    shortcut: "/assets/ieee_logo.png",
    apple: "/assets/ieee_logo.png",
  },
  openGraph: {
    title: "IEEE - AARAMBH 2026",
    description: "Experience the cinematic commencement into campus life.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
