"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import CardForm from "@/components/cards/card-form"
import type { CardFormData } from "@/types"

export default function EditCardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [card, setCard] = useState<CardFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${slug}`)
        if (!res.ok) {
          if (res.status === 404) {
            notFound()
            return
          }
          throw new Error("Failed to fetch")
        }
        const data = await res.json()
        if (!cancelled) setCard(data)
      } catch {
        if (!cancelled) notFound()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchCard()
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!card) return notFound()

  return <CardForm mode="edit" initialData={card} slug={slug} />
}
