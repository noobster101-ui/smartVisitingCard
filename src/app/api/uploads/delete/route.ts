import { NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    const normalized = url.replace(/\\/g, "/")
    if (!normalized.startsWith("/uploads/") || normalized.includes("..")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
    }
    const filePath = path.join(process.cwd(), "public", normalized)
    await unlink(filePath)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
