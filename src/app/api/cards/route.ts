import { NextResponse } from "next/server"
import { getAllCardsPaginated } from "@/services/card-service"
import { getCurrentUser, isAdmin } from "@/services/auth-service"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined
    const theme = searchParams.get("theme") || undefined

    const admin = await isAdmin()
    const userId = admin ? undefined : user.id

    const cards = await getAllCardsPaginated(search, theme, userId)
    return NextResponse.json(cards)
  } catch {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
  }
}
