import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://smart-visiting-card.vercel.app"),
  title: {
    default: "SmartVisitingCard - Digital Business Cards",
    template: "%s | SmartVisitingCard",
  },
  description:
    "Create, share, and manage beautiful digital visiting cards with SmartVisitingCard. Make a lasting impression with every introduction.",
  keywords: ["digital business card", "visiting card", "smart card", "business card maker", "digital card"],
  authors: [{ name: "SmartVisitingCard" }],
  creator: "SmartVisitingCard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-visiting-card.vercel.app",
    siteName: "SmartVisitingCard",
    title: "SmartVisitingCard - Digital Business Cards",
    description: "Create, share, and manage beautiful digital visiting cards.",
    images: [{ url: "/icons/icon.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartVisitingCard - Digital Business Cards",
    description: "Create, share, and manage beautiful digital visiting cards.",
    images: ["/icons/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
