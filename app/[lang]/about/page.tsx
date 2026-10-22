import type { Metadata } from 'next'
import { langFromParam, translate } from '@/lib/i18n'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import { HERO } from '@/lib/home-content'
import WhyChoose from '@/components/WhyChoose'
import HowItWorks from '@/components/HowItWorks'
import JsonLd from '@/components/JsonLd'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/about', { title: translate(lang, 'metaAboutTitle'), description: translate(lang, 'aboutBlurb') })
}

export default async function AboutPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navAbout'), path: '/about' },
  ])

  return (
    <main>
      <JsonLd data={crumbs} />
      <div className="page-banner">
        <div className="wa-container">
          <h1>{translate(lang, 'navAbout')}</h1>
          <p>{translate(lang, 'aboutBlurb')}</p>
        </div>
      </div>

      <section className="section">
        <div className="wa-container" style={{ maxWidth: 760 }}>
          <div className="panel flex flex-col gap-3">
            <p style={{ fontSize: 16 }}>{translate(lang, 'aboutLead')}</p>
            <p style={{ color: 'var(--stone-600)', fontSize: 14 }}>{HERO.sub[lang]}</p>
          </div>
        </div>
      </section>

      <WhyChoose />
      <HowItWorks />
    </main>
  )
}
