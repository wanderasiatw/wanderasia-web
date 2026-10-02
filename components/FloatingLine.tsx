'use client'

import { useEffect, useRef, useState } from 'react'
import { LineIcon } from './Icons'

type Msg = { from: 'bot' | 'user'; text: string }

export default function FloatingLine() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: 'Hello! 👋 Welcome to Wander Asia. How can we help you plan your travel?' },
  ])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, open])

  function send() {
    const text = input.trim()
    if (!text) return
    setMsgs((m) => [...m, { from: 'user', text }])
    setInput('')
    setTimeout(() => {
      setMsgs((m) => [...m, { from: 'bot', text: 'Thanks for your message! Our travel specialist will reply shortly on LINE.' }])
    }, 800)
  }

  return (
    <div className="floating-line-wrap">
      {open && (
        <div className="line-chat-box">
          <div className="line-chat-header">
            <span style={{ fontWeight: 800, fontSize: 13 }}>LINE Support Assistant</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
          <div className="line-chat-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.from === 'user' ? 'user' : ''}`}>{m.text}</div>
            ))}
          </div>
          <div className="line-chat-input">
            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button onClick={send} className="btn btn-line" style={{ padding: '4px 10px', fontSize: 11 }}>Send</button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} className="floating-line-btn" title="Chat on LINE" aria-label="Chat on LINE">
        <LineIcon size={28} />
      </button>
    </div>
  )
}
