const DESTINATIONS = [
  { name: 'Japan', count: '12 Tours', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600' },
  { name: 'Taiwan', count: '18 Tours', image: 'https://images.unsplash.com/photo-1508248467877-aed323d07626?q=80&w=600' },
  { name: 'South Korea', count: '8 Tours', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=600' },
  { name: 'Thailand', count: '10 Tours', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600' },
]

export default function Destinations() {
  return (
    <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Popular Destinations</h2>
        <p className="text-gray-600 text-center mb-10">Explore Asia&apos;s most breathtaking places</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{dest.name}</h3>
                <p className="text-xs text-gray-300">{dest.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
