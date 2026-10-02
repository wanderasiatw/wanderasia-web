import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold text-emerald-600 tracking-wide">
          Wander Asia <span className="text-xs text-gray-500 font-normal">(Taiwan)</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/destinations" className="hover:text-emerald-600 transition">Destinations</Link>
          <Link href="/tours" className="hover:text-emerald-600 transition">Tour Packages</Link>
          <Link href="/about" className="hover:text-emerald-600 transition">About Us</Link>
          <Link href="/contact" className="hover:text-emerald-600 transition">Contact</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">
            zh-TW / EN
          </button>
          <a
            href="https://line.me"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-full transition shadow-sm"
          >
            LINE Us
          </a>
        </div>
      </div>
    </header>
  )
}
