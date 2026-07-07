"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CreditCard, Activity, ArrowRight, Plus, Eye } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DashboardCard {
  id: string;
  slug: string;
  name: string;
  designation: string;
  company: string;
  theme: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (u?.name) setUserName(u.name.split(" ")[0]);
      })
      .catch(() => {});
    fetch("/api/cards")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCards(list);
        setTotalCards(list.length);
      })
      .catch(() => {});
  }, []);

  const recentCards = cards.slice(0, 5);

  const stats = [
    {
      title: "Total Cards",
      value: totalCards,
      description: "Cards in your collection",
      icon: CreditCard,
      color: "#3b82f6",
    },
    {
      title: "Active Cards",
      value: totalCards,
      description: "Published and live",
      icon: Eye,
      color: "#10b981",
    },
    {
      title: "Recent Updates",
      value: recentCards.length,
      description: "Updated recently",
      icon: Activity,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back,
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> {userName}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your digital cards.</p>
        </div>
        <Link
          href="/dashboard/cards/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          New Card
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="group animate-fade-in-up">
              <div className="rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{stat.description}</p>
                </div>
                <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${stat.color}, ${stat.color}80)` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recent Cards</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Your most recently updated digital business cards.</p>
              </div>
              <Link
                href="/dashboard/cards"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="px-4 pb-6">
            {recentCards.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No cards yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Create your first digital business card.</p>
                <Link
                  href="/dashboard/cards/new"
                  className="inline-flex items-center gap-1.5 mt-4 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Card
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCards.map((card, i) => (
                  <Link
                    key={card.id}
                    href={`/dashboard/cards/${card.slug}/edit`}
                    className="flex items-center justify-between py-2 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                        {getInitials(card.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{card.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {card.designation} · {card.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center shrink-0">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                        {card.theme}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{formatDate(card.updatedAt)}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-primary transition-all duration-200" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
