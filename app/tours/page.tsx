import FeaturedTours from '@/components/FeaturedTours'
import { getAllTours } from '@/lib/sanity'

export const revalidate = 60

export const metadata = { title: 'All Tour Packages | Wander Asia' }

export default async function AllToursPage() {
  const tours = await getAllTours()

  return (
    <main>
      <div className="page-banner">
        <div className="wa-container">
          <h1>All Tour Packages</h1>
          <p>Explore our complete collection of curated itineraries across Taiwan and Asia</p>
        </div>
      </div>
      <FeaturedTours tours={tours} title="ALL TOUR PACKAGES" />
    </main>
  )
}
