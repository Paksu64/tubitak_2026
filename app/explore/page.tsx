"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUp, Mail, Linkedin, Github, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLang } from "@/contexts/LanguageContext"
import { LangToggle } from "@/components/lang-toggle"

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }

const teamMembers = [
  { name: "Deniz Filiz", photo: "/team/denizfiliz.jpeg", email: "denizfiliz09@gmail.com", linkedin: "https://linkedin.com/in/denizfiliz09", github: "https://github.com/denizflz" },
  { name: "İnci Gencer", photo: "/team/incigencer.jpg", email: "incigncr@outlook.com", linkedin: "https://linkedin.com/in/incigencer", github: "https://github.com/incigencer" },
  { name: "Poyraz Aksu", photo: "/team/poyrazaksu.jpeg", email: "poyraz@aksu.gen.tr", linkedin: "https://linkedin.com/in/poyraz-aksu-16181a2bb", github: "https://github.com/paksu64" },
]

const galleryImages = [
  { id: 1, src: "/gallery/sergi1.jpeg", alt: "Regional Exhibition Photo 1" },
  { id: 2, src: "/gallery/sergi2.jpeg", alt: "Regional Exhibition Photo 2" },
  { id: 3, src: "/gallery/sergi3.jpeg", alt: "Regional Exhibition Photo 3" },
  { id: 4, src: "/gallery/sergi4.JPG", alt: "Regional Exhibition Photo 4" },
  { id: 5, src: "/gallery/sergi5.jpeg", alt: "Regional Exhibition Photo 5" },
  { id: 6, src: "/gallery/sergi6.JPG", alt: "Regional Exhibition Photo 6" },
]

export default function ExplorePage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { t } = useLang()

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => { setShowScrollTop(window.scrollY > 500) })
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const timelineEvents = t.timeline.map((e, i) => ({ ...e, isCompleted: i < 2 }))

  return (
    <main className="min-h-screen bg-background">
      {/* Language Toggle */}
      <div className="fixed right-6 top-6 z-50">
        <LangToggle />
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center">
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/50 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="font-[Inter] text-sm font-medium tracking-wide text-primary">{t.aboutBadge}</span>
            </div>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="mb-6 font-[Playfair_Display] text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            {t.meetTeam} <span className="text-primary">{t.meetTeam2}</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mx-auto max-w-2xl font-[Inter] text-lg text-muted-foreground sm:text-xl">
            {t.teamSubtitle}
          </motion.p>
        </motion.div>
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 border-l-2 border-t-2 border-primary/20" />
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-r-2 border-t-2 border-primary/20" />
      </section>

      {/* Team Members */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} variants={scaleIn} transition={{ delay: index * 0.15 }} whileHover={{ scale: 1.02, y: -5 }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5" />
                </div>
                <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-primary/30">
                  <Image src={member.photo} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="mb-4 font-[Playfair_Display] text-2xl font-bold text-foreground">{member.name}</h3>
                <div className="flex items-center justify-center gap-4">
                  <a href={`mailto:${member.email}`} className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary" aria-label="Email"><Mail className="h-5 w-5" /></a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary" aria-label="GitHub"><Github className="h-5 w-5" /></a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center">
            <h2 className="mb-12 font-[Playfair_Display] text-4xl font-bold text-foreground">
              {t.ourTeam.split(" ")[0]} <span className="text-primary">{t.ourTeam.split(" ").slice(1).join(" ")}</span>
            </h2>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
              <Image src="/team/team-photo.jpeg" alt="Team Photo" fill className="object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-16 text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-secondary/50 px-6 py-3 backdrop-blur-sm">
              <Image src="/tubitak-logo.png" alt="TÜBİTAK" width={32} height={32} className="h-8 w-auto" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <span className="font-[Inter] text-sm font-medium text-primary">{t.tubitakBadge}</span>
            </div>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-foreground">
              {t.ourJourney.split(" ")[0]} <span className="text-primary">{t.ourJourney.split(" ").slice(1).join(" ")}</span>
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-linear-to-b from-primary via-primary/50 to-primary/20" />
            {timelineEvents.map((event, index) => (
              <motion.div key={event.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} transition={{ delay: index * 0.2 }} className={`relative mb-12 flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                  <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                    <h3 className="mb-2 font-[Playfair_Display] text-xl font-bold text-foreground">{event.title}</h3>
                    <p className="mb-2 font-[Inter] text-sm font-semibold text-primary">{event.subtitle}</p>
                    <p className="font-[Inter] text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <div className={`h-3 w-3 rounded-full ${event.isCompleted ? "bg-primary" : "bg-primary/30"}`} />
                </div>
                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-12 text-center">
            <h2 className="mb-4 font-[Playfair_Display] text-4xl font-bold text-foreground">
              {t.regionalExhibition} <span className="text-primary">{t.exhibition}</span>
            </h2>
            <p className="font-[Inter] text-muted-foreground">{t.exhibitionDesc}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <motion.div key={image.id} variants={scaleIn} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.03 }} onClick={() => setSelectedImage(image.id)} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-secondary transition-all hover:border-primary/50">
                <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-background/90 px-4 py-2 font-[Inter] text-sm font-medium text-foreground">{t.viewLabel}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-h-[80vh] max-w-4xl overflow-hidden rounded-2xl border border-border bg-card">
            <button onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/80 p-2 text-foreground transition-all hover:border-primary hover:text-primary"><X className="h-5 w-5" /></button>
            <div className="relative aspect-video w-full">
              {galleryImages.find(img => img.id === selectedImage) && (
                <Image src={galleryImages.find(img => img.id === selectedImage)!.src} alt={galleryImages.find(img => img.id === selectedImage)!.alt} fill className="object-contain" />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Project Details */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="mb-12 text-center">
            <h2 className="mb-4 font-[Playfair_Display] text-4xl font-bold text-foreground">
              {t.projectDetails} <span className="text-primary">{t.projectDetails2}</span>
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-8 md:grid-cols-3">
            {[
              { key: "S", title: t.summaryTitle, text: t.summaryText },
              { key: "P", title: t.purposeTitle, text: t.purposeText },
              { key: "M", title: t.methodTitle, text: t.methodText },
            ].map(card => (
              <motion.div key={card.key} variants={fadeInUp} className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-[Playfair_Display] text-xl font-bold text-primary">{card.key}</span>
                </div>
                <h3 className="mb-4 font-[Playfair_Display] text-2xl font-bold text-foreground">{card.title}</h3>
                <p className="font-[Inter] text-sm leading-relaxed text-muted-foreground">{card.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Back Home */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
            <div className="mb-8"><div className="mx-auto mb-8 h-px w-32 bg-linear-to-r from-transparent via-primary to-transparent" /></div>
            <Button size="lg" className="group bg-primary px-8 py-6 font-[Inter] text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25" asChild>
              <Link href="/"><ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />{t.returnHome}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {showScrollTop && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scrollToTop} className="fixed bottom-8 right-8 z-40 rounded-full border border-primary bg-primary/10 p-3 text-primary backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground" aria-label="Scroll to top">
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
      <div className="pointer-events-none fixed bottom-0 left-0 h-24 w-24 border-b-2 border-l-2 border-primary/20" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-24 w-24 border-b-2 border-r-2 border-primary/20" />
    </main>
  )
}
