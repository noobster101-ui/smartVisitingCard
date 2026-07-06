import { NextResponse } from "next/server"
import { deleteCard, getCardBySlug } from "@/services/card-service"
import { getCurrentUser, isAdmin } from "@/services/auth-service"

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { slug } = body
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 })

  const card = await getCardBySlug(slug)
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 })

  const admin = await isAdmin()
  if (!admin && card.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const success = await deleteCard(slug)
  return NextResponse.json({ success })
}
