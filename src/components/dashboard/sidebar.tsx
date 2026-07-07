"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard as CardIcon,
  KeyRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { User } from "@/types"

type SafeUser = Omit<User, "password">

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SafeUser | null>(null)

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then(setUser).catch(() => {})
  }, [])

  const isAdmin = user?.role === "admin"

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
    { href: "/dashboard/cards", label: "Cards", icon: CreditCard, adminOnly: false },
    { href: "/dashboard/users", label: "Users", icon: Users, adminOnly: true },
    { href: "/dashboard/reset-requests", label: "Reset Requests", icon: KeyRound, adminOnly: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, adminOnly: false },
  ]

  const visibleLinks = navLinks.filter((l) => !l.adminOnly || isAdmin)

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <CardIcon className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">SmartCard</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <CardIcon className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <Separator className="opacity-50" />

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? label : undefined}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-primary/10 animate-scale-in" />
              )}
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground group-hover:bg-accent"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {!collapsed && (
                <span className="relative z-10">{label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <Separator className="opacity-50" />

      <div className="p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Loading..."}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        )}
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" })
            router.push("/login")
          }}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
