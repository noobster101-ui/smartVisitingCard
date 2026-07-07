import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export const runtime = "nodejs"

export async function GET() {
  try {
    const { blobs } = await list()
    const files = blobs.map((blob) => ({
      name: blob.pathname.split("/").pop() || blob.pathname,
      url: blob.url,
      type: blob.pathname.split("/")[0] || "other",
      size: blob.size,
      lastModified: blob.uploadedAt,
    }))

    files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    return NextResponse.json(files)
  } catch (e: any) {
    console.error("List uploads error:", e?.message)
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 })
  }
}
