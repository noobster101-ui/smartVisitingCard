import { NextResponse } from "next/server"
import { ensureAdminExists } from "@/config/seed"

export async function GET() {
  try {
    await ensureAdminExists()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Init failed" }, { status: 500 })
  }
}
