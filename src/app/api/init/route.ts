import { NextResponse } from "next/server"
import { ensureAdminExists } from "@/config/seed"
import pool, { testConnection } from "@/lib/db"

export async function GET() {
  try {
    const connected = await testConnection()
    if (!connected) {
      return NextResponse.json({ error: "Database connection failed", host: process.env.DATABASE_HOST }, { status: 500 })
    }
    await ensureAdminExists()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
