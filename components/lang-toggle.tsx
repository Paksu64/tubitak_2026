"use client"

import { useLang } from "@/contexts/LanguageContext"

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      className={`inline-flex items-center gap-1 rounded-full border border-primary/40 bg-secondary/50 px-3 py-1 font-[Inter] text-xs font-semibold text-primary backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10 ${className ?? ""}`}
      aria-label="Switch language"
    >
      <span className={lang === "tr" ? "opacity-100" : "opacity-40"}>TR</span>
      <span className="opacity-30">|</span>
      <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
    </button>
  )
}
