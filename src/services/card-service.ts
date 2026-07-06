import { v4 as uuidv4 } from "uuid"
import pool from "@/lib/db"
import { Card, CardFormData } from "@/types"
import { slugify } from "@/lib/utils"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

function mysqlNow(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ")
}

function toISO(val: unknown): string {
  if (!val) return new Date().toISOString()
  const d = new Date(String(val).replace(" ", "T") + "Z")
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function rowToCard(row: RowDataPacket): Card {
  return {
    id: row.id,
    slug: row.slug,
    userId: row.user_id,
    name: row.name,
    designation: row.designation,
    company: row.company,
    phone: row.phone,
    alternatePhone: row.alternate_phone,
    email: row.email,
    website: row.website,
    address: row.address,
    about: row.about,
    profileImage: row.profile_image,
    companyLogo: row.company_logo,
    gallery: typeof row.gallery === "string" ? JSON.parse(row.gallery) : row.gallery || [],
    visitingCard: row.visiting_card,
    theme: row.theme,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    borderRadius: row.border_radius,
    fontFamily: row.font_family,
    social: typeof row.social_links === "string" ? JSON.parse(row.social_links) : row.social_links || {},
    business: typeof row.business_info === "string" ? JSON.parse(row.business_info) : row.business_info || {},
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  }
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM cards WHERE slug = ?",
    [slug]
  )
  return rows.length > 0 ? rowToCard(rows[0]) : null
}

export async function getCardById(id: string): Promise<Card | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM cards WHERE id = ?",
    [id]
  )
  return rows.length > 0 ? rowToCard(rows[0]) : null
}

