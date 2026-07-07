"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Copy,
  Clock,
  Building2,
  FileText,
  ImageIcon,
  Download,
  Share2,
  QrCode,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import SaveContact from "./save-contact";
import ShareCard from "./share-card";
import type { Card as CardType } from "@/types";

interface PublicCardViewProps {
  card: CardType;
}

function CopyButton({ text, label, isDark }: { text: string; label: string; isDark: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 2000);
  }, [text, label]);
  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer ${
        isDark ? "hover:bg-white/10 text-white/40 hover:text-white/70" : "hover:bg-black/5 text-gray-400 hover:text-gray-600"
      }`}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function getWhatsAppUrl(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("wa.me")) {
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }
  const digits = trimmed.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}`;
}

function ensureHttps(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

const SOCIAL_URLS: Record<string, (v: string) => string> = {
  whatsapp: getWhatsAppUrl,
  linkedin: (v) => {
    const url = ensureHttps(v);
    if (url.includes("linkedin.com")) return url;
    return `https://linkedin.com/in/${v.replace(/^@/, "")}`;
  },
  github: (v) => {
    const url = ensureHttps(v);
    if (url.includes("github.com")) return url;
    return `https://github.com/${v.replace(/^@/, "")}`;
  },
  twitter: (v) => {
    const url = ensureHttps(v);
    if (url.includes("twitter.com") || url.includes("x.com")) return url;
    return `https://x.com/${v.replace(/^@/, "")}`;
  },
  instagram: (v) => {
    const url = ensureHttps(v);
    if (url.includes("instagram.com")) return url;
    return `https://instagram.com/${v.replace(/^@/, "")}`;
  },
  youtube: (v) => {
    const url = ensureHttps(v);
    if (url.includes("youtube.com") || url.includes("youtu.be")) return url;
    return `https://youtube.com/@${v.replace(/^@/, "")}`;
  },
  facebook: (v) => {
    const url = ensureHttps(v);
    if (url.includes("facebook.com") || url.includes("fb.com")) return url;
    return `https://facebook.com/${v.replace(/^@/, "")}`;
  },
};

function getSocialUrl(platform: string, value: string): string {
  const builder = SOCIAL_URLS[platform];
  return builder ? builder(value) : ensureHttps(value);
}

function QuickActionButton({
  icon: Icon,
  label,
  href,
  color,
  isDark,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  href: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-2 group flex-1 min-w-0"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95"
        style={{
          background: isDark ? `${color}18` : `${color}12`,
          boxShadow: `0 2px 12px ${color}15`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <span
        className={`text-[11px] font-medium transition-colors ${
          isDark ? "text-white/50 group-hover:text-white/80" : "text-gray-500 group-hover:text-gray-800"
        }`}
      >
        {label}
      </span>
    </a>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out px-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const SOCIAL_PATHS: Record<string, string> = {
  whatsapp: `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />`,
  linkedin: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
  github: `<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>`,
  twitter: `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`,
  instagram: `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>`,
  youtube: `<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`,
  facebook: `<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>`,
};

function SocialIcon({ platform, url, primaryColor, isDark }: { platform: string; url: string; primaryColor: string; isDark: boolean }) {
  const path = SOCIAL_PATHS[platform];
  if (!path || !url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95"
      style={{
        background: isDark ? `${primaryColor}12` : `${primaryColor}10`,
        color: primaryColor,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="currentColor"
        dangerouslySetInnerHTML={{ __html: path }}
      />
    </a>
  );
}

export default function PublicCardView({ card }: PublicCardViewProps) {
  const [qrUrl, setQrUrl] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const pc = card.primaryColor || "#2563eb";
  const sc = card.secondaryColor || "#111827";
  const ff = card.fontFamily || "Inter";
  const isDark = card.theme === "dark";

  const txt = isDark ? "#f1f5f9" : "#0f172a";
  const txtSec = isDark ? "rgba(241,245,249,0.75)" : "rgba(15,23,42,0.65)";
  const txtTer = isDark ? "rgba(241,245,249,0.5)" : "rgba(15,23,42,0.5)";
  const txtMut = isDark ? "rgba(241,245,249,0.35)" : "rgba(15,23,42,0.4)";
  const txtGho = isDark ? "rgba(241,245,249,0.2)" : "rgba(15,23,42,0.25)";
  const sectionBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)";
  const sectionBd = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const sectionShadow = isDark ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.03)";
  const hoverBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";

  useEffect(() => {
    QRCode.toDataURL(pageUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: sc, light: "#ffffff00" },
    }).then(setQrUrl);
  }, [pageUrl, sc]);

  const downloadQR = useCallback(
    async (format: "png" | "svg") => {
      if (format === "png" && canvasRef.current) {
        const link = document.createElement("a");
        link.download = `${card.slug}-qr.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
      } else {
        const svg = await QRCode.toString(pageUrl, {
          type: "svg",
          color: { dark: sc, light: "#ffffff00" },
        });
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${card.slug}-qr.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
      toast.success(`QR downloaded as ${format.toUpperCase()}`);
    },
    [pageUrl, sc, card.slug]
  );

  const hasGallery = card.gallery && card.gallery.length > 0;
  const hasVisitingCard = Boolean(card.visitingCard);
  const hasSocial = card.social && Object.values(card.social).some(Boolean);
  const hasBusiness = card.business && (card.business.gst || card.business.officeHours || card.business.googleMapsLink);

  const sectionStyle = {
    background: sectionBg,
    border: `1px solid ${sectionBd}`,
    boxShadow: sectionShadow,
  };

  const ThemeGradient = () => {
    if (card.theme === "luxury") return "bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700";
    if (card.theme === "developer") return "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900";
    if (card.theme === "creative") return "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500";
    if (card.theme === "startup") return "bg-gradient-to-br from-violet-600 via-pink-500 to-orange-500";
    if (card.theme === "dark") return "bg-gradient-to-br from-gray-900 via-slate-900 to-black";
    if (card.theme === "light") return "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50";
    if (card.theme === "medical") return "bg-gradient-to-br from-emerald-500 to-teal-600";
    if (card.theme === "education") return "bg-gradient-to-br from-orange-500 to-rose-600";
    if (card.theme === "real-estate") return "bg-gradient-to-br from-teal-600 to-cyan-700";
    if (card.theme === "minimal") return "bg-gradient-to-br from-slate-800 to-slate-900";
    return "";
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: ff,
        background: isDark
          ? "linear-gradient(180deg, #0a0a1a 0%, #0d0d24 50%, #0a0a1a 100%)"
          : "linear-gradient(180deg, #f0f4f8 0%, #e8ecf1 50%, #f0f4f8 100%)",
      }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-[100px] opacity-20" style={{ background: pc }} />
        <div className="absolute top-1/3 -left-24 w-56 h-56 rounded-full blur-[80px] opacity-10" style={{ background: pc }} />
        <div className="absolute -bottom-32 right-1/4 w-64 h-64 rounded-full blur-[90px] opacity-15" style={{ background: sc }} />
      </div>

      <div className="max-w-lg mx-auto relative z-10 pb-10 px-4 mt-2">
        {/* ── Hero Section ── */}
        <AnimatedSection delay={0}>
          <div
            className={`relative py-8 px-6 text-center overflow-hidden ${ThemeGradient()}`}
            style={{
              borderRadius: "1rem",
              background: ThemeGradient() ? undefined : `linear-gradient(135deg, ${pc}, ${sc})`,
              boxShadow: `0 8px 32px ${pc}30, 0 2px 8px rgba(0,0,0,0.1)`,
            }}
          >
            {/* Decorative shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/[0.06]" />
              <div className="absolute top-1/2 -right-12 w-40 h-40 rounded-full bg-white/[0.04]" />
              <div className="absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-white/[0.05]" />
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Company Logo */}
            {card.companyLogo && (
              <div className="relative z-10 mb-5">
                <div className="inline-block p-2 rounded-xl backdrop-blur-sm border border-white/20 bg-white">
                  <img src={card.companyLogo} alt={card.company} className="h-8 object-contain rounded-xl" />
                </div>
              </div>
            )}

            {/* Profile Photo */}
            <div className="relative z-10 mb-5 inline-block">
              <div className="relative">
                <div
                  className="rounded-full p-[3px]"
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))` }}
                >
                  {card.profileImage ? (
                    <img src={card.profileImage} alt={card.name} className="h-28 w-28 rounded-full object-cover" />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold backdrop-blur-sm">
                      {card.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="relative z-10">
              <h1 className="text-[1.65rem] font-bold text-white mb-1 tracking-tight">{card.name}</h1>
              <p className="text-white text-sm font-medium tracking-wide text-[18px]">{card.designation}</p>
              {card.company && (
                <p className="text-white text-xs mt-1.5 flex items-center justify-center gap-1.5 text-[16px]">
                  {" "}
                  <Building2 className="h-3 w-3" /> {card.company}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Quick Actions ── */}
        <AnimatedSection delay={80} className="my-5 px-1">
          <div className="rounded-2xl p-5 backdrop-blur-sm" style={sectionStyle}>
            <div className="flex justify-around gap-2">
              {card.phone && <QuickActionButton icon={Phone} label="Call" href={`tel:${card.phone}`} color={pc} isDark={isDark} />}
              {card.social?.whatsapp && (
                <QuickActionButton icon={WhatsAppIcon} label="WhatsApp" href={getSocialUrl("whatsapp", card.social.whatsapp)} color="#25D366" isDark={isDark} />
              )}
              {card.email && <QuickActionButton icon={Mail} label="Email" href={`mailto:${card.email}`} color={pc} isDark={isDark} />}
              {card.website && <QuickActionButton icon={Globe} label="Website" href={ensureHttps(card.website)} color={pc} isDark={isDark} />}
              {card.address && (
                <QuickActionButton
                  icon={MapPin}
                  label="Map"
                  href={`https://maps.google.com/?q=${encodeURIComponent(card.address)}`}
                  color="#ef4444"
                  isDark={isDark}
                />
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Visiting Card ── */}
        {hasVisitingCard && (
          <AnimatedSection delay={100} className="mb-5">
            <div className="rounded-2xl overflow-hidden backdrop-blur-sm" style={sectionStyle}>
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                    Visiting Card
                  </h3>
                </div>
              </div>
              <div className="px-5 pb-5">
                <img
                  src={card.visitingCard}
                  alt={`${card.name} visiting card`}
                  className="w-full rounded-xl shadow-lg border border-white/10"
                />
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ── About ── */}
        {card.about && (
          <AnimatedSection delay={120} className="mb-5">
            <div className="rounded-2xl p-5 backdrop-blur-sm" style={sectionStyle}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
                <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                  About
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[14px]" style={{ color: txtSec }}>
                {card.about}
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* ── Contact Details ── */}
        <AnimatedSection delay={160} className="mb-5">
          <div className="rounded-2xl p-5 backdrop-blur-sm" style={sectionStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
              <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                Contact
              </h3>
            </div>
            <div className="space-y-3">
              {card.phone && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                      style={{ background: `${pc}10` }}
                    >
                      <Phone className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Phone
                      </p>
                      <a href={`tel:${card.phone}`} className="text-sm font-medium hover:underline block truncate" style={{ color: txt }}>
                        {card.phone}
                      </a>
                    </div>
                  </div>
                  <CopyButton text={card.phone} label="Phone" isDark={isDark} />
                </div>
              )}
              {card.alternatePhone && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pc}10` }}>
                      <Phone className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Alternate
                      </p>
                      <p className="text-sm" style={{ color: txt }}>
                        {card.alternatePhone}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={card.alternatePhone} label="Alternate Phone" isDark={isDark} />
                </div>
              )}
              {card.email && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pc}10` }}>
                      <Mail className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Email
                      </p>
                      <a
                        href={`mailto:${card.email}`}
                        className="text-sm font-medium hover:underline block truncate"
                        style={{ color: txt }}
                      >
                        {card.email}
                      </a>
                    </div>
                  </div>
                  <CopyButton text={card.email} label="Email" isDark={isDark} />
                </div>
              )}
              {card.website && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pc}10` }}>
                      <Globe className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Website
                      </p>
                      <a
                        href={card.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline block truncate"
                        style={{ color: txt }}
                      >
                        {card.website}
                      </a>
                    </div>
                  </div>
                  <CopyButton text={card.website} label="Website" isDark={isDark} />
                </div>
              )}
              {card.address && (
                <div className="flex items-start justify-between group">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${pc}10` }}>
                      <MapPin className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Address
                      </p>
                      <p className="text-sm" style={{ color: txt }}>
                        {card.address}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={card.address} label="Address" isDark={isDark} />
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Primary Action Buttons ── */}
        <AnimatedSection delay={200} className="mb-5">
          <div className="flex flex-col gap-3">
            <SaveContact card={card}>
              <Button
                className="w-full h-13 rounded-2xl font-semibold text-[15px] gap-2.5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-0"
                style={{
                  background: `linear-gradient(135deg, ${pc}, ${sc})`,
                  color: "#fff",
                  boxShadow: `0 4px 20px ${pc}35`,
                }}
              >
                <Download className="h-5 w-5" />
                Save Contact
              </Button>
            </SaveContact>
            <ShareCard card={card} url={pageUrl}>
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl font-medium text-sm gap-2.5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  borderColor: `${pc}30`,
                  color: pc,
                  background: `${pc}08`,
                }}
              >
                <Share2 className="h-4.5 w-4.5" />
                Share Card
              </Button>
            </ShareCard>
            {hasVisitingCard && (
              <a href={card.visitingCard} download={`visiting-card-${card.slug}.png`}>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl font-medium text-sm gap-2.5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    borderColor: `${pc}30`,
                    color: pc,
                    background: `${pc}08`,
                  }}
                >
                  <ImageIcon className="h-4.5 w-4.5" />
                  Download Visiting Card
                </Button>
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* ── Business Info ── */}
        {hasBusiness && (
          <AnimatedSection delay={240} className="mb-5">
            <div className="rounded-2xl p-5 backdrop-blur-sm" style={sectionStyle}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
                <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                  Business Info
                </h3>
              </div>
              <div className="space-y-3">
                {card.business.gst && (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pc}10` }}>
                      <Building2 className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        GST
                      </p>
                      <p className="text-sm" style={{ color: txt }}>
                        {card.business.gst}
                      </p>
                    </div>
                  </div>
                )}
                {card.business.officeHours && (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pc}10` }}>
                      <Clock className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Office Hours
                      </p>
                      <p className="text-sm" style={{ color: txt }}>
                        {card.business.officeHours}
                      </p>
                    </div>
                  </div>
                )}
                {card.business.googleMapsLink && (
                  <a
                    href={card.business.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                      style={{ background: `${pc}10` }}
                    >
                      <MapPin className="h-4 w-4" style={{ color: pc }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: txtMut }}>
                        Location
                      </p>
                      <p className="text-sm group-hover:underline" style={{ color: txt }}>
                        Open in Google Maps
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: txtMut }} />
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ── Gallery ── */}
        {hasGallery && (
          <AnimatedSection delay={280} className="mb-5">
            <div className="rounded-2xl p-5 backdrop-blur-sm" style={sectionStyle}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
                <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                  Gallery
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {card.gallery!.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border cursor-pointer"
                    style={{ borderColor: sectionBd }}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <Camera className="h-4 w-4 text-white drop-shadow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ── Social Links ── */}
        {hasSocial && (
          <AnimatedSection delay={320} className="mb-5">
            <div className="rounded-2xl p-5 backdrop-blur-sm" style={sectionStyle}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
                <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                  Connect
                </h3>
              </div>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {card.social?.whatsapp && (
                  <SocialIcon platform="whatsapp" url={getSocialUrl("whatsapp", card.social.whatsapp)} primaryColor="#25D366" isDark={isDark} />
                )}
                {card.social?.linkedin && <SocialIcon platform="linkedin" url={getSocialUrl("linkedin", card.social.linkedin)} primaryColor={pc} isDark={isDark} />}
                {card.social?.github && <SocialIcon platform="github" url={getSocialUrl("github", card.social.github)} primaryColor={pc} isDark={isDark} />}
                {card.social?.twitter && <SocialIcon platform="twitter" url={getSocialUrl("twitter", card.social.twitter)} primaryColor="#000000" isDark={isDark} />}
                {card.social?.instagram && (
                  <SocialIcon platform="instagram" url={getSocialUrl("instagram", card.social.instagram)} primaryColor="#E4405F" isDark={isDark} />
                )}
                {card.social?.youtube && <SocialIcon platform="youtube" url={getSocialUrl("youtube", card.social.youtube)} primaryColor="#FF0000" isDark={isDark} />}
                {card.social?.facebook && (
                  <SocialIcon platform="facebook" url={getSocialUrl("facebook", card.social.facebook)} primaryColor="#1877F2" isDark={isDark} />
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ── QR Code ── */}
        <AnimatedSection delay={360} className="mb-5">
          <div className="rounded-2xl p-6 backdrop-blur-sm text-center" style={sectionStyle}>
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-1 h-4 rounded-full" style={{ background: pc }} />
              <h3 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: pc }}>
                <QrCode className="h-3 w-3 inline mr-1" /> Scan to Share
              </h3>
            </div>
            <div ref={qrRef} className="flex justify-center mb-5">
              {qrUrl ? (
                <div className="p-3 rounded-2xl shadow-lg inline-block" style={{ background: isDark ? "#ffffff" : "#ffffff" }}>
                  <img src={qrUrl} alt="QR Code" className="h-44 w-44" style={{ imageRendering: "pixelated" }} />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              ) : (
                <div className="h-36 w-36 rounded-2xl animate-pulse" style={{ background: hoverBg }} />
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs rounded-xl h-9 px-4 transition-all cursor-pointer ${
                  isDark ? "border-white/10 hover:bg-white/5" : "border-gray hover:bg-gray-50"
                }`}
                style={{ color: "#fff", background: `linear-gradient(135deg, ${pc}, ${sc})` }}
                onClick={() => downloadQR("png")}
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs rounded-xl h-9 px-4 transition-all cursor-pointer ${
                  isDark ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-gray-50"
                }`}
                style={{ color: "#fff", background: `linear-gradient(135deg, ${pc}, ${sc})` }}
                onClick={() => downloadQR("svg")}
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                SVG
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Footer ── */}
        <AnimatedSection delay={400}>
          <p className="text-center text-[11px] py-4" style={{ color: txtGho }}>
            Powered by{" "}
            <span className="font-semibold" style={{ color: `${pc}80` }}>
              Smart Visiting Card
            </span>
          </p>
        </AnimatedSection>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && hasGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightboxOpen(false)}>
          <button
            className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {card.gallery!.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i - 1 + card.gallery!.length) % card.gallery!.length);
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i + 1) % card.gallery!.length);
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={card.gallery![lightboxIndex]}
            alt="Full size"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {card.gallery!.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-sm text-white/80 border border-white/10">
              {lightboxIndex + 1} / {card.gallery!.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
