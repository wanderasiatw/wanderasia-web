import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost, getPosts, isBlogDemo } from '@/lib/blog'
import { getTourBySlug } from '@/lib/cms'
import { HTML_LANG, langFromParam, translate } from '@/lib/i18n'
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, providerJsonLd } from '@/lib/seo'
import PostArticle from '@/components/blog/PostArticle'
import JsonLd from '@/components/JsonLd'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const post = await getPost(slug)
  if (!post) return {}
  // The CMS SEO fields are in English, so the other languages use their own title and summary
  const title = lang === 'EN' ? (post.seoTitle ?? `${post.title.EN} | Wander Asia`) : `${post.title[lang]} | ${translate(lang, 'siteName')}`
  const description = lang === 'EN' ? (post.seoDescription ?? post.excerpt.EN) : post.excerpt[lang]
  // Sample posts are for the demo only and stay out of search results
  return pageMetadata(lang, `/blog/${post.slug}`, { title, description, image: post.image, noindex: post.sample })
}

export default async function PostPage({ params }: Props) {
  const { lang: param, slug } = await params
  const lang = langFromParam(param) ?? 'EN'
  const post = await getPost(slug)
  if (!post) notFound()
  const [tour, all] = await Promise.all([post.tourSlug ? getTourBySlug(post.tourSlug) : null, getPosts()])
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3)

  const path = `/blog/${post.slug}`
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title[lang],
    description: post.excerpt[lang],
    image: post.image ? [post.image] : undefined,
    datePublished: post.date || undefined,
    inLanguage: HTML_LANG[lang],
    author: { '@type': post.author === 'Wander Asia' ? 'Organization' : 'Person', name: post.author },
    publisher: providerJsonLd(),
    mainEntityOfPage: absoluteUrl(lang, path),
  }
  const crumbs = breadcrumbJsonLd(lang, [
    { name: translate(lang, 'home'), path: '/' },
    { name: translate(lang, 'navBlog'), path: '/blog' },
    { name: post.title[lang], path },
  ])

  return (
    <>
      {!post.sample && <JsonLd data={[article, crumbs]} />}
      <PostArticle post={post} tour={tour} more={more} demo={isBlogDemo()} />
    </>
  )
}
