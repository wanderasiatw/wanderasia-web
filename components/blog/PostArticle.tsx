'use client'

import Link from 'next/link'
import { fill } from '@/lib/i18n'
import type { Post } from '@/lib/blog'
import type { Tour } from '@/lib/tours'
import TourCover from '../TourCover'
import { useSite } from '../SiteProvider'
import PostCard, { Stars, postDate } from './PostCard'
import ShareStory from './ShareStory'

/** One blog post: the story, its photos, the tour it's about, and more posts */
export default function PostArticle({ post, tour, more, demo }: { post: Post; tour: Tour | null; more: Post[]; demo: boolean }) {
  const { lang, t, href } = useSite()
  const paragraphs = post.body[lang].length ? post.body[lang] : [post.excerpt[lang]]
  const byline = [fill(t('byAuthor'), { author: post.author }), post.authorCountry ? fill(t('fromCountry'), { country: post.authorCountry }) : '']
    .filter(Boolean)
    .join(' ')

  return (
    <main>
      <div className={post.image ? 'hero hero-photo' : 'hero'} style={{ padding: '60px 0' }}>
        <div className="hero-bg" style={post.image ? { backgroundImage: `url(${post.image})` } : undefined} />
        <div className="wa-container hero-content">
          <div className="badge-hero">{t(`kind_${post.kind}`)}</div>
          <h1 style={{ fontSize: 34 }}>{post.title[lang]}</h1>
          <p style={{ marginBottom: 0 }}>{postDate(post.date, lang)} · {byline}</p>
        </div>
      </div>

      <section className="section">
        <div className="wa-container">
          {demo && post.sample && <p className="demo-notice">{t('blogDemoNotice')}</p>}
          <div className="detail-grid">
            <article className="panel post-article">
              {post.rating ? <div style={{ marginBottom: 12 }}><Stars n={post.rating} /></div> : null}
              <p className="post-lead">{post.excerpt[lang]}</p>
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt={post.title[lang]} className="post-hero-img" />
              )}
              {paragraphs.map((p) => <p key={p}>{p}</p>)}
              {post.gallery.length > 0 && (
                <div className="post-gallery">
                  {post.gallery.map((g) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={g} src={g} alt="" loading="lazy" />
                  ))}
                </div>
              )}
              <Link href={href('/blog')} style={{ display: 'inline-block', marginTop: 20, fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{t('backToBlog')}</Link>
            </article>

            <aside className="flex flex-col gap-4">
              {tour && !tour.comingSoon && (
                <div className="panel post-tour" style={{ position: 'sticky', top: 90 }}>
                  <h3>{t('storyTour')}</h3>
                  <div className="post-tour-img">
                    <TourCover category={tour.category} image={tour.image} alt={tour.title[lang]} />
                  </div>
                  <strong>{tour.title[lang]}</strong>
                  <p>{tour.desc[lang]}</p>
                  <Link href={href(`/tours/${tour.slug}`)} className="btn btn-primary" style={{ width: '100%', padding: 12 }}>{t('viewTour')}</Link>
                </div>
              )}
            </aside>
          </div>

          <ShareStory tourTitle={tour?.title.EN} />

          {more.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div className="section-header">
                <h2 className="section-title">{t('morePosts')}</h2>
              </div>
              <div className="tour-grid post-grid">
                {more.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
