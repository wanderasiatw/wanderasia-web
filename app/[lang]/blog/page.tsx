import type { Metadata } from 'next'
import { getPosts, isBlogDemo } from '@/lib/blog'
import { langFromParam, translate } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import BlogList from '@/components/blog/BlogList'

// New posts from the CMS show up straight away
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ type?: string | string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/blog', { title: translate(lang, 'metaBlogTitle'), description: translate(lang, 'metaBlogDesc') })
}

export default async function BlogPage({ params, searchParams }: Props) {
  const [{ lang: param }, { type }] = await Promise.all([params, searchParams])
  const lang = langFromParam(param) ?? 'EN'
  const posts = await getPosts()
  return (
    <main>
      <div className="page-banner">
        <div className="wa-container">
          <h1>{translate(lang, 'blogTitle')}</h1>
          <p>{translate(lang, 'blogBlurb')}</p>
        </div>
      </div>
      <BlogList posts={posts} initial={typeof type === 'string' ? type : undefined} demo={isBlogDemo()} />
    </main>
  )
}
