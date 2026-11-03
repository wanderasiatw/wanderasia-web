import type { Metadata } from 'next'
import Link from 'next/link'
import { getFaqs, getPage } from '@/lib/cms'
import { CONTACT, whatsappLink } from '@/lib/contact'
import { langFromParam, localePath, translate, type DictKey } from '@/lib/i18n'
import { breadcrumbJsonLd, cmsPageMetadata } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import CmsBody from '@/components/CmsBody'
import { WhatsAppIcon } from '@/components/Icons'

// Help & FAQ: the page text from CMS Page text "Help & FAQ", the questions from the CMS FAQ list, then
// WhatsApp, the support email and the inquiry form
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

/** FAQ groups in the CMS (config faqGroups), in the order they are shown */
const GROUPS: { key: string; label: DictKey }[] = [
  { key: 'booking', label: 'faqBooking' },
  { key: 'tours', label: 'faqTours' },
  { key: 'hiking', label: 'faqHiking' },
  { key: 'other', label: 'faqOther' },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return cmsPageMetadata(lang, '/help', await getPage('help'), { title: translate(lang, 'metaHelpTitle'), description: translate(lang, 'helpBlurb') })
}

export default async function HelpPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const [page, faqs] = await Promise.all([getPage('help'), getFaqs()])
  const body = page?.body[lang] ?? []
  const groups = GROUPS.map((g) => ({ ...g, items: faqs.filter((f) => (GROUPS.some((x) => x.key === f.group) ? f.group : 'other') === g.key) })).filter((g) => g.items.length > 0)
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navHelp'), path: '/help' },
  ])
  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question[lang], acceptedAnswer: { '@type': 'Answer', text: f.answer[lang] } })),
        }
      : null

  return (
    <main>
      <JsonLd data={crumbs} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <div className="page-banner">
        <div className="wa-container">
          <h1>{page ? page.title[lang] : translate(lang, 'navHelp')}</h1>
          <p>{page?.intro?.[lang] ?? translate(lang, 'helpBlurb')}</p>
        </div>
      </div>

      <section className="section">
        <div className="wa-container flex flex-col gap-6" style={{ maxWidth: 820 }}>
          {body.length > 0 && <CmsBody paragraphs={body} className="panel cms-body" />}

          {groups.map((g) => (
            <div key={g.key} className="flex flex-col gap-3">
              {groups.length > 1 && <h2 className="section-title" style={{ fontSize: 20 }}>{translate(lang, g.label)}</h2>}
              <div className="pt-faq">
                {g.items.map((f, i) => (
                  <details key={f.question.EN + i}>
                    <summary>{f.question[lang]}</summary>
                    <p style={{ whiteSpace: 'pre-line' }}>{f.answer[lang]}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="panel flex flex-col gap-3">
            <h2 className="section-title" style={{ fontSize: 18 }}>{translate(lang, 'helpMoreTitle')}</h2>
            <p style={{ fontSize: 14, color: 'var(--stone-600)' }}>{translate(lang, 'helpMoreText')}</p>
            <p style={{ fontSize: 14 }}>
              {translate(lang, 'email')}: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ padding: 12 }}>
                <WhatsAppIcon />
                <span>WhatsApp {CONTACT.whatsapp}</span>
              </a>
              <Link href={localePath(lang, '/inquire')} className="btn btn-outline" style={{ padding: 12 }}>
                {translate(lang, 'sendInquiry')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
