"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  CreditCard,
  Building2,
} from "lucide-react"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getInitials } from "@/lib/utils"
import type { Card } from "@/types"

const THEMES: { value: string; label: string }[] = [
  { value: "all", label: "All Themes" },
  { value: "corporate", label: "Corporate" },
  { value: "minimal", label: "Minimal" },
  { value: "developer", label: "Developer" },
  { value: "luxury", label: "Luxury" },
  { value: "medical", label: "Medical" },
  { value: "education", label: "Education" },
  { value: "real-estate", label: "Real Estate" },
  { value: "startup", label: "Startup" },
  { value: "creative", label: "Creative" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
]

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [theme, setTheme] = useState("all")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false
    const fetchCards = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (theme && theme !== "all") params.set("theme", theme)
        const res = await fetch(`/api/cards?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        if (!cancelled) setCards(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setCards([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchCards()
    return () => { cancelled = true }
  }, [debouncedSearch, theme])

  const handleDelete = async () => {
    if (!deleteSlug) return
    setDeleting(true)
    try {
      const res = await fetch("/api/cards/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: deleteSlug }),
      })
      if (!res.ok) throw new Error("Failed to delete")
      setCards((prev) => prev.filter((c) => c.slug !== deleteSlug))
    } catch {
      // ignore
    } finally {
      setDeleting(false)
      setDeleteSlug(null)
    }
  }

  const handleDuplicate = async (slug: string) => {
    try {
      const res = await fetch("/api/cards/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      const duplicated = await res.json()
      if (duplicated && duplicated.slug) {
        setCards((prev) => [duplicated, ...prev])
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cards</h1>
          <p className="text-muted-foreground mt-1">
            Manage your digital business cards.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/cards/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Card
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <UICard key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardContent>
            </UICard>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <UICard>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No cards found</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              {debouncedSearch || theme !== "all"
                ? "No cards match your search criteria. Try adjusting your filters."
                : "You haven't created any digital business cards yet. Get started by creating your first card."}
            </p>
            {!debouncedSearch && theme === "all" && (
              <Button asChild>
                <Link href="/dashboard/cards/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Card
                </Link>
              </Button>
            )}
          </CardContent>
        </UICard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <UICard key={card.id} className="group relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Theme color bar */}
              <div className="h-1 w-full bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${card.primaryColor}, ${card.secondaryColor})` }} />
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={card.profileImage || undefined}
                    fallback={getInitials(card.name)}
                    className="h-12 w-12 shrink-0 ring-2 ring-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate group-hover:text-primary transition-colors">{card.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {card.designation}
                    </p>
                    {card.company && (
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3" />
                        {card.company}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: card.primaryColor }} />
                    <Badge variant="secondary" className="text-[11px] capitalize font-normal">
                      {card.theme}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(card.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground" asChild>
                    <Link href={`/card/${card.slug}`} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground" asChild>
                    <Link href={`/dashboard/cards/${card.slug}/edit`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleDuplicate(card.slug)} title="Duplicate">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteSlug(card.slug)} title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </UICard>
          ))}
        </div>
      )}

      <Dialog open={!!deleteSlug} onOpenChange={(open) => !open && setDeleteSlug(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteSlug(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
