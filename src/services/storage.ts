import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CARDS_DIR = path.join(DATA_DIR, "cards")
const PUBLIC_DIR = path.join(process.cwd(), "public")

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getCardsDir(): string {
  ensureDir(CARDS_DIR)
  return CARDS_DIR
}

export function ensureUploadDirs() {
  const dirs = [
    path.join(PUBLIC_DIR, "uploads", "profile"),
    path.join(PUBLIC_DIR, "uploads", "logos"),
    path.join(PUBLIC_DIR, "uploads", "gallery"),
    path.join(PUBLIC_DIR, "uploads", "brochure"),
  ]
  for (const dir of dirs) ensureDir(dir)
}

export function readJSON<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

export function writeJSON<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath)
  ensureDir(dir)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {
    // ignore
  }
}

export function listJSONFiles(dir: string): string[] {
  ensureDir(dir)
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f))
}

export function saveUploadedFile(
  sourcePath: string,
  subfolder: "profile" | "logos" | "gallery" | "brochure",
  filename: string
): string | null {
  try {
    if (!fs.existsSync(sourcePath)) return null
    const ext = path.extname(sourcePath) || ".jpg"
    const targetDir = path.join(PUBLIC_DIR, "uploads", subfolder)
    ensureDir(targetDir)
    const targetPath = path.join(targetDir, `${filename}${ext}`)
    fs.copyFileSync(sourcePath, targetPath)
    return `/uploads/${subfolder}/${filename}${ext}`
  } catch {
    return null
  }
}

export function deleteUploadedFile(publicUrl: string): void {
  if (!publicUrl) return
  const normalized = publicUrl.replace(/\\/g, "/")
  if (!normalized.startsWith("/uploads/") || normalized.includes("..")) return
  const relativePath = normalized.replace(/^\//, "")
  const fullPath = path.join(PUBLIC_DIR, relativePath)
  deleteFile(fullPath)
}

export function ensureDirectories() {
  getCardsDir()
  ensureUploadDirs()
}
