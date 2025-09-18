"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  User,
  LayoutDashboard,
  FileText,
  History,
  CreditCard,
  HelpCircle,
  Search,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/profile",
    icon: User,
  },
  {
    title: "Dashboard",
    href: "/profile/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    href: "/profile/reports",
    icon: FileText,
  },
  {
    title: "History",
    href: "/profile/history",
    icon: History,
  },
  {
    title: "Purchase/Billing",
    href: "/profile/billing",
    icon: CreditCard,
  },
  {
    title: "Support",
    href: "/profile/support",
    icon: HelpCircle,
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  // Handle sign-out logic
  const handleSignOut = async () => {
     console.log("Sign out clicked");
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (token) {
        // Call backend logout API
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Always clear tokens from storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // Redirect to the sign-in page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: clear tokens + redirect anyway
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">
            SEO Audit Pro
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
            
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ padding: "20px 0px" }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                )}
                style={{ margin: "5px 0px" }}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">
              JD
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              John Doe
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              john@example.com
            </p>
          </div>
        </div>
        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block w-64 bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </div>
    </>
  );
}
