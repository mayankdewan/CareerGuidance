import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { disclaimer, site } from '../data/site'
import Logo from './Logo'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/journey', label: 'The Journey' },
  { to: '/services', label: 'Services' },
  { to: '/faq', label: 'FAQ' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Header shadow once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-reveal for every [data-reveal] element on the current page.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const show = (el: HTMLElement) => {
      el.classList.add('in')
      window.setTimeout(() => el.classList.add('done'), 1500)
    }
    if (typeof IntersectionObserver === 'undefined') { els.forEach(show); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { show(e.target as HTMLElement); io.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <div className="container bar">
          <Link to="/" className="brand" aria-label={`${site.name} home`}>
            <Logo name={site.name} />
          </Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
            {open ? 'Close' : 'Menu'}
          </button>
          <nav id="primary-nav" className={open ? 'nav is-open' : 'nav'} aria-label="Primary" onClick={() => setOpen(false)}>
            {nav.map((n) => <NavLink key={n.to} to={n.to} end={n.to === '/'}>{n.label}</NavLink>)}
            <Link to="/contact" className="btn btn-primary btn-sm">Get Guidance</Link>
          </nav>
        </div>
      </header>

      <main id="main"><Outlet /></main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-cta">
            <h2>Ready to talk it through?</h2>
            <Link to="/contact" className="btn btn-gold">Send an enquiry</Link>
          </div>
          <div className="footer-grid">
            <div>
              <Logo name={site.name} />
              <p>{site.tagline}</p>
            </div>
            <div>
              <strong>Contact</strong>
              <p>{site.email}<br />WhatsApp/Phone: {site.whatsapp}</p>
            </div>
            <div>
              <strong>Explore</strong>
              <p><Link to="/journey">Journey</Link> · <Link to="/services">Services</Link> · <Link to="/faq">FAQ</Link> · <Link to="/privacy">Privacy</Link></p>
            </div>
          </div>
          <p className="disclaimer" role="note"><strong>Disclaimer:</strong> {disclaimer}</p>
          <p className="legal">© {new Date().getFullYear()} {site.legalEntity}. Not affiliated with any German university or government body.</p>
        </div>
      </footer>
    </>
  )
}
