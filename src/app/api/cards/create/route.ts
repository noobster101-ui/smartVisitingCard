import { NextResponse } from "next/server"
import { createCard } from "@/services/card-service"
import { getCurrentUser } from "@/services/auth-service"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()
    const card = await createCard(body, user.id)
    return NextResponse.json(card, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create card", stack: e.stack }, { status: 500 })
  }
}
