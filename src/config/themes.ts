export interface ThemeConfig {
  value: string
  label: string
  description: string
  gradient: string
  bgGradient: string
  accentGradient: string
  pattern?: string
}

export const THEMES: ThemeConfig[] = [
  {
    value: "corporate",
    label: "Corporate",
    description: "Professional blue theme for business cards",
    gradient: "from-blue-600 to-blue-800",
    bgGradient: "from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950",
    accentGradient: "from-blue-500 to-blue-700",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean and minimal design for modern professionals",
    gradient: "from-slate-800 to-slate-900",
    bgGradient: "from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900",
    accentGradient: "from-slate-600 to-slate-800",
  },
  {
    value: "developer",
    label: "Developer",
    description: "Dark themed card for developers and tech professionals",
    gradient: "from-gray-900 via-purple-900 to-gray-900",
    bgGradient: "from-slate-900 via-purple-950 to-slate-900",
    accentGradient: "from-purple-500 to-blue-500",
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Premium gold and black theme for luxury brands",
    gradient: "from-amber-600 via-yellow-500 to-amber-700",
    bgGradient: "from-amber-50 via-white to-amber-50 dark:from-amber-950 dark:via-black dark:to-amber-950",
    accentGradient: "from-amber-500 to-yellow-600",
  },
  {
    value: "medical",
    label: "Medical",
    description: "Clean medical theme with calming colors",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 via-white to-teal-50 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950",
    accentGradient: "from-emerald-500 to-teal-500",
  },
  {
    value: "education",
    label: "Education",
    description: "Warm academic theme for educators and institutions",
    gradient: "from-orange-500 to-rose-600",
    bgGradient: "from-orange-50 via-white to-rose-50 dark:from-orange-950 dark:via-slate-900 dark:to-rose-950",
    accentGradient: "from-orange-500 to-rose-500",
  },
  {
    value: "real-estate",
    label: "Real Estate",
    description: "Professional theme for real estate agents",
    gradient: "from-teal-600 to-cyan-700",
    bgGradient: "from-teal-50 via-white to-cyan-50 dark:from-teal-950 dark:via-slate-900 dark:to-cyan-950",
    accentGradient: "from-teal-500 to-cyan-600",
  },
  {
    value: "startup",
    label: "Startup",
    description: "Vibrant tech startup theme",
    gradient: "from-violet-600 via-pink-500 to-orange-500",
    bgGradient: "from-violet-50 via-white to-pink-50 dark:from-violet-950 dark:via-slate-900 dark:to-pink-950",
    accentGradient: "from-violet-500 via-pink-500 to-orange-500",
  },
  {
    value: "creative",
    label: "Creative",
    description: "Bold creative theme for artists and designers",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    bgGradient: "from-pink-50 via-white to-indigo-50 dark:from-pink-950 dark:via-slate-900 dark:to-indigo-950",
    accentGradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Elegant dark theme with neon accents",
    gradient: "from-gray-800 via-gray-900 to-black",
    bgGradient: "from-gray-900 via-slate-900 to-black",
    accentGradient: "from-blue-400 to-cyan-300",
  },
  {
    value: "light",
    label: "Light",
    description: "Clean light theme with subtle shadows",
    gradient: "from-gray-100 to-white",
    bgGradient: "from-white via-gray-50 to-white",
    accentGradient: "from-blue-400 to-blue-600",
  },
]

export function getThemeConfig(value: string): ThemeConfig {
  return THEMES.find((t) => t.value === value) || THEMES[0]
}
