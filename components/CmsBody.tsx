/**
 * Body text from CMS Page text, one block per paragraph (a blank line between them in the CMS).
 * Two small extras for longer pages such as terms and privacy:
 *   a paragraph starting with "## " is a heading, e.g. "## Cancellations"
 *   a paragraph whose lines all start with "- " is a bulleted list
 */
export default function CmsBody({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => {
        if (p.startsWith('## ')) return <h2 key={i}>{p.slice(3).trim()}</h2>
        const lines = p.split('\n').map((l) => l.trim()).filter(Boolean)
        if (lines.length > 0 && lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{l.slice(2).trim()}</li>)}
            </ul>
          )
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {l}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
