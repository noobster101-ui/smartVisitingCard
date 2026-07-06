import { NextResponse } from "next/server"
import { getUserByEmail, updateUser } from "@/services/user-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, newPassword } = body

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and new password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 })
    }

    await updateUser(user.id, { password: newPassword })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
