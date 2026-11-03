import type { Metadata } from 'next'
import { getPage } from '@/lib/cms'
import { langFromParam, translate } from '@/lib/i18n'
import { breadcrumbJsonLd, cmsPageMetadata } from '@/lib/seo'
import { HERO } from '@/lib/home-content'
import WhyChoose from '@/components/WhyChoose'
import HowItWorks from '@/components/HowItWorks'
import JsonLd from '@/components/JsonLd'
import CmsBody from '@/components/CmsBody'

// Rendered on each request so CMS Page text "About us" shows up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return cmsPageMetadata(lang, '/about', await getPage('about'), { title: translate(lang, 'metaAboutTitle'), description: translate(lang, 'aboutBlurb') })
}

export default async function AboutPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const page = await getPage('about')
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navAbout'), path: '/about' },
  ])
  const body = page?.body[lang] ?? []

  return (
    <main>
      <JsonLd data={crumbs} />
      <div className="page-banner">
        <div className="wa-container">
          <h1>{page ? page.title[lang] : translate(lang, 'navAbout')}</h1>
          <p>{page?.intro?.[lang] ?? translate(lang, 'aboutBlurb')}</p>
        </div>
      </div>

      <section className="section">
        <div className="wa-container" style={{ maxWidth: 760 }}>
          <div className="panel flex flex-col gap-3">
            {page?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.image} alt={page.title[lang]} style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover', maxHeight: 420 }} />
            )}
            {body.length > 0 ? (
              <CmsBody paragraphs={body} className="cms-body" />
            ) : (
              <>
                <p style={{ fontSize: 16 }}>{translate(lang, 'aboutLead')}</p>
                <p style={{ color: 'var(--stone-600)', fontSize: 14 }}>{HERO.sub[lang]}</p>
              </>
            )}
          </div>
        </div>
      </section>

      <WhyChoose />
      <HowItWorks />
    </main>
  )
}
