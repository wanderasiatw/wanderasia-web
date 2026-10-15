import { notFound } from 'next/navigation'

// Any address that isn't a page shows the site's own "page not found", in the page's language
export default function CatchAll() {
  notFound()
}
