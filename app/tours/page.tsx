import TourRows from '@/components/TourRows'
import { getAllTours } from '@/lib/sanity'

export const revalidate = 60

export const metadata = { title: 'Our Tours in Taiwan | Wander Asia' }

export default async function AllToursPage() {
  const tours = await getAllTours()

  return (
    <main>
      <div className="page-banner">
        <div className="wa-container">
          <h1>Our Tours in Taiwan</h1>
          <p>Free tours, food tours, night &amp; drink tours and private tours with a local guide</p>
        </div>
      </div>
      <TourRows tours={tours} title="ALL TOURS" />
    </main>
  )
}
