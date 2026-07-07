import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/services/auth-service"
import { getPendingRequests, getAllRequests } from "@/services/reset-request-service"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await isAdmin()
    const requests = admin ? await getAllRequests() : await getPendingRequests()
    return NextResponse.json(requests)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 })
  }
}
