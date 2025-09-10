import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="lg:hidden h-16"></div> {/* Spacer for mobile menu button */}
        {children}
      </main>
    </div>
  )
}
