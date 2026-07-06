"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Navbar } from "@/components/dashboard/navbar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = () => setCollapsed((prev) => !prev)
  const toggleMobile = () => setMobileOpen((prev) => !prev)

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={toggleMobile}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-in-left">
            <Sidebar collapsed={false} onToggle={toggleMobile} />
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 left-[13.5rem] z-50 h-8 w-8 rounded-full bg-background shadow-md lg:hidden"
              onClick={toggleMobile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      <div
        className={cn(
          "transition-all duration-300 relative",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Navbar onToggleSidebar={toggleMobile} />
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}
