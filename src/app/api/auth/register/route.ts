import { NextResponse } from "next/server"
import { createUser } from "@/services/user-service"
import { createSession } from "@/services/auth-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const user = await createUser({ name, email, password, role: "user" })
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error: any) {
    if (error.message === "Email already registered") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
