import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/services/auth-service"
import { rejectRequest } from "@/services/reset-request-service"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    const success = await rejectRequest(requestId)
    if (!success) {
      return NextResponse.json({ error: "Request not found or already processed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 })
  }
}
