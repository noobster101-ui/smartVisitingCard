import { NextResponse } from "next/server"
import { getAllSettings } from "@/services/settings-service"

export async function GET() {
  try {
    const settings = await getAllSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ gallery_enabled: "true", visiting_card_enabled: "true" })
  }
}
