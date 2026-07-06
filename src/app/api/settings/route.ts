import { NextResponse } from "next/server"
import { getAllSettings, updateSettings } from "@/services/settings-service"
import { getCurrentUser, isAdmin } from "@/services/auth-service"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const settings = await getAllSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const body = await request.json()
    await updateSettings(body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
