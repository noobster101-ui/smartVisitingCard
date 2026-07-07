import { NextResponse } from "next/server"
import { ensureAdminExists } from "@/config/seed"

export async function GET() {
  try {
    await ensureAdminExists()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Init failed" }, { status: 500 })
  }
}
