import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const socialSchema = z.object({
  linkedin: z.string().optional().default(""),
  github: z.string().optional().default(""),
  facebook: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
})

const businessSchema = z.object({
  gst: z.string().optional().default(""),
  officeHours: z.string().optional().default(""),
  googleMapsLink: z.string().optional().default(""),
})

export const cardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  designation: z.string().min(1, "Designation is required"),
  company: z.string().min(1, "Company is required"),
  about: z.string().optional().default(""),
  phone: z.string().min(1, "Phone is required"),
  alternatePhone: z.string().optional().default(""),
  email: z.string().email("Invalid email").optional().or(z.literal("")).default(""),
  website: z.string().optional().default(""),
  address: z.string().optional().default(""),
  profileImage: z.string().optional().default(""),
  companyLogo: z.string().optional().default(""),
  gallery: z.array(z.string()).optional().default([]),
  visitingCard: z.string().optional().default(""),
  theme: z.string().default("corporate"),
  primaryColor: z.string().default("#2563eb"),
  secondaryColor: z.string().default("#111827"),
  borderRadius: z.string().default("0.75rem"),
  fontFamily: z.string().default("Inter"),
  social: socialSchema.optional().default({
    linkedin: "", github: "", facebook: "", instagram: "", twitter: "", youtube: "", whatsapp: "",
  }),
  business: businessSchema.optional().default({
    gst: "", officeHours: "", googleMapsLink: "",
  }),
})

export type CardFormData = z.infer<typeof cardSchema>
