import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTourBySlug } from '@/lib/sanity'
import { CURRENCY, categoryOf, formatPrice } from '@/lib/tours'
import { askAboutLink } from '@/lib/contact'
import BookingForm from '@/components/BookingForm'
import TourFacts from '@/components/TourFacts'

export const revalidate = 60

export default async function TourDetailPage({ params }: { params: { slug: string } }) {
  const tour = await getTourBySlug(params.slug)
  if (!tour) notFound()

  const category = categoryOf(tour.category)
  const summary = [tour.startTime, tour.duration].filter(Boolean).join(' • ')
  const paragraphs = tour.body.length > 0 ? tour.body : [tour.desc]

  return (
    <main>
      <div className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-bg" style={tour.image ? { backgroundImage: `url(${tour.image})`, opacity: 0.35 } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{category?.title.EN} • {tour.location}</div>
          <h1>{tour.title}</h1>
          {summary && <p style={{ marginBottom: 0 }}>{summary}</p>}
        </div>
      </div>

      <section className="section">
        <div className="wa-container detail-grid">
          <div className="flex flex-col gap-6">
            <div className="panel">
              <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>About this tour</h2>
              <TourFacts tour={tour} />
              <div className="flex flex-col gap-3" style={{ marginTop: 12 }}>
                {paragraphs.map((p) => (
                  <p key={p} style={{ color: 'var(--stone-600)', fontSize: 14 }}>{p}</p>
                ))}
              </div>
              {tour.note && <p className="tour-note">{tour.note}</p>}
            </div>

            {tour.tastings.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 4 }}>What you’ll taste</h2>
                <p style={{ color: 'var(--stone-600)', fontSize: 13, marginBottom: 14 }}>The must-try finger foods from local vendors. You get your own portion of each one.</p>
                <div className="tasting-grid">
                  {tour.tastings.map((f) => (
                    <figure key={f.name} className="tasting-card">
                      {f.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.image} alt={f.name} />
                      ) : (
                        <div className="tasting-tile" lang="zh-Hant">{f.zh}</div>
                      )}
                      <figcaption>
                        {f.name}
                        <span lang="zh-Hant">{f.zh}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {tour.highlights.length > 0 && (
              <div className="panel">
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>Highlights</h2>
                <div className="flex flex-col gap-3">
                  {tour.highlights.map((h, i) => (
                    <div key={h} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: 12, fontSize: 14 }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link href="/tours" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>← Back to all tours</Link>
          </div>

          <div>
            <div className="panel" style={{ position: 'sticky', top: 90, boxShadow: 'var(--shadow-lg)' }}>
              <span style={{ fontSize: 11, color: 'var(--stone-400)' }}>Price per person</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>
                {tour.price === 0 ? 'Free' : tour.price == null ? <span style={{ fontSize: 20 }}>Price on request</span> : formatPrice(tour.price)}{' '}
                {tour.price ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>{CURRENCY}</span> : null}
              </div>
              {tour.comingSoon ? (
                <a
                  href={askAboutLink(`the ${tour.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', padding: 12 }}
                >
                  Details coming soon. Ask on WhatsApp
                </a>
              ) : (
                <BookingForm tourTitle={tour.title} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
