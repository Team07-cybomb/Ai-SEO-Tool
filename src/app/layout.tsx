import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/components/context/UserContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "RankSEO - AI Powered SEO Tool",
  description: "Created by Cybomb",
  generator: "Cybomb",
  icons: {
    icon: "/icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} overflow-hidden`}>
        {/* Global Google AdSense Script */}
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4338634405797265"
          crossOrigin="anonymous"
        />

        <UserProvider>
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="overflow-y-scroll scrollbar-hide h-screen">
            {children}
               <Footer />
          </main>
  
        </UserProvider>
      </body>
    </html>
  );
}
