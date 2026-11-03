import type { Metadata } from 'next'
import { langFromParam, translate } from '@/lib/i18n'
import { cmsPageMetadata } from '@/lib/seo'
import { getPage } from '@/lib/cms'
import CmsBody from '@/components/CmsBody'
import { TERMS } from '@/lib/terms'
import { isBookingDemo } from '@/lib/booking/server'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return cmsPageMetadata(lang, '/terms', await getPage('terms'), { title: translate(lang, 'metaTermsTitle'), description: translate(lang, 'metaTermsDesc') })
}

export default async function TermsPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  // CMS Page text "Terms & conditions", once published with body text, replaces the built-in terms
  const page = await getPage('terms')
  const body = page?.body[lang] ?? []
  return (
    <main>
      <div className="hero" style={{ padding: '50px 0' }}>
        <div className="hero-bg" />
        <div className="wa-container hero-content">
          <h1 style={{ fontSize: 30 }}>{page ? page.title[lang] : translate(lang, 'termsTitle')}</h1>
          {page?.intro && <p>{page.intro[lang]}</p>}
        </div>
      </div>
      <section className="section">
        <div className="wa-container" style={{ maxWidth: 760 }}>
          {isBookingDemo() && <p className="demo-notice">{translate(lang, 'termsDraft')}</p>}
          {body.length > 0 ? (
            <CmsBody paragraphs={body} className="panel terms-body" />
          ) : (
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
          )}
        </div>
      </section>
    </main>
  )
}
