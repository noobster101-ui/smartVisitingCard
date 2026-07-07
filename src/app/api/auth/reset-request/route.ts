import { NextResponse } from "next/server"
import { getCurrentUser } from "@/services/auth-service"
import { createResetRequest } from "@/services/reset-request-service"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const request = await createResetRequest(user.id)
    return NextResponse.json({ success: true, request })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to submit request" }, { status: 500 })
  }
}
