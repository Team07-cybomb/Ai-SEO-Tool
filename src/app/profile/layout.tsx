"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the URL contains a token from a social login redirect
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      // Replace the URL to remove the token from the address bar
      router.replace("/profile");
      // The rest of the logic will run on the subsequent render
    }

    // After the token is handled, check for an authenticated session
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Show a loading state or nothing while checking authentication
  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="lg:hidden h-16"></div> {/* Spacer for mobile menu button */}
        {children}
      </main>
    </div>
  );
}