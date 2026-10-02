export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Explore Asia's Wonders with Local Experts
        </h1>
        <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
          Tailor-made itineraries, premium group tours, and unforgettable experiences across Taiwan, Japan, and Asia.
        </p>

        {/* Quick Search Widget */}
        <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-xl max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">DESTINATION</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Select Country</option>
              <option value="taiwan">Taiwan</option>
              <option value="japan">Japan</option>
              <option value="korea">South Korea</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">TRAVEL MONTH</label>
            <input
              type="month"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-2.5 rounded-lg text-sm transition shadow">
              Search Tours
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
