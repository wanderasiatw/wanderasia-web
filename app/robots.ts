import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

// Read on each request so it uses this deployment's SITE_URL
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
