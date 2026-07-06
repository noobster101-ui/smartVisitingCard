import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function getSetting(key: string): Promise<string> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT `value` FROM settings WHERE `key` = ?",
    [key]
  )
  return rows.length > 0 ? rows[0].value : "true"
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT `key`, `value` FROM settings"
  )
  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }
  return settings
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await pool.query(
    "INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?",
    [key, value, value]
  )
}

export async function updateSettings(settings: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    await updateSetting(key, value)
  }
}
