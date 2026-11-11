import type { CSSProperties } from 'react'

// Shows an owner-supplied image if `src` is set, otherwise a labelled placeholder.
// TODO(owner): put licensed images in web/public/images and pass src="/images/<file>".
// Always provide meaningful alt text.
export default function ImageSlot({ src, alt, label, ratio = '4 / 3' }: { src?: string; alt: string; label: string; ratio?: string }) {
  const style: CSSProperties = { aspectRatio: ratio }
  if (src) return <img className="img-slot" style={style} src={src} alt={alt} loading="lazy" decoding="async" />
  return (
    <div className="img-slot img-placeholder" style={style} role="img" aria-label={`Placeholder: ${alt}`}>
      <span>{label}</span>
    </div>
  )
}
