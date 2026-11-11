// Original logo mark: a winding path rising to a gold waypoint.
// TODO(owner): replace with the real brand logo when supplied.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#274b7a" />
          <stop offset="1" stopColor="#11233c" />
        </linearGradient>
        <linearGradient id="lm-gold" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#e3b04b" />
          <stop offset="1" stopColor="#c8962e" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#lm-bg)" />
      <path d="M9 30 C 18 30, 12 20, 21 19 S 25 11, 30 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".92" />
      <path d="M9 34 H 24" stroke="url(#lm-gold)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="30.5" cy="9.5" r="3.6" fill="url(#lm-gold)" />
    </svg>
  )
}

export default function Logo({ name }: { name: string }) {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-text">{name}</span>
    </span>
  )
}
