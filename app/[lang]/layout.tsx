import '../globals.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { SiteProvider } from '@/components/SiteProvider'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { getAllTours, getCategories, getPublishedPageSlugs, getServices } from '@/lib/cms'
import WhatsAppQrModal from '@/components/WhatsAppQrModal'
import { HTML_LANG, langFromParam, translate } from '@/lib/i18n'
import { siteUrl } from '@/lib/seo'

// Brand fonts: Playfair Display for headlines, Montserrat for body text and UI
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return {
    metadataBase: new URL(siteUrl()),
    title: translate(lang, 'metaTitle'),
    description: translate(lang, 'metaDesc'),
    // Google Search Console ownership tag: set GOOGLE_SITE_VERIFICATION in wrangler.jsonc vars
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  }
}

export default async function RootLayout({ children, params }: Props) {
  // English pages have no prefix in the address; middleware.ts serves them from /en internally
  const lang = langFromParam((await params).lang)
  if (!lang) notFound()
  const [rawCategories, services, tours, pages] = await Promise.all([getCategories(), getServices(), getAllTours(), getPublishedPageSlugs()])
  // Footer links go only to categories that have a tour ready to book, whatever the category's own "coming soon" flag says
  const ready = tours.filter((t) => !t.comingSoon)
  const categories = rawCategories.map((c) => ({
    ...c,
    hasTours: ready.some((t) => t.category === c.key) || (c.key === 'free' && ready.some((t) => t.price === 0)),
  }))
  // Cloudflare Web Analytics (free, cookie-less): set CF_BEACON_TOKEN in wrangler.jsonc vars to switch it on
  const beaconToken = process.env.CF_BEACON_TOKEN

  return (
    <html lang={HTML_LANG[lang]} className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        <SiteProvider lang={lang} categories={categories} services={services} pages={pages}>
          <AnnouncementBar />
          <Navbar />
          {children}
          <Footer />
          <FloatingWhatsApp />
          <WhatsAppQrModal />
        </SiteProvider>
        {beaconToken && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: beaconToken })} />
        )}
      </body>
    </html>
  )
}
