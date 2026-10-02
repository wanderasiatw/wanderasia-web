import './globals.css'
import type { Metadata } from 'next'
import { SiteProvider } from '@/components/SiteProvider'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingLine from '@/components/FloatingLine'
import LineQrModal from '@/components/LineQrModal'

export const metadata: Metadata = {
  title: 'Wander Asia - Premium Handpicked Tours Across Asia',
  description: 'Tailor-made itineraries, premium group tours, and experiences across Taiwan, Japan, Korea & Thailand.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteProvider>
          <AnnouncementBar />
          <Navbar />
          {children}
          <Footer />
          <FloatingLine />
          <LineQrModal />
        </SiteProvider>
      </body>
    </html>
  )
}
