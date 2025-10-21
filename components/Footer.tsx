"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2"; // ✅ SweetAlert2
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  // Function to handle form submission
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: data.message || "Subscription successful!",
          timer: 2000,
          showConfirmButton: false,
        });
        setEmail(""); // Clear the input field on success
      } else {
        Swal.fire({
          icon: "error",
          title: "Already Subscribed",
          text: data.message || "This email is already subscribed.",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to subscribe. Please try again.",
      });
    }
  };

  // Hide Footer for all routes starting with /profile
  if (pathname.startsWith("/profile")) {
    return null;
  }

  return (
    <footer className="bg-muted border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Top Section */}
        {/* Changed lg:grid-cols-4 to lg:grid-cols-5 to fit all items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo + About - Increased column span for better balance */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <Link href={"/"}>
                <Image
                  src="/SEO_LOGO.png"
                  alt="SEO-AUDIT LOGO"
                  width={100}
                  height={35}
                  priority
                  className="opacity-100"
                />
              </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional SEO analysis tools to help businesses improve their
              search engine rankings and online visibility.
            </p>
          </div>

          {/* Company Links - Removed unnecessary justify-center class */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/business-name-generator"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Business Name Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/audit"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Seo Audit Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/keyword-generator"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Keyword Generator Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/scraper"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Keyword Scraper Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-of-services"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">
              Subscribe
            </h3>
            <form className="flex max-w-sm" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-border rounded-l-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-sm rounded-r-md"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4 flex items-center gap-3 p-3">
              <div className="bg-blue-100 p-2.5 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-foreground text-base">
                  Contact Support
                </p>
                <a
                  href="mailto:info@rankseo.in" // Corrected the email address
                  className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors no-underline"
                >
                  info@rankseo.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 mt-6 border-t border-border">
          <p className="text-muted-foreground text-sm text-center">
            © 2025 Cybomb Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}