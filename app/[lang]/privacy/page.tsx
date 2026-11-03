import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/cms'
import { langFromParam, translate } from '@/lib/i18n'
import { cmsPageMetadata } from '@/lib/seo'
import CmsBody from '@/components/CmsBody'

// The privacy policy is written in CMS Page text "Privacy policy"; there is no built-in text, so the page
// stays "not found" until it is published there
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return cmsPageMetadata(lang, '/privacy', await getPage('privacy'), { title: `${translate(lang, 'navPrivacy')} | ${translate(lang, 'siteName')}` })
}

export default async function PrivacyPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const page = await getPage('privacy')
  if (!page) notFound()
  return (
    <main>
      <div className="hero" style={{ padding: '50px 0' }}>
        <div className="hero-bg" />
        <div className="wa-container hero-content">
          <h1 style={{ fontSize: 30 }}>{page.title[lang]}</h1>
          {page.intro && <p>{page.intro[lang]}</p>}
        </div>
      </div>
      <section className="section">
        <div className="wa-container" style={{ maxWidth: 760 }}>
          <CmsBody paragraphs={page.body[lang]} className="panel terms-body" />
        </div>
      </section>
    </main>
  )
}
