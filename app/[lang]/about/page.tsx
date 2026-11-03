import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuides, getPage, getReviews } from '@/lib/cms'
import { whatsappLink } from '@/lib/contact'
import { langFromParam, localePath, translate } from '@/lib/i18n'
import { breadcrumbJsonLd, cmsPageMetadata } from '@/lib/seo'
import { ABOUT, ABOUT_POINTS } from '@/lib/about-content'
import JsonLd from '@/components/JsonLd'
import CmsBody from '@/components/CmsBody'
import { WhatsAppIcon } from '@/components/Icons'
import { RatingStars } from '@/components/TourExtras'

// Rendered on each request so CMS changes (Page text "About us", Guides & team, Reviews) show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return cmsPageMetadata(lang, '/about', await getPage('about'), { title: translate(lang, 'metaAboutTitle'), description: translate(lang, 'aboutBlurb') })
}

/**
 * About page: photo hero, the story beside four quick points, the team and real reviews (each shown only
 * when the CMS has some), then a closing call to action. Heading, intro, story and photo come from
 * CMS Page text "About us"; until it is published there the built-in text is shown.
 */
export default async function AboutPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const [page, guides, reviews] = await Promise.all([getPage('about'), getGuides(), getReviews()])
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navAbout'), path: '/about' },
  ])
  const story = page && page.body[lang].length > 0 ? page.body[lang] : [translate(lang, 'aboutLead')]
  const featured = reviews.filter((r) => r.featured)
  const shownReviews = (featured.length > 0 ? featured : reviews).slice(0, 3)
  const ctaButtons = (
    <>
      <Link href={localePath(lang, '/tours')} className="btn btn-gold about-btn">{ABOUT.browseTours[lang]}</Link>
      <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp about-btn">
        <WhatsAppIcon />
        <span>{ABOUT.chatWhatsApp[lang]}</span>
      </a>
    </>
  )

  return (
    <main className="about-page">
      <JsonLd data={crumbs} />

      {/* Hero: the CMS photo full width, text on the left */}
      <header className={`hero about-hero${page?.image ? ' hero-photo' : ''}`}>
        <div className="hero-bg" style={page?.image ? { backgroundImage: `url(${page.image})` } : undefined} />
        <div className="wa-container hero-content about-hero-content">
          <span className="section-sub about-eyebrow">{ABOUT.eyebrow[lang]}</span>
          <h1>{page ? page.title[lang] : translate(lang, 'navAbout')}</h1>
          <p>{page?.intro?.[lang] ?? translate(lang, 'aboutBlurb')}</p>
          <div className="about-actions">{ctaButtons}</div>
        </div>
      </header>

      {/* Our story, beside the quick points */}
      <section className="section">
        <div className="wa-container about-story">
          <div>
            <span className="section-sub">{ABOUT.storySub[lang]}</span>
            <h2 className="section-title about-title">{ABOUT.storyTitle[lang]}</h2>
            <CmsBody paragraphs={story} className="cms-body about-story-text" />
          </div>
          <aside className="about-points" aria-label={ABOUT.glanceTitle[lang]}>
            <h3>{ABOUT.glanceTitle[lang]}</h3>
            <ol>
              {ABOUT_POINTS.map((p, i) => (
                <li key={p.title.EN}>
                  <span className="about-point-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{p.title[lang]}</h4>
                    <p>{p.text[lang]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* Team, from CMS Guides & team */}
      {guides.length > 0 && (
        <section className="section about-team">
          <div className="wa-container">
            <div className="text-center how-head">
              <span className="section-sub">{ABOUT.teamSub[lang]}</span>
              <h2 className="section-title">{ABOUT.teamTitle[lang]}</h2>
            </div>
            <div className="pt-guides">
              {guides.map((g) => (
                <div key={g.name} className="pt-guide">
                  {g.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.photo} alt={g.name} loading="lazy" />
                  ) : (
                    <span className="pt-guide-initial" aria-hidden="true">{g.name.charAt(0)}</span>
                  )}
                  <h3>{g.name}</h3>
                  {g.role && <p className="pt-guide-role">{g.role[lang]}</p>}
                  {g.languages.length > 0 && <p className="pt-guide-langs">{g.languages.join(' · ')}</p>}
                  {g.bio && <p className="pt-guide-bio">{g.bio[lang]}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Real reviews from the CMS only (featured first) */}
      {shownReviews.length > 0 && (
        <section className="section">
          <div className="wa-container">
            <div className="text-center how-head">
              <h2 className="section-title">{ABOUT.reviewsTitle[lang]}</h2>
            </div>
            <div className="pt-reviews">
              {shownReviews.map((r, i) => (
                <figure key={r.name + i} className="panel pt-review">
                  {r.rating != null && <RatingStars value={r.rating} />}
                  <blockquote>{r.text[lang]}</blockquote>
                  <figcaption>
                    <strong>{r.name}</strong>
                    {r.country && <span> · {r.country}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing call to action */}
      <section className="about-cta">
        <div className="wa-container text-center">
          <span className="section-sub">{ABOUT.ctaSub[lang]}</span>
          <h2>{ABOUT.ctaTitle[lang]}</h2>
          <p>{ABOUT.ctaText[lang]}</p>
          <div className="about-actions about-actions-center">{ctaButtons}</div>
        </div>
      </section>
    </main>
  )
}
