'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import type { Post } from '@/lib/blog'
import { fill } from '@/lib/i18n'
import { useSite } from '../SiteProvider'
import PostCover from './PostCover'

export function postDate(date: string, lang: 'EN' | 'ZH') {
  if (!date) return ''
  return new Intl.DateTimeFormat(lang === 'ZH' ? 'zh-TW' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${date}T12:00:00Z`),
  )
}

export function Stars({ n }: { n: number }) {
  const { t } = useSite()
  return (
    <span className="post-stars" role="img" aria-label={fill(t('ratingLabel'), { n })}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} fill={i < n ? 'currentColor' : 'none'} strokeWidth={1.8} />
      ))}
    </span>
  )
}

/** A post in the blog list: photo, kind, date, title and summary. The whole card opens the post. */
export default function PostCard({ post }: { post: Post }) {
  const { lang, t, href } = useSite()
  return (
    <article className="tour-card post-card">
      <div className="tour-img-wrap">
        <PostCover kind={post.kind} image={post.image} alt={post.title[lang]} />
        <span className="tour-badge">{t(`kind_${post.kind}`)}</span>
        {post.sample && <span className="post-sample">{t('sampleBadge')}</span>}
      </div>
      <div className="tour-body">
        <div className="tour-meta">
          {postDate(post.date, lang)}
          {post.rating ? <> · <Stars n={post.rating} /></> : null}
        </div>
        <h3 className="tour-title">
          <Link href={href(`/blog/${post.slug}`)} className="tour-card-link">{post.title[lang]}</Link>
        </h3>
        <p className="tour-desc">{post.excerpt[lang]}</p>
        <span className="post-more">{t('readMore')} →</span>
      </div>
    </article>
  )
}
