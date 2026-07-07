import { NextResponse } from "next/server"
import { createSession } from "@/services/auth-service"
import { getUserByEmailAndPassword } from "@/services/user-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = await getUserByEmailAndPassword(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession(user.id)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (e: any) {
    console.error("Login error:", e.message)
    return NextResponse.json({ error: "Login failed: " + e.message }, { status: 500 })
  }
}
