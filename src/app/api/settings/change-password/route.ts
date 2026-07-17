import { NextResponse } from "next/server"
import { getCurrentUser } from "@/services/auth-service"
import { verifyPassword, updateUser } from "@/services/user-service"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    const valid = await verifyPassword(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      )
    }

    await updateUser(user.id, { password: newPassword })

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch {
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
