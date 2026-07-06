"use client"

import { useState, type ReactNode } from "react"
import { Copy, MessageCircle, Send, Mail, Smartphone } from "lucide-react"
import { toast } from "sonner"
import type { Card } from "@/types"

interface ShareCardProps {
  card: Card
  url: string
  children?: ReactNode
}

export default function ShareCard({ card, url, children }: ShareCardProps) {
  const [open, setOpen] = useState(false)
  const text = `Check out ${card.name}'s digital business card!`

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${card.name} | SmartVisitingCard`, text, url })
        return
      } catch {
        // user cancelled
      }
    }
    setOpen(!open)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard")
    setOpen(false)
  }

  return (
    <div className="relative">
      {children ? (
        <div onClick={handleNativeShare}>{children}</div>
      ) : (
        <button
          onClick={handleNativeShare}
          className="w-full h-12 rounded-xl font-medium text-base gap-2 border border-input bg-background hover:bg-accent transition-all duration-300 flex items-center justify-center"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Card
        </button>
      )}

      {open && (
        <div className="mt-3 p-5 rounded-2xl border bg-card/95 backdrop-blur shadow-xl animate-scale-in">
          <p className="text-sm font-medium mb-4 text-center">Share via</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => setOpen(false)}
            >
              <div className="h-12 w-12 rounded-2xl bg-[#25D366] flex items-center justify-center transition-transform group-hover:scale-110">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] text-muted-foreground">WhatsApp</span>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => setOpen(false)}
            >
              <div className="h-12 w-12 rounded-2xl bg-[#0088cc] flex items-center justify-center transition-transform group-hover:scale-110">
                <Send className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] text-muted-foreground">Telegram</span>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(`${card.name} | SmartVisitingCard`)}&body=${encodeURIComponent(text + "\n\n" + url)}`}
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => setOpen(false)}
            >
              <div className="h-12 w-12 rounded-2xl bg-muted-foreground/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">Email</span>
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(text + " " + url)}`}
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => setOpen(false)}
            >
              <div className="h-12 w-12 rounded-2xl bg-muted-foreground/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">SMS</span>
            </a>
            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="h-12 w-12 rounded-2xl bg-muted-foreground/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <Copy className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
