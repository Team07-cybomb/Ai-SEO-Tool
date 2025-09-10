"use client"

import { Search } from "lucide-react"
import Link from "next/link"


export default function Footer() {
  

  return (
    <footer className="bg-muted border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">

          {/* Logo + About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <Link href={"/"}>
                <span className={`text-xl font-bold text-foreground text-gray-900`}>
                  SEO Audit Pro
                </span>
              </Link>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional SEO analysis tools to help businesses improve their search engine
              rankings and online visibility.
            </p>
          </div>

          {/* Company Links */}
          <div className="lg:flex lg:justify-center">
            <div>
              <h3 className="font-semibold text-foreground text-base mb-3">Company</h3>
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
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-of-services" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">Subscribe</h3>
            <form className="flex max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-border rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-sm rounded-r-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 mt-6 border-t border-border">
          <p className="text-muted-foreground text-sm text-center">
            © 2025 SEO Audit Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
