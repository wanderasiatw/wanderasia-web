'use client'

import Link from 'next/link'
import { useSite } from './SiteProvider'

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
            <h4>Taipei Office</h4>
            <p>No. 100, Sec. 1, Zhongxiao E. Rd., Zhongzheng Dist., Taipei City, Taiwan</p>
            <p style={{ marginTop: 6 }}>Phone: +886 2 2345 6789</p>
            <p style={{ marginTop: 6 }}>Email: info@wanderasia.tw</p>
          </div>

          <div className="footer-col">
            <h4>LINE Support</h4>
            <p>LINE ID: @wanderasia</p>
            <button onClick={toggleQr} className="btn btn-line" style={{ marginTop: 10, width: '100%' }}>
              Open LINE QR Code
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
