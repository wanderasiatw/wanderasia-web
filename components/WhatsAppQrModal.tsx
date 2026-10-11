'use client'

import { useSite } from './SiteProvider'
import { CONTACT } from '@/lib/contact'

export default function WhatsAppQrModal() {
  const { qrOpen, toggleQr } = useSite()
  if (!qrOpen) return null

  return (
    <div className="modal-overlay" onClick={toggleQr}>
      <div className="modal-card" style={{ maxWidth: 320, padding: 24, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Scan WhatsApp QR</h3>
        <p style={{ fontSize: 12, color: 'var(--slate-600)', marginBottom: 16 }}>Message us on WhatsApp at {CONTACT.whatsapp}.</p>
        <div style={{ background: 'var(--slate-100)', padding: 10, borderRadius: 12, display: 'inline-block', margin: '0 auto 12px auto' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(CONTACT.whatsappUrl)}`}
            alt="WhatsApp QR"
            style={{ width: 140, height: 140 }}
          />
        </div>
        <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: '100%', marginBottom: 8 }}>
          Open in WhatsApp
        </a>
        <button onClick={toggleQr} className="btn btn-primary" style={{ width: '100%' }}>Close</button>
      </div>
    </div>
  )
}
