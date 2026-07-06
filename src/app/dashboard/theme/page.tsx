"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

type ThemeInfo = {
  id: string
  name: string
  description: string
  colors: string[]
  gradient: string
}

const THEMES: ThemeInfo[] = [
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional and trustworthy with classic blue tones.",
    colors: ["#1e40af", "#3b82f6", "#dbeafe"],
    gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #dbeafe 100%)",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple with monochromatic elegance.",
    colors: ["#1f2937", "#6b7280", "#e5e7eb"],
    gradient: "linear-gradient(135deg, #1f2937 0%, #6b7280 50%, #e5e7eb 100%)",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Dark-themed with tech-inspired green accents.",
    colors: ["#0f172a", "#22c55e", "#065f46"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #22c55e 50%, #065f46 100%)",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Elegant gold and deep charcoal for premium brands.",
    colors: ["#1a1a2e", "#d4af37", "#f5e6a3"],
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #d4af37 50%, #f5e6a3 100%)",
  },
  {
    id: "medical",
    name: "Medical",
    description: "Calming teal and white for healthcare professionals.",
    colors: ["#0d9488", "#14b8a6", "#ccfbf1"],
    gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #ccfbf1 100%)",
  },
  {
    id: "education",
    name: "Education",
    description: "Warm orange and purple for academic institutions.",
    colors: ["#7c3aed", "#f59e0b", "#fef3c7"],
    gradient: "linear-gradient(135deg, #7c3aed 0%, #f59e0b 50%, #fef3c7 100%)",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Earthy green and warm brown for property professionals.",
    colors: ["#166534", "#d97706", "#fef3c7"],
    gradient: "linear-gradient(135deg, #166534 0%, #d97706 50%, #fef3c7 100%)",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern purple gradient with vibrant energy.",
    colors: ["#7c3aed", "#ec4899", "#fdf4ff"],
    gradient: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #fdf4ff 100%)",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold pink and orange for artistic portfolios.",
    colors: ["#db2777", "#f97316", "#fff7ed"],
    gradient: "linear-gradient(135deg, #db2777 0%, #f97316 50%, #fff7ed 100%)",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Sleek dark mode with subtle blue highlights.",
    colors: ["#020617", "#1e293b", "#38bdf8"],
    gradient: "linear-gradient(135deg, #020617 0%, #1e293b 50%, #38bdf8 100%)",
  },
  {
    id: "light",
    name: "Light",
    description: "Bright airy design with soft gray undertones.",
    colors: ["#f8fafc", "#e2e8f0", "#64748b"],
    gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #64748b 100%)",
  },
]

export default function ThemePage() {
  const router = useRouter()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/dashboard/cards")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Themes</h1>
          </div>
          <p className="text-muted-foreground ml-11">
            Select a theme when creating or editing a card.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/cards/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Card
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {THEMES.map((theme) => (
          <Card
            key={theme.id}
            className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
            onClick={() => router.push("/dashboard/cards/new")}
          >
            <div
              className="h-24 w-full transition-transform duration-300 group-hover:scale-105"
              style={{ background: theme.gradient }}
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold capitalize">{theme.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {theme.description}
              </p>
              <div className="flex gap-1.5">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
