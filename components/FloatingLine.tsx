export default function FloatingLine() {
  return (
    <a
      href="https://line.me"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#06C755] hover:bg-[#05b34c] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
      aria-label="Chat on LINE"
    >
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.893 2.572-5.992z"/>
      </svg>
      <span className="text-xs font-bold hidden sm:inline pr-1">Chat on LINE</span>
    </a>
  )
}
