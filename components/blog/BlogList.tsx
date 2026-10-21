'use client'

import { useEffect, useState } from 'react'
import { POST_KINDS, type Post, type PostKind } from '@/lib/blog'
import { useSite } from '../SiteProvider'
import PostCard from './PostCard'
import ShareStory from './ShareStory'

type Filter = 'all' | PostKind

/** All posts, with tabs to show one kind: tour stories, guest stories or travel tips */
export default function BlogList({ posts, initial, demo }: { posts: Post[]; initial?: string; demo: boolean }) {
  const { t } = useSite()
  const kinds = POST_KINDS.filter((k) => posts.some((p) => p.kind === k))
  const [filter, setFilter] = useState<Filter>(kinds.includes(initial as PostKind) ? (initial as PostKind) : 'all')

  // Keep the chosen tab in the address, so it can be shared
  useEffect(() => {
    const url = new URL(window.location.href)
    if (filter === 'all') url.searchParams.delete('type')
    else url.searchParams.set('type', filter)
    window.history.replaceState(window.history.state, '', url)
  }, [filter])

  const shown = filter === 'all' ? posts : posts.filter((p) => p.kind === filter)

  return (
    <section className="section">
      <div className="wa-container">
        {demo && posts.some((p) => p.sample) && <p className="demo-notice">{t('blogDemoNotice')}</p>}
        {posts.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: 32 }}>
            <p style={{ fontWeight: 700 }}>{t('blogEmpty')}</p>
          </div>
        ) : (
          <>
            {kinds.length > 1 && (
              <div className="filter-tabs blog-tabs" role="tablist" aria-label={t('navBlog')}>
                {(['all', ...kinds] as Filter[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={filter === k}
                    className={`filter-btn${filter === k ? ' active' : ''}`}
                    onClick={() => setFilter(k)}
                  >
                    {k === 'all' ? t('blogAll') : t(`kind_${k}`)}
                    <span className="blog-tab-count">{k === 'all' ? posts.length : posts.filter((p) => p.kind === k).length}</span>
                  </button>
                ))}
              </div>
            )}
            {shown.length === 0 ? (
              <p>{t('blogNoneInKind')}</p>
            ) : (
              <div className="tour-grid post-grid">
                {shown.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
            )}
          </>
        )}
        <ShareStory />
      </div>
    </section>
  )
}
