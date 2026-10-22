import type { Metadata } from 'next'
import { getForm } from '@/lib/cms'
import { CONTACT, whatsappLink } from '@/lib/contact'
import { langFromParam, translate } from '@/lib/i18n'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import InquiryForm from '@/components/InquiryForm'
import JsonLd from '@/components/JsonLd'
import { WhatsAppIcon } from '@/components/Icons'

// The form's fields come from the CMS on each request
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/contact', { title: translate(lang, 'metaContactTitle'), description: translate(lang, 'contactBlurb') })
}

export default async function ContactPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const form = await getForm('inquiry')
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navContact'), path: '/contact' },
  ])

  return (
    <main>
      <JsonLd data={crumbs} />
      <div className="page-banner">
        <div className="wa-container">
          <h1>{translate(lang, 'navContact')}</h1>
          <p>{translate(lang, 'contactBlurb')}</p>
        </div>
      </div>

      {/* WhatsApp and email only: the client asked for no office address and no phone number here */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wa-container" style={{ maxWidth: 720 }}>
          <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="panel flex flex-col gap-3">
              <h2 className="section-title" style={{ fontSize: 18 }}>{translate(lang, 'footerWhatsApp')}</h2>
              <p style={{ fontSize: 14, color: 'var(--stone-600)' }}>{translate(lang, 'trustChatText')}</p>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ padding: 12 }}>
                <WhatsAppIcon />
                <span>WhatsApp {CONTACT.whatsapp}</span>
              </a>
            </div>
            <div className="panel flex flex-col gap-3">
              <h2 className="section-title" style={{ fontSize: 18 }}>{translate(lang, 'email')}</h2>
              <p style={{ fontSize: 14, color: 'var(--stone-600)' }}>{CONTACT.email}</p>
              <a href={`mailto:${CONTACT.email}`} className="btn btn-outline" style={{ padding: 12 }}>
                {translate(lang, 'sendInquiry')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <InquiryForm form={form} title={translate(lang, 'sendInquiry')} embedded />
    </main>
  )
}
