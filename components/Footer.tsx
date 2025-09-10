"use client"

import { Search } from "lucide-react"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">

          {/* Logo + About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SEO Audit Pro</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional SEO analysis tools to help businesses improve their search engine
              rankings and online visibility.
            </p>
          </div>

          {/* Company Links */}
          <div className="xl-mx-20">
            <h3 className="font-semibold text-foreground text-base mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground text-base mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Cookie Policy
                </a>
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
        <div className="pt-6 mt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          {/* Social Icons */}
          <div className="flex gap-4 mb-4 sm:mb-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm text-center sm:text-left">
            © 2025 SEO Audit Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
