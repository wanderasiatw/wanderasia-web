export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">Wander Asia (Taiwan)</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted travel partner in Taiwan. Crafting unforgettable memory across Asia.
          </p>
          <p className="text-xs text-emerald-400 mt-4">Travel License No: Category A 01234</p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/destinations" className="hover:text-white">Destinations</a></li>
            <li><a href="/tours" className="hover:text-white">Tour Packages</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Contact Us</h4>
          <p className="text-sm">Taipei City, Taiwan</p>
          <p className="text-sm mt-1">Email: info@wanderasia.tw</p>
          <p className="text-sm mt-1">LINE: @wanderasia</p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Language</h4>
          <p className="text-xs text-gray-500">Traditional Chinese (zh-TW) / English (EN)</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-800 text-xs text-center text-gray-500">
        © 2026 Wander Asia (Taiwan). All Rights Reserved.
      </div>
    </footer>
  )
}
