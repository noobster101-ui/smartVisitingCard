import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const type = (formData.get("type") as string) || "profile"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const validTypes = ["profile", "logos", "gallery", "visiting-card"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 })
    }

    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${type}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      url: blob.url,
      name: file.name,
      type: file.type,
      size: file.size,
    })
  } catch (e: any) {
    console.error("Upload error:", e?.message)
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 })
  }
}
