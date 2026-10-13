import { ChatIcon, ShieldIcon } from './Icons'

export default function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="wa-container trust-grid">
        <div className="trust-item">
          <div className="trust-icon"><ShieldIcon size={24} /></div>
          <div>
            <h4>Licensed Agency</h4>
            <p>License No. TA-2024-889 • Insured</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon" style={{ color: 'var(--whatsapp-green)', background: '#dcfce7' }}><ChatIcon size={24} /></div>
          <div>
            <h4>24/7 WhatsApp Support</h4>
            <p>Instant Multilingual Assistant</p>
          </div>
        </div>
      </div>
    </section>
  )
}
