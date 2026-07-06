"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import {
  Upload,
  X,
  ImageIcon,
  FileText,
  Smartphone,
  Tablet,
  Monitor,
  Loader2,
  Save,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Building2,
  User,
  Briefcase,
  Link,
  Sparkles,
  Palette,
  Type,
  Square,
  Plus,
  HelpCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cardSchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"
import type { CardFormData, DevicePreview } from "@/types"

interface CardFormProps {
  mode: "create" | "edit"
  initialData?: CardFormData
  slug?: string
}

const THEMES = [
  { value: "corporate", label: "Corporate", gradient: "linear-gradient(135deg, #1e40af, #3b82f6, #dbeafe)", desc: "Professional blue" },
  { value: "minimal", label: "Minimal", gradient: "linear-gradient(135deg, #1f2937, #6b7280, #e5e7eb)", desc: "Clean monochrome" },
  { value: "developer", label: "Developer", gradient: "linear-gradient(135deg, #0f172a, #22c55e, #065f46)", desc: "Dark with green" },
  { value: "luxury", label: "Luxury", gradient: "linear-gradient(135deg, #1a1a2e, #d4af37, #f5e6a3)", desc: "Gold & charcoal" },
  { value: "medical", label: "Medical", gradient: "linear-gradient(135deg, #0d9488, #14b8a6, #ccfbf1)", desc: "Calming teal" },
  { value: "education", label: "Education", gradient: "linear-gradient(135deg, #7c3aed, #f59e0b, #fef3c7)", desc: "Warm academic" },
  { value: "real-estate", label: "Real Estate", gradient: "linear-gradient(135deg, #166534, #d97706, #fef3c7)", desc: "Earthy tones" },
  { value: "startup", label: "Startup", gradient: "linear-gradient(135deg, #7c3aed, #ec4899, #fdf4ff)", desc: "Modern vibrant" },
  { value: "creative", label: "Creative", gradient: "linear-gradient(135deg, #db2777, #f97316, #fff7ed)", desc: "Bold & artistic" },
  { value: "dark", label: "Dark", gradient: "linear-gradient(135deg, #020617, #1e293b, #38bdf8)", desc: "Sleek dark mode" },
  { value: "light", label: "Light", gradient: "linear-gradient(135deg, #f8fafc, #e2e8f0, #64748b)", desc: "Bright & airy" },
]

const BORDER_RADIUS_OPTIONS = [
  { value: "0", label: "None" },
  { value: "0.25rem", label: "Sm" },
  { value: "0.5rem", label: "Md" },
  { value: "0.75rem", label: "Lg" },
  { value: "1rem", label: "Xl" },
  { value: "1.5rem", label: "2xl" },
  { value: "2rem", label: "3xl" },
  { value: "9999px", label: "Full" },
]

const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Poppins",
  "Playfair Display",
  "Montserrat",
]

const DEFAULT_VALUES: CardFormData = {
  name: "",
  slug: "",
  designation: "",
  company: "",
  about: "",
  phone: "",
  alternatePhone: "",
  email: "",
  website: "",
  address: "",
  profileImage: "",
  companyLogo: "",
  gallery: [],
  visitingCard: "",
  theme: "corporate",
  primaryColor: "#2563eb",
  secondaryColor: "#111827",
  borderRadius: "0.75rem",
  fontFamily: "Inter",
  social: {
    linkedin: "",
    github: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    whatsapp: "",
  },
  business: {
    gst: "",
    officeHours: "",
    googleMapsLink: "",
  },
}

