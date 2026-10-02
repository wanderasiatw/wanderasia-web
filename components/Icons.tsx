type P = { size?: number; color?: string }
const s = (size = 18, color?: string) => ({ width: size, height: size, ...(color ? { fill: color } : {}) })

export const LogoIcon = ({ size = 22 }: P) => (
  <svg className="icon-svg" style={s(size)} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-3.5-2 3.5-5 3.5 2-3.5 5z" /></svg>
)
export const LineIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.58 2 10c0 3.32 2.37 6.18 5.75 7.25-.2.72-.73 2.62-.84 3.02-.13.51.18.5.38.37.16-.1 2.52-1.72 3.56-2.43.37.05.75.09 1.15.09 5.52 0 10-3.58 10-8s-4.48-8-10-8z" /></svg>
)
export const ShieldIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4z" /></svg>
)
export const StarIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
)
export const ChatIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
)
export const SearchIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
)
export const PinIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
)
export const DollarIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
)
export const PenIcon = ({ size, color }: P) => (
  <svg className="icon-svg" style={s(size, color)} viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
)
