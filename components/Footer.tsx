'use client'

import Link from 'next/link'
import { useSite } from './SiteProvider'
import { CONTACT } from '@/lib/contact'

export default function Footer() {
  const { toggleQr } = useSite()
  return (
    <footer id="contact">
      <div className="wa-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{ color: 'white', fontSize: 16 }}>Wander Asia</h4>
            <p style={{ marginBottom: 12 }}>Your trusted travel partner across East &amp; Southeast Asia with local hospitality.</p>
            <p>License: TA-2024-889</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/tours">Japan Packages</Link></li>
              <li><Link href="/tours">Taiwan Highlights</Link></li>
              <li><Link href="/tours">Korea Snow Tours</Link></li>
              <li><Link href="/#about">Custom Travel</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>New Taipei Office</h4>
            <p lang="zh-Hant">{CONTACT.addressZh}</p>
            <p>{CONTACT.addressEn}</p>
            <p style={{ marginTop: 6 }}>Phone: <a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <p style={{ marginTop: 6 }}>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          </div>

          <div className="footer-col">
            <h4>WhatsApp Support</h4>
            <p>WhatsApp: <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer">{CONTACT.whatsapp}</a></p>
            <button onClick={toggleQr} className="btn btn-whatsapp" style={{ marginTop: 10, width: '100%' }}>
              Open WhatsApp QR Code
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 20, fontSize: 11 }}>
          © {new Date().getFullYear()} Wander Asia Travel Agency. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
