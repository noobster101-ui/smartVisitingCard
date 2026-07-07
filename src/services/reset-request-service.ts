import { v4 as uuid } from "uuid"
import pool from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

export interface PasswordResetRequest {
  id: string
  user_id: string
  user_name?: string
  user_email?: string
  status: "pending" | "approved" | "rejected"
  new_password?: string
  created_at: string
  updated_at: string
}

function mysqlNow(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ")
}

export async function createResetRequest(userId: string): Promise<PasswordResetRequest> {
  const id = uuid()
  const now = mysqlNow()

  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM password_reset_requests WHERE user_id = ? AND status = 'pending'",
    [userId]
  )
  if (existing.length > 0) {
    throw new Error("You already have a pending request")
  }

  await pool.query<ResultSetHeader>(
    "INSERT INTO password_reset_requests (id, user_id, status, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?)",
    [id, userId, now, now]
  )

  return { id, user_id: userId, status: "pending", created_at: now, updated_at: now }
}

export async function getPendingRequests(): Promise<PasswordResetRequest[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT prr.*, u.name as user_name, u.email as user_email
     FROM password_reset_requests prr
     JOIN users u ON prr.user_id = u.id
     WHERE prr.status = 'pending'
     ORDER BY prr.created_at DESC`
  )
  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    user_name: r.user_name,
    user_email: r.user_email,
    status: r.status,
    new_password: r.new_password,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }))
}

export async function getAllRequests(): Promise<PasswordResetRequest[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT prr.*, u.name as user_name, u.email as user_email
     FROM password_reset_requests prr
     JOIN users u ON prr.user_id = u.id
     ORDER BY prr.created_at DESC`
  )
  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    user_name: r.user_name,
    user_email: r.user_email,
    status: r.status,
    new_password: r.new_password,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }))
}

export async function approveRequest(requestId: string, newPassword: string): Promise<boolean> {
  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM password_reset_requests WHERE id = ? AND status = 'pending'",
    [requestId]
  )
  if (existing.length === 0) return false

  const request = existing[0]
  const now = mysqlNow()

  await pool.query<ResultSetHeader>(
    "UPDATE users SET password = ?, updated_at = ? WHERE id = ?",
    [newPassword, now, request.user_id]
  )

  await pool.query<ResultSetHeader>(
    "UPDATE password_reset_requests SET status = 'approved', new_password = '***', updated_at = ? WHERE id = ?",
    [now, requestId]
  )

  return true
}

export async function rejectRequest(requestId: string): Promise<boolean> {
  const now = mysqlNow()
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE password_reset_requests SET status = 'rejected', updated_at = ? WHERE id = ? AND status = 'pending'",
    [now, requestId]
  )
  return (result as ResultSetHeader).affectedRows > 0
}
