'use client'

import { useSite } from './SiteProvider'

export default function LineQrModal() {
  const { qrOpen, toggleQr } = useSite()
  if (!qrOpen) return null

  return (
    <div className="modal-overlay" onClick={toggleQr}>
      <div className="modal-card" style={{ maxWidth: 320, padding: 24, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Scan LINE QR</h3>
        <p style={{ fontSize: 12, color: 'var(--slate-600)', marginBottom: 16 }}>Add @wanderasia on LINE to chat with us.</p>
        <div style={{ background: 'var(--slate-100)', padding: 10, borderRadius: 12, display: 'inline-block', margin: '0 auto 12px auto' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://line.me/R/ti/p/@wanderasia"
            alt="LINE QR"
            style={{ width: 140, height: 140 }}
          />
        </div>
        <a href="https://line.me/R/ti/p/@wanderasia" target="_blank" rel="noreferrer" className="btn btn-line" style={{ width: '100%', marginBottom: 8 }}>
          Open in LINE
        </a>
        <button onClick={toggleQr} className="btn btn-primary" style={{ width: '100%' }}>Close</button>
      </div>
    </div>
  )
}
