import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTourBySlug } from '@/lib/sanity'
import { CURRENCY, formatPrice } from '@/lib/tours'

export const revalidate = 60

export default async function TourDetailPage({ params }: { params: { slug: string } }) {
  const tour = await getTourBySlug(params.slug)
  if (!tour) notFound()

  return (
    <main>
      <div className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-bg" style={{ backgroundImage: `url(${tour.image})`, opacity: 0.35 }} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{tour.destination}{tour.duration ? ` • ${tour.duration}` : ''}</div>
          <h1>{tour.title}</h1>
          <p style={{ marginBottom: 0 }}>★ {tour.rating} rating</p>
        </div>
      </div>

      <section className="section">
        <div className="wa-container detail-grid">
          <div className="flex flex-col gap-6">
            <div className="panel">
              <h2 className="section-title" style={{ fontSize: 20, marginBottom: 8 }}>Overview</h2>
              <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>{tour.desc}</p>
            </div>

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
              <span style={{ fontSize: 11, color: 'var(--slate-400)' }}>Price per person</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>
                {formatPrice(tour.price)} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-600)' }}>{CURRENCY}</span>
              </div>
              <form className="flex flex-col gap-3">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" className="form-control" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label>Email or LINE ID</label>
                  <input type="text" className="form-control" placeholder="line_id / email" required />
                </div>
                <div className="form-group">
                  <label>Travel Date</label>
                  <input type="date" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }}>Inquire Now</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