export async function createCard(data: CardFormData, userId?: string): Promise<Card> {
  const id = uuidv4()
  const slug = slugify(data.slug || data.name) || "untitled-card"
  const now = mysqlNow()
  const social = data.social || { linkedin: "", github: "", facebook: "", instagram: "", twitter: "", youtube: "", whatsapp: "" }
  const business = data.business || { gst: "", officeHours: "", googleMapsLink: "" }
  const gallery = data.gallery || []

  await pool.query<ResultSetHeader>(
    `INSERT INTO cards (
      id, user_id, slug, name, designation, company, phone, alternate_phone,
      email, website, address, about, profile_image, company_logo, visiting_card,
      theme, primary_color, secondary_color, border_radius, font_family,
      social_links, business_info, gallery, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, userId || "", slug, data.name, data.designation, data.company,
      data.phone, data.alternatePhone, data.email, data.website, data.address,
      data.about, data.profileImage, data.companyLogo, data.visitingCard,
      data.theme, data.primaryColor, data.secondaryColor, data.borderRadius,
      data.fontFamily, JSON.stringify(social), JSON.stringify(business),
      JSON.stringify(gallery), now, now,
    ]
  )

  const card = await getCardBySlug(slug)
  return card!
}

export async function updateCard(slug: string, data: Partial<CardFormData>): Promise<Card | null> {
  const existing = await getCardBySlug(slug)
  if (!existing) return null

  const now = mysqlNow()
  const newSlug = data.slug && data.slug !== slug ? slugify(data.slug) : slug

  const fields: string[] = ["updated_at = ?"]
  const values: string[] = [now]

  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name) }
  if (data.designation !== undefined) { fields.push("designation = ?"); values.push(data.designation) }
  if (data.company !== undefined) { fields.push("company = ?"); values.push(data.company) }
  if (data.phone !== undefined) { fields.push("phone = ?"); values.push(data.phone) }
  if (data.alternatePhone !== undefined) { fields.push("alternate_phone = ?"); values.push(data.alternatePhone) }
  if (data.email !== undefined) { fields.push("email = ?"); values.push(data.email) }
  if (data.website !== undefined) { fields.push("website = ?"); values.push(data.website) }
  if (data.address !== undefined) { fields.push("address = ?"); values.push(data.address) }
  if (data.about !== undefined) { fields.push("about = ?"); values.push(data.about) }
  if (data.profileImage !== undefined) { fields.push("profile_image = ?"); values.push(data.profileImage) }
  if (data.companyLogo !== undefined) { fields.push("company_logo = ?"); values.push(data.companyLogo) }
  if (data.visitingCard !== undefined) { fields.push("visiting_card = ?"); values.push(data.visitingCard) }
  if (data.theme !== undefined) { fields.push("theme = ?"); values.push(data.theme) }
  if (data.primaryColor !== undefined) { fields.push("primary_color = ?"); values.push(data.primaryColor) }
  if (data.secondaryColor !== undefined) { fields.push("secondary_color = ?"); values.push(data.secondaryColor) }
  if (data.borderRadius !== undefined) { fields.push("border_radius = ?"); values.push(data.borderRadius) }
  if (data.fontFamily !== undefined) { fields.push("font_family = ?"); values.push(data.fontFamily) }
  if (data.social !== undefined) { fields.push("social_links = ?"); values.push(JSON.stringify(data.social)) }
  if (data.business !== undefined) { fields.push("business_info = ?"); values.push(JSON.stringify(data.business)) }
  if (data.gallery !== undefined) { fields.push("gallery = ?"); values.push(JSON.stringify(data.gallery)) }

  if (newSlug !== slug) { fields.push("slug = ?"); values.push(newSlug) }

  values.push(existing.id)
  await pool.query<ResultSetHeader>(
    `UPDATE cards SET ${fields.join(", ")} WHERE id = ?`,
    values
  )

  return getCardBySlug(newSlug)
}

export async function deleteCard(slug: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cards WHERE slug = ?",
    [slug]
  )
  return result.affectedRows > 0
}

export async function duplicateCard(slug: string): Promise<Card | null> {
  const original = await getCardBySlug(slug)
  if (!original) return null

  const newSlug = `${original.slug}-copy-${Date.now()}`
  const now = mysqlNow()
  const id = uuidv4()

  await pool.query<ResultSetHeader>(
    `INSERT INTO cards (
      id, user_id, slug, name, designation, company, phone, alternate_phone,
      email, website, address, about, profile_image, company_logo, visiting_card,
      theme, primary_color, secondary_color, border_radius, font_family,
      social_links, business_info, gallery, created_at, updated_at
    ) SELECT ?, user_id, ?, CONCAT(name, ' (Copy)'), designation, company, phone, alternate_phone,
      email, website, address, about, profile_image, company_logo, visiting_card,
      theme, primary_color, secondary_color, border_radius, font_family,
      social_links, business_info, gallery, ?, ?
    FROM cards WHERE id = ?`,
    [id, newSlug, now, now, original.id]
  )

  return getCardBySlug(newSlug)
}

export async function getAllCardsPaginated(
  search?: string,
  theme?: string,
  userId?: string
): Promise<Card[]> {
  let query = "SELECT * FROM cards WHERE 1=1"
  const params: string[] = []

  if (userId) { query += " AND user_id = ?"; params.push(userId) }
  if (search) {
    const q = `%${search.toLowerCase()}%`
    query += " AND (LOWER(name) LIKE ? OR LOWER(company) LIKE ? OR LOWER(designation) LIKE ?)"
    params.push(q, q, q)
  }
  if (theme && theme !== "all") { query += " AND theme = ?"; params.push(theme) }

  query += " ORDER BY updated_at DESC"

  const [rows] = await pool.query<RowDataPacket[]>(query, params)
  return rows.map(rowToCard)
}

export async function getCardCount(userId?: string): Promise<number> {
  let query = "SELECT COUNT(*) as count FROM cards"
  const params: string[] = []

  if (userId) { query += " WHERE user_id = ?"; params.push(userId) }

  const [rows] = await pool.query<RowDataPacket[]>(query, params)
  return rows[0].count
}

export async function getRecentCards(limit = 5, userId?: string): Promise<Card[]> {
  let query = "SELECT * FROM cards"
  const params: string[] = []

  if (userId) { query += " WHERE user_id = ?"; params.push(userId) }

  query += " ORDER BY updated_at DESC LIMIT ?"
  params.push(String(limit))

  const [rows] = await pool.query<RowDataPacket[]>(query, params)
  return rows.map(rowToCard)
}
