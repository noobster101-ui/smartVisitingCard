import { NextResponse } from "next/server"
import { getCurrentUser } from "@/services/auth-service"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const { password, ...safe } = user
    return NextResponse.json(safe)
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
}
