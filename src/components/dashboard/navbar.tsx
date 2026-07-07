"use client"

import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, Sun, Moon, LogOut, Settings } from "lucide-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { User } from "@/types"

type SafeUser = Omit<User, "password">

interface NavbarProps {
  title?: string
  onToggleSidebar: () => void
}

export function Navbar({ title, onToggleSidebar }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [user, setUser] = useState<SafeUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch("/api/auth/me").then(r => r.json()).then(setUser).catch(() => {})
  }, [])

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }))

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {title ? (
        <h1 className="text-lg font-semibold">{title}</h1>
      ) : (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground/40">/</span>}
              <Link
                href={crumb.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  i === breadcrumbs.length - 1 && "text-foreground font-medium pointer-events-none"
                )}
              >
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative h-9 w-9 rounded-xl hover:bg-accent"
          title={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 p-0 hover:bg-accent">
              <Avatar src={undefined} fallback={user?.name?.[0]?.toUpperCase() || "U"} className="h-8 w-8" />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[14rem] overflow-hidden rounded-2xl border bg-popover/95 backdrop-blur-xl p-1.5 shadow-xl data-[side=bottom]:animate-scale-in"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">{user?.name || "Loading..."}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
              <DropdownMenu.Separator className="h-px bg-border mx-1 my-1" />
              <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent transition-colors">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border mx-1 my-1" />
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive outline-none hover:bg-destructive/10 transition-colors"
                onSelect={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login" }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
