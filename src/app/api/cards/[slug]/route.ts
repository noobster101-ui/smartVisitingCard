import { NextResponse } from "next/server"
import { getCardBySlug, updateCard } from "@/services/card-service"
import { getCurrentUser, isAdmin } from "@/services/auth-service"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const card = await getCardBySlug(slug)
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 })
  }
  return NextResponse.json(card)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { slug } = await params
    const existing = await getCardBySlug(slug)
    if (!existing) return NextResponse.json({ error: "Card not found" }, { status: 404 })

    const admin = await isAdmin()
    if (!admin && existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const card = await updateCard(slug, body)
    return NextResponse.json(card)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update card" }, { status: 500 })
  }
}
