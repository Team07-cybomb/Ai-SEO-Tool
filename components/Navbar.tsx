"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastBanner(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolledPastBanner
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <Link href={"/"}><span
              className={`text-xl font-bold ${
                isScrolledPastBanner ? "text-foreground" : "text-gray-900"
              }`}
            >
              SEO Audit Pro
            </span></Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className={`transition-colors ${
                isScrolledPastBanner
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Pricing
            </Link>
            {/* <Link
              href="/support"
              className={`transition-colors ${
                isScrolledPastBanner
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Support
            </Link> */}
            <Link
              href="/about-us"
              className={`transition-colors ${
                isScrolledPastBanner
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              About Us
            </Link>
            <Button
                asChild
                variant={isScrolledPastBanner ? "outline" : "ghost"}
                size="sm"
            >
                <Link href="/login">Sign In</Link>
            </Button>

            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu
                    className={`w-5 h-5 ${
                      isScrolledPastBanner
                        ? "text-foreground"
                        : "text-gray-900"
                    }`}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px]"
              >
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="mx-3 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <Link href={"/"}><span
              className={`text-xl font-bold ${
                isScrolledPastBanner ? "text-foreground" : "text-gray-900"
              }`}
            >
              SEO Audit Pro
            </span></Link>
                  </div>
                  <div className="mx-5 flex flex-col">
                    <Link
                      href="/pricing"
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/support"
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Support
                    </Link>
                    <Link
                      href="/about-us"
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <div className="flex flex-row gap-3 pt-4">
                      <Button variant="outline" className="w-1/2 bg-transparent">
                        Sign In
                      </Button>
                      <Button className="w-1/2">Get Started</Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
