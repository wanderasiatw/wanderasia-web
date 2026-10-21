'use client'

import Link from 'next/link'
import type { Post } from '@/lib/blog'
import { useSite } from '../SiteProvider'
import PostCard from './PostCard'

/** The three newest posts, on the home page */
export default function LatestPosts({ posts }: { posts: Post[] }) {
  const { t, href } = useSite()
  if (posts.length === 0) return null
  return (
    <section id="blog" className="section" style={{ paddingTop: 0 }}>
      <div className="wa-container">
        <div className="section-header">
          <div>
            <span className="section-sub">{t('latestSub')}</span>
            <h2 className="section-title">{t('latestTitle')}</h2>
          </div>
          <Link href={href('/blog')} className="post-more" style={{ whiteSpace: 'nowrap' }}>{t('viewAllPosts')} →</Link>
        </div>
        <div className="tour-grid post-grid">
          {posts.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </div>
    </section>
  )
}
