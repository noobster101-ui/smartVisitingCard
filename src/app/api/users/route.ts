import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/services/auth-service"
import { getAllUsers } from "@/services/user-service"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!await isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await getAllUsers()
  const safeUsers = users.map(({ password, ...rest }) => rest)
  return NextResponse.json(safeUsers)
}
