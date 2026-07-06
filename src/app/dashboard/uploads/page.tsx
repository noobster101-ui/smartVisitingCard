"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Trash2, FileImage, FileText, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type FileItem = {
  name: string
  url: string
  type: string
  size: number
  lastModified: string
}

const TABS = [
  { value: "all", label: "All" },
  { value: "profile", label: "Profile" },
  { value: "logos", label: "Logos" },
  { value: "gallery", label: "Gallery" },
  { value: "brochure", label: "Brochure" },
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getFileTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    profile: "Profile",
    logos: "Logos",
    gallery: "Gallery",
    brochure: "Brochure",
  }
  return labels[type] || type
}

export default function UploadsPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    const fetchFiles = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/uploads")
        const data = await res.json()
        if (!cancelled) setFiles(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setFiles([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchFiles()
    return () => { cancelled = true }
  }, [])

  const filteredFiles = activeTab === "all" ? files : files.filter((f) => f.type === activeTab)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", activeTab === "all" ? "profile" : activeTab)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const uploaded = await res.json()
      if (uploaded.url) {
        setFiles((prev) => [
          {
            name: uploaded.name,
            url: uploaded.url,
            type: activeTab === "all" ? "profile" : activeTab,
            size: uploaded.size,
            lastModified: new Date().toISOString(),
          },
          ...prev,
        ])
      }
    } catch {
      // ignore
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch("/api/uploads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: deleteTarget.url }),
      })
      setFiles((prev) => prev.filter((f) => f.url !== deleteTarget.url))
    } catch {
      // ignore
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Uploads</h1>
          <p className="text-muted-foreground mt-1">
            Manage your uploaded images and files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="aspect-video w-full rounded-md mb-3" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileImage className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No files found</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              {activeTab === "all"
                ? "No files uploaded yet. Click the upload button to add files."
                : `No ${getFileTypeLabel(activeTab).toLowerCase()} files uploaded yet.`}
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => (
            <Card key={file.url} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  {file.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/i) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[11px] capitalize">
                        {getFileTypeLabel(file.type)}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {formatSize(file.size)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDeleteTarget(file)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {formatDate(file.lastModified)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
