import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default async function TourDetailPage({ params }: { params: { slug: string } }) {
  // နမူနာ Static Data (Sanity fetch ဖြင့် နောက်ပိုင်း အစားထိုးနိုင်ပါသည်)
  const tour = {
    title: '5D4N Scenic Taiwan: Taipei & Sun Moon Lake',
    price: 1250,
    duration: '5 Days 4 Nights',
    overview: 'Experience the best of Taiwan from vibrant Taipei night markets to the serene beauty of Sun Moon Lake.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Taipei & Shilin Night Market' },
      { day: 'Day 2', title: 'Taipei 101, National Palace Museum & Jiufen Old Street' },
      { day: 'Day 3', title: 'Transfer to Sun Moon Lake & Boat Tour' },
      { day: 'Day 4', title: 'Taichung Rainbow Village & Cultural Walk' },
      { day: 'Day 5', title: 'Souvenir Shopping & Departure' },
    ]
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{tour.duration}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">{tour.title}</h1>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-3">Overview</h2>
            <p className="text-gray-600 leading-relaxed">{tour.overview}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Day-by-Day Itinerary</h2>
            <div className="space-y-4">
              {tour.itinerary.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start border-l-2 border-emerald-500 pl-4 py-1">
                  <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">{item.day}</span>
                  <p className="text-gray-800 text-sm font-medium">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Inquiry Box */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <div className="mb-6">
              <span className="text-xs text-gray-400">Price per person</span>
              <div className="text-3xl font-black text-emerald-600">${tour.price} <span className="text-sm font-normal text-gray-500">TWD</span></div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                <input type="text" className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email or LINE ID</label>
                <input type="text" className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="line_id / email" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Travel Date</label>
                <input type="date" className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition">
                Inquire Now
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
