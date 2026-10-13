import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import TourRows from '@/components/TourRows'
import WhyChoose from '@/components/WhyChoose'
import ServiceCards from '@/components/ServiceCards'
import { getFeaturedTours } from '@/lib/cms'

export const revalidate = 60

export default async function HomePage() {
  const tours = await getFeaturedTours()

  return (
    <main>
      <Hero />
      <TrustBar />
      <TourRows tours={tours} />
      <ServiceCards />
      <WhyChoose />
    </main>
  )
}
