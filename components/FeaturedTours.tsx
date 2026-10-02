import Image from 'next/image'
import Link from 'next/link'

interface Tour {
  _id: string
  title: string
  slug: string
  price: number
  duration: string
  imageUrl?: string
  overview?: string
}

export default function FeaturedTours({ tours }: { tours: Tour[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Tour Packages</h2>
          <p className="text-gray-600 mt-1">Handpicked itineraries for your next adventure</p>
        </div>
        <Link href="/tours" className="text-emerald-600 font-semibold hover:underline hidden sm:block">
          View All Packages →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours?.map((tour) => (
          <div key={tour._id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-48 w-full bg-gray-200">
              {tour.imageUrl ? (
                <Image
                  src={tour.imageUrl}
                  alt={tour.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
              <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {tour.duration || 'Flexible'}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{tour.title}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{tour.overview}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Starting from</span>
                  <span className="text-xl font-extrabold text-emerald-600">${tour.price} <span className="text-xs font-normal text-gray-500">TWD</span></span>
                </div>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="bg-gray-900 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
