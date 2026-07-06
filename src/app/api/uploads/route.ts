import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    const files: { name: string; url: string; type: string; size: number; lastModified: string }[] = []

    let entries: string[]
    try {
      entries = await readdir(uploadsDir, { withFileTypes: false })
    } catch {
      return NextResponse.json([])
    }

    for (const entry of entries) {
      const entryPath = path.join(uploadsDir, entry)
      const entryStat = await stat(entryPath)
      if (entryStat.isDirectory()) {
        const subFiles = await readdir(entryPath)
        for (const subFile of subFiles) {
          const filePath = path.join(entryPath, subFile)
          const fileStat = await stat(filePath)
          if (fileStat.isFile()) {
            files.push({
              name: subFile,
              url: `/uploads/${entry}/${subFile}`,
              type: entry,
              size: fileStat.size,
              lastModified: fileStat.mtime.toISOString(),
            })
          }
        }
      }
    }

    files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())

    return NextResponse.json(files)
  } catch {
    return NextResponse.json({ error: "Failed to list uploads" }, { status: 500 })
  }
}
