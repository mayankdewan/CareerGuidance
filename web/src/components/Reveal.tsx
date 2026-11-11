import { useEffect, useRef, useState, type ReactNode } from 'react'

// Fades content in on scroll. Content is visible by default if IntersectionObserver is missing.
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <div ref={ref} className={`reveal${shown ? ' in' : ''} ${className}`}>{children}</div>
}
