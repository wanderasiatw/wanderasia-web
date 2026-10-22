import type { Metadata } from 'next'
import Link from 'next/link'
import { getServices } from '@/lib/cms'
import { currencyOf, formatPrice, fromPrice } from '@/lib/tours'
import { fill, langFromParam, localePath, translate } from '@/lib/i18n'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import ServiceCover from '@/components/ServiceCover'
import JsonLd from '@/components/JsonLd'

// Rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/services', { title: translate(lang, 'metaServicesTitle'), description: translate(lang, 'servicesBlurb') })
}

export default async function ServicesPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const services = await getServices()
  const t = (key: Parameters<typeof translate>[1]) => translate(lang, key)
  const crumbs = breadcrumbJsonLd(lang, [
    { name: t('home'), path: '/' },
    { name: t('navServices'), path: '/services' },
  ])

  return (
    <main>
      <JsonLd data={crumbs} />
      <div className="page-banner">
        <div className="wa-container">
          <h1>{t('servicesTitle')}</h1>
          <p>{t('servicesBlurb')}</p>
        </div>
      </div>
      <section className="section">
        <div className="wa-container">
          <div className={services.length === 1 ? 'service-single' : 'tour-grid'}>
            {services.map((s) => {
              const price = fromPrice(s)
              return (
                <div key={s.id} className="tour-card">
                  <div className="tour-img-wrap">
                    <ServiceCover kind={s.kind} image={s.image} alt={s.title[lang]} />
                  </div>
                  <div className="tour-body">
                    <div>
                      <h3 className="tour-title">{s.title[lang]}</h3>
                      <p className="tour-desc">{s.summary[lang]}</p>
                    </div>
                    <div className="tour-footer">
                      <span className={`tour-price ${price == null ? 'tour-price-ask' : ''}`}>
                        {price == null ? t('priceOnRequest') : fill(t('fromPrice'), { price: formatPrice(price, currencyOf(s)) })}
                      </span>
                      <Link href={localePath(lang, `/services/${s.slug}`)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}>
                        {t('learnMore')}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
