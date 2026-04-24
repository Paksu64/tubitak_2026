"use client"

import { GirihPattern } from "./girih-pattern"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLang } from "@/contexts/LanguageContext"
import { LangToggle } from "@/components/lang-toggle"

export function HeroSection() {
  const { t } = useLang()

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      <GirihPattern />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

      {/* Language Toggle */}
      <div className="absolute right-6 top-6 z-20">
        <LangToggle />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/50 px-4 py-2 backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="font-[Inter] text-sm font-medium tracking-wide text-primary">
              {t.badge}
            </span>
          </div>
        </div>

        <h1 className="mb-6 max-w-5xl animate-fade-in-up font-[Playfair_Display] text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block">{t.heroLine1}</span>
          <span className="mt-2 block bg-gradient-to-r from-primary via-gold-light to-primary bg-clip-text text-transparent">
            {t.heroLine2}
          </span>
        </h1>

        <p className="mb-12 max-w-2xl animate-fade-in-up font-[Inter] text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ animationDelay: "0.2s" }}>
          {t.heroSubtitle}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            className="group relative overflow-hidden bg-primary px-8 py-6 font-[Inter] text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            asChild
          >
            <Link href="/explore">
              <span className="relative z-10 flex items-center gap-2">
                {t.exploreBtn}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="group border-primary/50 bg-transparent px-8 py-6 font-[Inter] text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10"
            asChild
          >
            <Link href="/generate">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t.generateBtn}
              </span>
            </Link>
          </Button>
        </div>

        <div className="mt-20 flex justify-center gap-12 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          {[
            { value: "5", label: t.stat1 },
            { value: "∞", label: t.stat2 },
            { value: "800+", label: t.stat3 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-[Playfair_Display] text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 font-[Inter] text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 border-l-2 border-t-2 border-primary/20" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 border-r-2 border-t-2 border-primary/20" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 border-b-2 border-l-2 border-primary/20" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 border-b-2 border-r-2 border-primary/20" />
    </section>
  )
}