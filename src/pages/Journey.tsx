import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { journeyNote, journeySteps } from '../data/journey'
import { officialSources } from '../data/site'
import { useSeo } from '../lib/seo'

export default function Journey() {
  useSeo('Study in Germany: The Journey', 'A step-by-step guide to the journey to higher education in Germany, with links to official sources.')
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      })
    }, { rootMargin: '-40% 0px -50% 0px' })
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const progress = ((active + 1) / journeySteps.length) * 100

  return (
    <>
      <section className="page-head">
        <div className="container narrow" data-reveal="up">
          <p className="eyebrow">The Journey</p>
          <h1>Study in Germany, step by step.</h1>
          <p className="lead">{journeyNote}</p>
          <p className="fine">We show no fees, living-cost figures or statistics here because they change. Please use the official sources for current numbers.</p>
        </div>
      </section>

      <div className="progress" role="progressbar" aria-label="Journey progress" aria-valuemin={1} aria-valuemax={journeySteps.length} aria-valuenow={active + 1} aria-valuetext={`Step ${active + 1} of ${journeySteps.length}`}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <section className="section">
        <ol className="container timeline">
          {journeySteps.map((s, i) => (
            <li key={s.title} data-i={i} ref={(el) => { refs.current[i] = el }} className={i === active ? 'step is-active' : 'step'}>
              <span className="step-dot" aria-hidden="true">{i + 1}</span>
              <div className="step-body" data-reveal="up">
                <p className="eyebrow">Step {i + 1}</p>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <ul>{s.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
                <p className="links">Official sources: {s.links.map((l, k) => (
                  <span key={l.href}>{k > 0 && ', '}<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}<span className="sr-only"> (opens in a new tab)</span></a></span>
                ))}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section tint">
        <div className="container narrow" data-reveal="up">
          <h2>Official sources to check</h2>
          <ul className="sources">
            {officialSources.map((o) => (
              <li key={o.href}><a href={o.href} target="_blank" rel="noopener noreferrer">{o.label}</a>: {o.note}</li>
            ))}
          </ul>
          <p>Want help applying this to your situation?</p>
          <Link to="/contact?service=guidance" className="btn btn-primary">Get Guidance</Link>
        </div>
      </section>
    </>
  )
}
