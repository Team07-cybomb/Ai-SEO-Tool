import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// import { Analytics } from "@vercel/analytics/react";

 // ✅ for navigation
import "./globals.css";

export const metadata: Metadata = {
  title: "AI SEO Audit",
  description: "Created by Cybomb",
  generator: "Cybomb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
       

        {/* ✅ Page Content */}
        <main style={{ padding: "" }}>{children}</main>

        {/* ✅ Analytics
        <Analytics /> */}
      </body>
    </html>
  );
}
