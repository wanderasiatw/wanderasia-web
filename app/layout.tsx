import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { SiteProvider } from '@/components/SiteProvider'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { getCategories, getServices } from '@/lib/cms'
import WhatsAppQrModal from '@/components/WhatsAppQrModal'

// Brand fonts: Playfair Display for headlines, Montserrat for body text and UI
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://wanderasia.tw'),
  title: 'Wander Asia 漫遊亞洲 - Tour in Taiwan',
  description: 'Free tours, food tours, night & drink tours and private tours in Taiwan with a local guide.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, services] = await Promise.all([getCategories(), getServices()])

  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        <SiteProvider categories={categories} services={services}>
          <AnnouncementBar />
          <Navbar />
          {children}
          <Footer />
          <FloatingWhatsApp />
          <WhatsAppQrModal />
        </SiteProvider>
      </body>
    </html>
  )
}
