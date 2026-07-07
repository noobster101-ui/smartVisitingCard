import { NextResponse } from "next/server"
import { del } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    if (!url.includes("blob.vercel-storage.com")) {
      return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Delete error:", e?.message)
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 })
  }
}
