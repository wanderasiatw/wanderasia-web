import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { SiteProvider } from '@/components/SiteProvider'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import WhatsAppQrModal from '@/components/WhatsAppQrModal'

// Brand fonts: Playfair Display for headlines, Montserrat for body text and UI
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: 'Wander Asia 漫遊亞洲 - Tour in Taiwan',
  description: 'Free tours, food tours, night & drink tours and private tours in Taiwan with a local guide.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        <SiteProvider>
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
