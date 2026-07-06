import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCardBySlug } from "@/services/card-service"
import PublicCardView from "@/components/public-card/public-card-view"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const card = await getCardBySlug(slug)
  if (!card) return { title: "Card Not Found" }
  return {
    title: `${card.name} | SmartVisitingCard`,
    description: card.about || `Digital business card for ${card.name}`,
    openGraph: {
      title: `${card.name} | SmartVisitingCard`,
      description: card.about || `Digital business card for ${card.name}`,
      type: "profile",
    },
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params
  const card = await getCardBySlug(slug)
  if (!card) notFound()

  return <PublicCardView card={card} />
}
