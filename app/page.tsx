import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturedTours from '@/components/FeaturedTours'
import Destinations from '@/components/Destinations'
import Footer from '@/components/Footer'
import { getFeaturedTours } from '@/lib/sanity'

export default async function HomePage() {
  const tours = await getFeaturedTours()

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Destinations />
      <FeaturedTours tours={tours} />
      <Footer />
    </main>
  )
}
