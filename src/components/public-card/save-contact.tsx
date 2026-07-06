"use client"

import { useCallback, type ReactNode } from "react"
import type { Card } from "@/types"

function escapeVCard(value: string): string {
  return value.replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n")
}

function generateVCard(card: Card): string {
  const lines: string[] = []
  lines.push("BEGIN:VCARD")
  lines.push("VERSION:3.0")
  lines.push(`FN:${escapeVCard(card.name)}`)
  lines.push(`ORG:${escapeVCard(card.company || "")}`)
  lines.push(`TITLE:${escapeVCard(card.designation || "")}`)
  if (card.phone) lines.push(`TEL;TYPE=CELL:${card.phone}`)
  if (card.alternatePhone) lines.push(`TEL;TYPE=OTHER:${card.alternatePhone}`)
  if (card.email) lines.push(`EMAIL:${card.email}`)
  if (card.website) lines.push(`URL:${card.website}`)
  if (card.address) lines.push(`ADR:;;${escapeVCard(card.address)};;;;`)
  if (card.about) lines.push(`NOTE:${escapeVCard(card.about)}`)
  lines.push("END:VCARD")
  return lines.join("\n")
}

interface SaveContactProps {
  card: Card
  children?: ReactNode
}

export default function SaveContact({ card, children }: SaveContactProps) {
  const handleSave = useCallback(() => {
    const vcard = generateVCard(card)
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${card.name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [card])

  if (children) {
    return <div onClick={handleSave}>{children}</div>
  }

  return (
    <button
      onClick={handleSave}
      className="w-full h-12 rounded-xl font-medium text-base gap-2 bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Save Contact
    </button>
  )
}