function FileUploadArea({
  value,
  onChange,
  accept,
  label,
  type,
}: {
  value: string
  onChange: (url: string) => void
  accept: Record<string, string[]>
  label: string
  type: "profile" | "logos" | "gallery" | "visiting-card"
}) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", type)
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (data.url) {
          onChange(data.url)
          toast.success(`${label} uploaded`)
        } else {
          toast.error("Upload failed")
        }
      } catch {
        toast.error("Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [onChange, label, type]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  })

  const isImage = value && /\.(jpg|jpeg|png|gif|webp)$/i.test(value)
  const isPdf = value && /\.pdf$/i.test(value)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative rounded-lg border overflow-hidden group">
          {isImage && (
            <div className="relative aspect-video max-h-48">
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = Object.keys(accept).join(",")
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          const fd = new FormData()
                          fd.append("file", file)
                          fd.append("type", type)
                          const res = await fetch("/api/upload", { method: "POST", body: fd })
                          const data = await res.json()
                          if (data.url) onChange(data.url)
                        }
                      }
                      input.click()
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Change
                  </Button>
                </div>
              </div>
            </div>
          )}
          {isPdf && (
            <div className="flex items-center gap-3 p-4 bg-muted/50">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{value.split("/").pop()}</p>
                <p className="text-xs text-muted-foreground">PDF file</p>
              </div>
              <a href={value} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" size="sm">
                  View
                </Button>
              </a>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop file here" : `Drag & drop or click to upload ${label.toLowerCase()}`}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  PNG, JPG, WebP
                </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GalleryUpload({
  images,
  onChange,
}: {
  images: string[]
  onChange: (urls: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)
      try {
        const urls: string[] = []
        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("type", "gallery")
          const res = await fetch("/api/upload", { method: "POST", body: formData })
          const data = await res.json()
          if (data.url) urls.push(data.url)
        }
        if (urls.length > 0) {
          onChange([...images, ...urls])
          toast.success(`${urls.length} image(s) uploaded`)
        }
      } catch {
        toast.error("Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [images, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  })

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label>Gallery Images</Label>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
      >
        <input {...getInputProps()} multiple />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Plus className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Drop images here" : "Drag & drop or click to add images"}
            </p>
            <p className="text-xs text-muted-foreground/60">PNG, JPG, WebP</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CardPreview({
  data,
  device,
}: {
  data: CardFormData
  device: DevicePreview
}) {
  const widthMap: Record<DevicePreview, string> = {
    desktop: "w-full",
    tablet: "w-[420px]",
    mobile: "w-[320px]",
  }
  const maxWidthMap: Record<DevicePreview, string> = {
    desktop: "max-w-md",
    tablet: "max-w-[420px]",
    mobile: "max-w-[320px]",
  }

  const hasData = data.name || data.designation || data.company

  return (
    <div className={`mx-auto ${widthMap[device]} transition-all duration-300`}>
      <div
        className={`bg-white ${maxWidthMap[device]} mx-auto overflow-hidden shadow-lg`}
        style={{
          borderRadius: data.borderRadius,
          fontFamily: data.fontFamily,
          backgroundColor: data.theme === "dark" ? "#1a1a2e" : "#ffffff",
          color: data.theme === "dark" ? "#e2e8f0" : data.secondaryColor,
        }}
      >
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground/50">
              Fill in the form to see a live preview
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-4">
              {data.profileImage ? (
                <img
                  src={data.profileImage}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover ring-2"
                  style={{ "--tw-ring-color": data.primaryColor } as React.CSSProperties}
                />
              ) : (
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: data.primaryColor }}
                >
                  {data.name
                    ? data.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {data.name && (
                  <h3 className="font-bold text-lg truncate" style={{ fontFamily: data.fontFamily }}>
                    {data.name}
                  </h3>
                )}
                {data.designation && (
                  <p className="text-sm truncate" style={{ color: data.primaryColor }}>
                    {data.designation}
                  </p>
                )}
                {data.company && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{data.company}</p>
                )}
              </div>
              {data.companyLogo && (
                <img
                  src={data.companyLogo}
                  alt="Logo"
                  className="h-10 w-10 object-contain rounded"
                />
              )}
            </div>

            {data.about && (
              <p
                className="text-xs leading-relaxed line-clamp-3"
                style={{ color: data.theme === "dark" ? "#94a3b8" : "#64748b" }}
              >
                {data.about}
              </p>
            )}

            <div className="space-y-2 pt-2 border-t" style={{ borderColor: data.theme === "dark" ? "#2d2d4e" : "#e2e8f0" }}>
              {data.phone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: data.primaryColor }} />
                  <span className="truncate">{data.phone}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: data.primaryColor }} />
                  <span className="truncate">{data.email}</span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center gap-2 text-xs">
                  <Globe className="h-3.5 w-3.5 shrink-0" style={{ color: data.primaryColor }} />
                  <span className="truncate">{data.website}</span>
                </div>
              )}
              {data.address && (
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: data.primaryColor }} />
                  <span className="line-clamp-2">{data.address}</span>
                </div>
              )}
            </div>

            {data.social && Object.values(data.social).some(Boolean) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: data.theme === "dark" ? "#2d2d4e" : "#e2e8f0" }}>
                {data.social.whatsapp && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                )}
                {data.social.linkedin && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                )}
                {data.social.github && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </div>
                )}
                {data.social.instagram && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                )}
                {data.social.facebook && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                )}
                {data.social.twitter && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                )}
                {data.social.youtube && (
                  <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: data.primaryColor + "20" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={data.primaryColor}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CardForm({ mode, initialData, slug }: CardFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [device, setDevice] = useState<DevicePreview>("desktop")
  const [tab, setTab] = useState("general")

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema) as any,
    defaultValues: initialData || DEFAULT_VALUES,
  })

  const watched = watch()

  const onSubmit = async (data: CardFormData) => {
    setSaving(true)
    try {
      const url =
        mode === "create"
          ? "/api/cards/create"
          : `/api/cards/${slug}`
      const method = mode === "create" ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to save")
      toast.success(mode === "create" ? "Card created" : "Card updated")
      router.push("/dashboard/cards")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "Failed to save card")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/cards">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "create" ? "Create New Card" : "Edit Card"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === "create"
                ? "Fill in the details to create your digital business card."
                : "Update your digital business card details."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg border bg-muted/50">
            <Button
              type="button"
              variant={device === "desktop" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setDevice("desktop")}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant={device === "tablet" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setDevice("tablet")}
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant={device === "mobile" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full flex-wrap h-auto">
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
                <TabsTrigger value="images" className="text-xs">Images</TabsTrigger>
                <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
                <TabsTrigger value="visitingCard" className="text-xs">Visiting Card</TabsTrigger>
                <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
                <TabsTrigger value="appearance" className="text-xs">Appearance</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full bg-primary" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Basic Information</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register("name", {
                            onChange: (e) => {
                              if (mode === "create") {
                                setValue("slug", slugify(e.target.value), {
                                  shouldValidate: true,
                                })
                              }
                            },
                          })}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">
                          Slug <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="slug"
                          placeholder="john-doe"
                          {...register("slug")}
                        />
                        {errors.slug && (
                          <p className="text-xs text-destructive">{errors.slug.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="designation">
                          Designation <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="designation"
                          placeholder="Software Engineer"
                          {...register("designation")}
                        />
                        {errors.designation && (
                          <p className="text-xs text-destructive">{errors.designation.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">
                          Company <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          {...register("company")}
                        />
                        {errors.company && (
                          <p className="text-xs text-destructive">{errors.company.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="about">About</Label>
                      <Textarea
                        id="about"
                        placeholder="Write a short bio..."
                        className="min-h-[100px]"
                        {...register("about")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+1 234 567 8900"
                          {...register("phone")}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">{errors.phone.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternatePhone">Alternate Phone</Label>
                        <Input
                          id="alternatePhone"
                          placeholder="+1 234 567 8901"
                          {...register("alternatePhone")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          placeholder="https://example.com"
                          {...register("website")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="123 Main St, City, Country"
                        {...register("address")}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gst">GST Number</Label>
                      <Input
                        id="gst"
                        placeholder="GSTIN"
                        {...register("business.gst")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officeHours">Office Hours</Label>
                      <Input
                        id="officeHours"
                        placeholder="Mon-Fri, 9:00 AM - 6:00 PM"
                        {...register("business.officeHours")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                      <Input
                        id="googleMapsLink"
                        placeholder="https://maps.google.com/..."
                        {...register("business.googleMapsLink")}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-8">
                    {/* Profile Photo */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-primary" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Profile Photo</p>
                      </div>
                      <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-3">
                            {field.value ? (
                              <div className="relative group rounded-xl border overflow-hidden">
                                <img src={field.value} alt="Profile" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                                  <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 hover:bg-secondary/80">
                                    <Upload className="h-4 w-4" />
                                    Replace
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        const fd = new FormData()
                                        fd.append("file", file)
                                        fd.append("type", "profile")
                                        const res = await fetch("/api/upload", { method: "POST", body: fd })
                                        const data = await res.json()
                                        if (data.url) {
                                          field.onChange(data.url)
                                          toast.success("Profile photo uploaded")
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const fd = new FormData()
                                    fd.append("file", file)
                                    fd.append("type", "profile")
                                    toast.loading("Uploading...")
                                    const res = await fetch("/api/upload", { method: "POST", body: fd })
                                    const data = await res.json()
                                    toast.dismiss()
                                    if (data.url) {
                                      field.onChange(data.url)
                                      toast.success("Profile photo uploaded")
                                    } else {
                                      toast.error("Upload failed")
                                    }
                                  }}
                                />
                                <ImageIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
                                <p className="text-sm text-muted-foreground">Click to upload profile photo</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WebP</p>
                              </label>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className="border-t" />

                    {/* Company Logo */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-primary" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company Logo</p>
                      </div>
                      <Controller
                        name="companyLogo"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-3">
                            {field.value ? (
                              <div className="relative group rounded-xl border overflow-hidden">
                                <img src={field.value} alt="Logo" className="w-full h-48 object-contain bg-muted p-4" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                                  <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 hover:bg-secondary/80">
                                    <Upload className="h-4 w-4" />
                                    Replace
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        const fd = new FormData()
                                        fd.append("file", file)
                                        fd.append("type", "logos")
                                        const res = await fetch("/api/upload", { method: "POST", body: fd })
                                        const data = await res.json()
                                        if (data.url) {
                                          field.onChange(data.url)
                                          toast.success("Company logo uploaded")
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const fd = new FormData()
                                    fd.append("file", file)
                                    fd.append("type", "logos")
                                    toast.loading("Uploading...")
                                    const res = await fetch("/api/upload", { method: "POST", body: fd })
                                    const data = await res.json()
                                    toast.dismiss()
                                    if (data.url) {
                                      field.onChange(data.url)
                                      toast.success("Company logo uploaded")
                                    } else {
                                      toast.error("Upload failed")
                                    }
                                  }}
                                />
                                <ImageIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
                                <p className="text-sm text-muted-foreground">Click to upload company logo</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WebP</p>
                              </label>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <Controller
                      name="gallery"
                      control={control}
                      render={({ field }) => (
                        <GalleryUpload
                          images={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visitingCard" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <Controller
                      name="visitingCard"
                      control={control}
                      render={({ field }) => (
                        <FileUploadArea
                          value={field.value}
                          onChange={field.onChange}
                          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                          label="Visiting Card (Image)"
                          type="visiting-card"
                        />
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          placeholder="https://wa.me/1234567890"
                          {...register("social.whatsapp")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/in/..."
                          {...register("social.linkedin")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          placeholder="https://github.com/..."
                          {...register("social.github")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          placeholder="https://facebook.com/..."
                          {...register("social.facebook")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          placeholder="https://instagram.com/..."
                          {...register("social.instagram")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input
                          id="twitter"
                          placeholder="https://twitter.com/..."
                          {...register("social.twitter")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                          id="youtube"
                          placeholder="https://youtube.com/@..."
                          {...register("social.youtube")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 rounded-full bg-primary" />
                        <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Theme</Label>
                      </div>
                      <Controller
                        name="theme"
                        control={control}
                        render={({ field }) => (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                            {THEMES.map((t) => (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => {
                                  field.onChange(t.value)
                                  // Auto-set colors based on theme
                                  const colorMap: Record<string, { primary: string; secondary: string }> = {
                                    corporate: { primary: "#1e40af", secondary: "#3b82f6" },
                                    minimal: { primary: "#1f2937", secondary: "#6b7280" },
                                    developer: { primary: "#22c55e", secondary: "#0f172a" },
                                    luxury: { primary: "#d4af37", secondary: "#1a1a2e" },
                                    medical: { primary: "#0d9488", secondary: "#14b8a6" },
                                    education: { primary: "#7c3aed", secondary: "#f59e0b" },
                                    "real-estate": { primary: "#166534", secondary: "#d97706" },
                                    startup: { primary: "#7c3aed", secondary: "#ec4899" },
                                    creative: { primary: "#db2777", secondary: "#f97316" },
                                    dark: { primary: "#38bdf8", secondary: "#1e293b" },
                                    light: { primary: "#2563eb", secondary: "#64748b" },
                                  }
                                  const colors = colorMap[t.value]
                                  if (colors) {
                                    setValue("primaryColor", colors.primary)
                                    setValue("secondaryColor", colors.secondary)
                                  }
                                }}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left group ${
                                  field.value === t.value
                                    ? "border-primary shadow-md ring-2 ring-primary/20 scale-[1.02]"
                                    : "border-border hover:border-muted-foreground/30 hover:shadow-sm"
                                }`}
                              >
                                <div className="h-14 w-full" style={{ background: t.gradient }} />
                                <div className="px-2.5 py-2 bg-card">
                                  <p className="text-[11px] font-semibold truncate">{t.label}</p>
                                  <p className="text-[9px] text-muted-foreground truncate">{t.desc}</p>
                                </div>
                                {field.value === t.value && (
                                  <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                    <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-4 rounded-full bg-primary" />
                      <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Colors</Label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor" className="text-xs">Primary Color</Label>
                        <div className="flex gap-2">
                          <div
                            className="h-10 w-10 rounded-lg border shrink-0 shadow-sm"
                            style={{ backgroundColor: watched.primaryColor }}
                          />
                          <Input
                            id="primaryColor"
                            type="color"
                            className="h-10 w-full cursor-pointer"
                            {...register("primaryColor")}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor" className="text-xs">Secondary Color</Label>
                        <div className="flex gap-2">
                          <div
                            className="h-10 w-10 rounded-lg border shrink-0 shadow-sm"
                            style={{ backgroundColor: watched.secondaryColor }}
                          />
                          <Input
                            id="secondaryColor"
                            type="color"
                            className="h-10 w-full cursor-pointer"
                            {...register("secondaryColor")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-4 rounded-full bg-primary" />
                      <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Style</Label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                        <Controller
                          name="fontFamily"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger id="fontFamily">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FONT_FAMILIES.map((f) => (
                                  <SelectItem key={f} value={f}>
                                    {f}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="borderRadius" className="text-xs">Border Radius</Label>
                        <Controller
                          name="borderRadius"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger id="borderRadius">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {BORDER_RADIUS_OPTIONS.map((b) => (
                                  <SelectItem key={b.value} value={b.value}>
                                    {b.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/cards")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create" ? "Create Card" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="sticky top-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Live Preview
              </div>
              <CardPreview data={watched} device={device} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
