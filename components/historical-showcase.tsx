"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useLang } from "@/contexts/LanguageContext"

function GeometricDivider() {
  return (
    <div className="relative flex h-24 items-center justify-center overflow-hidden">
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="relative flex items-center gap-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-primary/40" fill="none" stroke="currentColor" strokeWidth="1">
          <polygon points="20,2 38,20 20,38 2,20" />
          <polygon points="20,8 32,20 20,32 8,20" />
          <line x1="20" y1="2" x2="20" y2="38" />
          <line x1="2" y1="20" x2="38" y2="20" />
        </svg>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
      </div>
    </div>
  )
}

function BackgroundGirihMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`absolute opacity-[0.03] ${className}`} fill="none" stroke="currentColor">
      <g strokeWidth="0.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const angle1 = (i * 36 * Math.PI) / 180
          const angle2 = ((i + 1) * 36 * Math.PI) / 180
          const r1 = 90, r2 = 50, cx = 100, cy = 100
          return (
            <g key={i}>
              <line x1={cx + r1 * Math.cos(angle1)} y1={cy + r1 * Math.sin(angle1)} x2={cx + r2 * Math.cos((angle1 + angle2) / 2)} y2={cy + r2 * Math.sin((angle1 + angle2) / 2)} />
              <line x1={cx + r2 * Math.cos((angle1 + angle2) / 2)} y1={cy + r2 * Math.sin((angle1 + angle2) / 2)} x2={cx + r1 * Math.cos(angle2)} y2={cy + r1 * Math.sin(angle2)} />
            </g>
          )
        })}
        <circle cx="100" cy="100" r="90" />
        <circle cx="100" cy="100" r="50" />
      </g>
    </svg>
  )
}

function ShowcaseSection({ site, index }: { site: typeof import("@/lib/i18n").translations["tr"]["sites"][0]; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const isEven = index % 2 === 0

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${isEven ? "" : "lg:flex-row-reverse"}`}>
          <motion.div className="relative flex-1" initial={{ opacity: 0, x: isEven ? -80 : 80 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <motion.div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-primary/20 bg-secondary/30" style={{ y: parallaxY }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <svg className="h-16 w-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-[Inter] text-xs text-muted-foreground/60">{site.name}</span>
              </div>
              <div className="absolute left-2 top-2 h-8 w-8 border-l border-t border-primary/40" />
              <div className="absolute right-2 top-2 h-8 w-8 border-r border-t border-primary/40" />
              <div className="absolute bottom-2 left-2 h-8 w-8 border-b border-l border-primary/40" />
              <div className="absolute bottom-2 right-2 h-8 w-8 border-b border-r border-primary/40" />
            </motion.div>
          </motion.div>

          <div className="flex flex-1 flex-col gap-8">
            <motion.div className="relative" initial={{ opacity: 0, x: isEven ? 80 : -80 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}>
              <motion.div className="relative aspect-square max-w-sm overflow-hidden rounded-lg border border-primary/30 bg-secondary/20" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                  <svg className="h-12 w-12 text-primary/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                    <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
                    <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" />
                    <line x1="50" y1="5" x2="50" y2="20" /><line x1="95" y1="27.5" x2="80" y2="35" />
                    <line x1="95" y1="72.5" x2="80" y2="65" /><line x1="50" y1="95" x2="50" y2="80" />
                    <line x1="5" y1="72.5" x2="20" y2="65" /><line x1="5" y1="27.5" x2="20" y2="35" />
                  </svg>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
              </motion.div>
            </motion.div>

            <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}>
              <div className="flex items-center gap-3">
                <span className="font-[Inter] text-xs font-medium uppercase tracking-widest text-primary">{site.date}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <h3 className="font-[Playfair_Display] text-3xl font-bold text-foreground lg:text-4xl">{site.name}</h3>
              <p className="font-[Inter] text-sm font-medium text-primary/80">{site.location}</p>
              <p className="font-[Inter] text-base leading-relaxed text-muted-foreground">{site.description}</p>
              <p className="font-[Inter] text-sm italic leading-relaxed text-muted-foreground/80">{site.significance}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HistoricalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useLang()

  return (
    <div ref={containerRef} id="about" className="relative overflow-hidden bg-background">
      <BackgroundGirihMotif className="text-primary left-0 top-[10%] h-96 w-96 -translate-x-1/2" />
      <BackgroundGirihMotif className="text-primary right-0 top-[30%] h-80 w-80 translate-x-1/2" />
      <BackgroundGirihMotif className="text-primary left-1/4 top-[50%] h-64 w-64" />
      <BackgroundGirihMotif className="text-primary right-1/4 top-[70%] h-72 w-72" />
      <BackgroundGirihMotif className="text-primary left-0 bottom-[10%] h-96 w-96 -translate-x-1/3" />

      <div className="relative py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mx-auto max-w-3xl px-4">
          <span className="mb-4 inline-block font-[Inter] text-xs font-medium uppercase tracking-widest text-primary">
            {t.historicalBadge}
          </span>
          <h2 className="mb-6 font-[Playfair_Display] text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            <span className="text-balance">{t.historicalTitle1}</span>{" "}
            <span className="bg-gradient-to-r from-primary via-gold-light to-primary bg-clip-text text-transparent">
              {t.historicalTitle2}
            </span>
          </h2>
          <p className="font-[Inter] text-lg leading-relaxed text-muted-foreground">{t.historicalSubtitle}</p>
        </motion.div>
      </div>

      <GeometricDivider />

      {t.sites.map((site, index) => (
        <div key={site.name}>
          <ShowcaseSection site={site} index={index} />
          {index < t.sites.length - 1 && <GeometricDivider />}
        </div>
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h3 className="mb-6 font-[Playfair_Display] text-3xl font-bold text-foreground">{t.ctaTitle}</h3>
          <p className="mb-8 font-[Inter] text-muted-foreground">{t.ctaDesc}</p>
          <motion.a href="/generate" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-[Inter] font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {t.ctaBtn}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </div>
  )
}
