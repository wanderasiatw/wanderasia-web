'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Category, Service } from '@/lib/tours'
import { DICT, localePath, type DictKey, type Lang } from '@/lib/i18n'

export type { DictKey, Lang } from '@/lib/i18n'

interface SiteState {
  /** The page's language, from its URL (/zh/... is Chinese) */
  lang: Lang
  t: (key: DictKey) => string
  /** A site path in the page's language, e.g. '/tours' → '/zh/tours' on Chinese pages */
  href: (path: string) => string
  qrOpen: boolean
  toggleQr: () => void
  /** Tour category rows, from the CMS */
  categories: Category[]
  /** Published services, from the CMS */
  services: Service[]
}

const SiteContext = createContext<SiteState | null>(null)

export function SiteProvider({ children, lang, categories, services }: { children: ReactNode; lang: Lang; categories: Category[]; services: Service[] }) {
  const [qrOpen, setQrOpen] = useState(false)

  const t = useCallback((key: DictKey) => DICT[lang][key] as string, [lang])
  const href = useCallback((path: string) => localePath(lang, path), [lang])
  const toggleQr = useCallback(() => setQrOpen((o) => !o), [])

  return (
    <SiteContext.Provider value={{ lang, t, href, qrOpen, toggleQr, categories, services }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>')
  return ctx
}

/** Jump to the tours section (or one category row of it), on any page */
export function scrollToTours(id = 'tours', lang: Lang = 'EN') {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else window.location.href = localePath(lang, `/#${id}`)
}
