"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/components/context/UserContext"; // ✅ use context

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledPastBanner, setIsScrolledPastBanner] = useState(false);

  const { user, setUser } = useUser(); // ✅ reactive user
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastBanner(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // update context immediately
    router.push("/"); // redirect
  };

  // Hide Navbar on /profile route
  if (pathname.startsWith("/profile")) return null;

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
            <Link href={"/"}>
              <Image
                src="/SEO_LOGO.png"
                alt="SEO-AUDIT LOGO"
                width={100}
                height={35}
                priority
                className={isScrolledPastBanner ? "opacity-90" : "opacity-100"}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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

            {!user ? (
              <>
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
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <Avatar className="cursor-pointer w-9 h-9 ring-2 ring-primary">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-primary text-white">
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu
                    className={`w-5 h-5 ${
                      isScrolledPastBanner ? "text-foreground" : "text-gray-900"
                    }`}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="mx-5 flex flex-col">
                    <Link
                      href="/pricing"
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/about-us"
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>

                    {!user ? (
                      <div className="flex flex-row gap-3 pt-4">
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-1/2 bg-transparent"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button className="w-1/2">Get Started</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 mt-4">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Avatar className="w-10 h-10 ring-2 ring-primary">
                            {user.image ? (
                              <AvatarImage src={user.image} alt={user.name} />
                            ) : (
                              <AvatarFallback className="bg-primary text-white">
                                {user.name?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    )}
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
