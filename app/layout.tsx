import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FloatingLine from '@/components/FloatingLine'

const inter = Inter({ subsets: ['latin'] })

export className Metadata {
  static title = 'Wander Asia (Taiwan) | Explore Asia\'s Wonders'
  static description = 'Tailor-made itineraries, premium group tours, and experiences across Taiwan & Asia.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <FloatingLine />
      </body>
    </html>
  )
}
