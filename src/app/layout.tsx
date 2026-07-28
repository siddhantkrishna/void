import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Starfield from "@/components/starfield";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SiddhantKrishna's Void",
    template: "%s | SiddhantKrishna's Void",
  },
  description:
    "Thoughts at the edge of technology, philosophy, intelligence, and the future.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SiddhantKrishna's Void",
    title: "SiddhantKrishna's Void",
    description:
      "Thoughts at the edge of technology, philosophy, intelligence, and the future.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiddhantKrishna's Void",
    description:
      "Thoughts at the edge of technology, philosophy, intelligence, and the future.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-void-black text-void-white antialiased font-sans min-h-screen">
        <Starfield />
        <Navbar isAdmin={isAdmin} />
        <main className="relative z-10 pt-16 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
