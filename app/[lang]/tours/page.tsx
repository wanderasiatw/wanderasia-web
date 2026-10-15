import type { Metadata } from 'next'
import TourRows from '@/components/TourRows'
import { getAllTours } from '@/lib/cms'
import { splitComingSoon } from '@/lib/tours'
import { langFromParam, translate } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

// Rendered on each request so CMS changes show up without a rebuild
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/tours', { title: translate(lang, 'metaToursTitle'), description: translate(lang, 'allToursBlurb') })
}

export default async function AllToursPage({ params }: Props) {
  const lang = langFromParam((await params).lang) ?? 'EN'
  const { ready, upcoming } = splitComingSoon(await getAllTours())

  return (
    <main>
      <div className="page-banner">
        <div className="wa-container">
          <h1>{translate(lang, 'allToursHeading')}</h1>
          <p>{translate(lang, 'allToursBlurb')}</p>
        </div>
      </div>
      <TourRows tours={ready} upcoming={upcoming} title={translate(lang, 'allToursTitle')} />
    </main>
  )
}
