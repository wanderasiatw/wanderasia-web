import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import TourRows from '@/components/TourRows'
import WhyChoose from '@/components/WhyChoose'
import { getFeaturedTours } from '@/lib/sanity'

export const revalidate = 60

export default async function HomePage() {
  const tours = await getFeaturedTours()

  return (
    <main>
      <Hero />
      <TrustBar />
      <TourRows tours={tours} />
      <WhyChoose />
    </main>
  )
}
