import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/services/auth-service"
import { approveRequest } from "@/services/reset-request-service"
import { hashPassword } from "@/services/user-service"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, newPassword } = body

    if (!requestId || !newPassword) {
      return NextResponse.json({ error: "Request ID and new password required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const hashed = hashPassword(newPassword)
    const success = await approveRequest(requestId, hashed)
    if (!success) {
      return NextResponse.json({ error: "Request not found or already processed" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Password updated" })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 })
  }
}
