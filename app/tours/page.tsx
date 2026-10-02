import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeaturedTours from '@/components/FeaturedTours'
import { getFeaturedTours } from '@/lib/sanity'

export default async function AllToursPage() {
  const tours = await getFeaturedTours()

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-12 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">All Tour Packages</h1>
        <p className="text-emerald-100 mt-2 text-sm sm:text-base">
          Explore our complete collection of curated itineraries across Taiwan and Asia
        </p>
      </div>

      {/* Tour Cards List */}
      <FeaturedTours tours={tours} />

      <Footer />
    </main>
  )
}
