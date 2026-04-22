"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { translations, Lang } from "@/lib/i18n"

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof translations["tr"]
}

const LanguageContext = createContext<LangCtx>({
  lang: "tr",
  setLang: () => {},
  t: translations["tr"],
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("tr")
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
