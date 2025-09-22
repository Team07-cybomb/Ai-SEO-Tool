import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import Navbar from "@/components/Navbar"; // ✅ import navbar
import Footer from "@/components/Footer"; // ✅ import footer
import { UserProvider } from "@/components/context/UserContext";
export const metadata: Metadata = {
  title: "AI SEO Audit",
  description: "Created by Cybomb",
  generator: "Cybomb",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <UserProvider>
          {/* ✅ Navbar and Footer must be inside the provider */}
          <Navbar />

          {/* ✅ Page Content */}
          <main>{children}</main>

          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
