export interface SocialLinks {
  linkedin: string
  github: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  whatsapp: string
}

export interface BusinessInfo {
  gst: string
  officeHours: string
  googleMapsLink: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
  createdAt: string
  updatedAt: string
}

export interface Card {
  id: string
  slug: string
  userId: string
  name: string
  designation: string
  company: string
  phone: string
  alternatePhone: string
  email: string
  website: string
  address: string
  about: string
  profileImage: string
  companyLogo: string
  gallery: string[]
  visitingCard: string
  theme: ThemeType
  primaryColor: string
  secondaryColor: string
  borderRadius: string
  fontFamily: string
  social: SocialLinks
  business: BusinessInfo
  createdAt: string
  updatedAt: string
}

export type ThemeType =
  | "corporate"
  | "minimal"
  | "developer"
  | "luxury"
  | "medical"
  | "education"
  | "real-estate"
  | "startup"
  | "creative"
  | "dark"
  | "light"

export type DevicePreview = "desktop" | "tablet" | "mobile"

export interface CardFormData {
  name: string
  slug: string
  designation: string
  company: string
  about: string
  phone: string
  alternatePhone: string
  email: string
  website: string
  address: string
  profileImage: string
  companyLogo: string
  gallery: string[]
  visitingCard: string
  theme: ThemeType
  primaryColor: string
  secondaryColor: string
  borderRadius: string
  fontFamily: string
  social: SocialLinks
  business: BusinessInfo
}

export interface DashboardStats {
  totalCards: number
  recentCards: Card[]
}

export interface UploadedFile {
  name: string
  url: string
  type: "image" | "pdf"
  size: number
}

export type SafeUser = Omit<User, "password">
