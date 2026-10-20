import type { Metadata } from 'next'
import { langFromParam, translate } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { TERMS } from '@/lib/terms'
import { isBookingDemo } from '@/lib/booking/server'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/terms', { title: translate(lang, 'metaTermsTitle') })
}

export default async function TermsPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return (
    <main>
      <div className="hero" style={{ padding: '50px 0' }}>
        <div className="hero-bg" />
        <div className="wa-container hero-content">
          <h1 style={{ fontSize: 30 }}>{translate(lang, 'termsTitle')}</h1>
        </div>
      </div>
      <section className="section">
        <div className="wa-container" style={{ maxWidth: 760 }}>
          {isBookingDemo() && <p className="demo-notice">{translate(lang, 'termsDraft')}</p>}
          <div className="panel terms-body">
            {TERMS[lang].map((s) => (
              <div key={s.title}>
                <h2>{s.title}</h2>
                <ul>
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
