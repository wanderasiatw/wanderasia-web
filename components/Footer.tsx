'use client'

import Link from 'next/link'
import { useSite } from './SiteProvider'
import { CONTACT } from '@/lib/contact'

export default function Footer() {
  const { toggleQr, lang, t, href, categories, services } = useSite()
  const open = categories.filter((c) => !c.comingSoon)
  return (
    <footer id="contact">
      <div className="wa-container">
        <div className="footer-grid">
          <div className="footer-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.svg" alt="Wander Asia 漫遊亞洲 – Tour in Taiwan" style={{ width: 200, marginBottom: 16 }} />
            <p>Your trusted local tour partner in Taiwan, with genuine local hospitality.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {open.map((c) => (
                <li key={c.key}><Link href={href(`/#tours-${c.key}`)}>{c.title[lang]}</Link></li>
              ))}
              {services.map((s) => (
                <li key={s.id}><Link href={href(`/services/${s.slug}`)}>{s.title[lang]}</Link></li>
              ))}
              <li><Link href={href('/inquire')}>{t('sendInquiry')}</Link></li>
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
