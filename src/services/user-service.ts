import { v4 as uuid } from "uuid"
import pool from "@/lib/db"
import type { User } from "@/types"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

function mysqlNow(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ")
}

function toISO(val: unknown): string {
  if (!val) return new Date().toISOString()
  const d = new Date(String(val).replace(" ", "T") + "Z")
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: "admin" | "user"
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  role?: "admin" | "user"
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `h_${Math.abs(hash).toString(36)}_${Buffer.from(password).toString("base64").slice(0, 16)}`
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

function rowToUser(row: RowDataPacket): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    createdAt: toISO(row.created_at),
    updatedAt: toISO(row.updated_at),
  }
}

export async function getAllUsers(): Promise<User[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users ORDER BY created_at DESC"
  )
  return rows.map(rowToUser)
}

export async function getUserById(id: string): Promise<User | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  )
  return rows.length > 0 ? rowToUser(rows[0]) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
    [email]
  )
  return rows.length > 0 ? rowToUser(rows[0]) : null
}

export async function getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  if (!verifyPassword(password, user.password)) return null
  return user
}

export async function createUser(data: CreateUserData): Promise<User> {
  const existing = await getUserByEmail(data.email)
  if (existing) throw new Error("Email already registered")

  const id = uuid()
  const now = mysqlNow()
  const hashedPassword = hashPassword(data.password)

  await pool.query<ResultSetHeader>(
    "INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, data.name, data.email, hashedPassword, data.role || "user", now, now]
  )

  return { id, name: data.name, email: data.email, password: hashedPassword, role: data.role || "user", createdAt: now, updatedAt: now }
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User | null> {
  const user = await getUserById(id)
  if (!user) return null

  if (data.email && data.email !== user.email) {
    const existing = await getUserByEmail(data.email)
    if (existing) throw new Error("Email already in use")
  }

  const now = mysqlNow()
  const fields: string[] = ["updated_at = ?"]
  const values: (string)[] = [now]

  if (data.name) { fields.push("name = ?"); values.push(data.name) }
  if (data.email) { fields.push("email = ?"); values.push(data.email) }
  if (data.password) { fields.push("password = ?"); values.push(hashPassword(data.password)) }
  if (data.role) { fields.push("role = ?"); values.push(data.role) }

  values.push(id)
  await pool.query<ResultSetHeader>(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values
  )

  return getUserById(id)
}

export async function deleteUser(id: string): Promise<boolean> {
  const user = await getUserById(id)
  if (!user) return false
  if (user.role === "admin") throw new Error("Cannot delete admin user")
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM users WHERE id = ?",
    [id]
  )
  return result.affectedRows > 0
}

export { verifyPassword, hashPassword }
