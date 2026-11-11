import { Link } from 'react-router-dom'
import ImageSlot from '../components/ImageSlot'
import Reveal from '../components/Reveal'
import ServiceCards from '../components/ServiceCards'
import { journeySteps } from '../data/journey'
import { faqs } from '../data/faq'
import { coach, disclaimer } from '../data/site'
import { useSeo } from '../lib/seo'

export default function Home() {
  useSeo('Study in Germany: Guidance for Families and Students', 'Clear, honest guidance on the journey to higher education in Germany, for students and parents.')
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Higher education in Germany</p>
            <h1>A calmer, clearer path to studying in Germany.</h1>
            <p className="lead">We help students and parents understand each stage of the journey, from choosing a programme to arriving on campus, so decisions are made with confidence and not guesswork.</p>
            <div className="cta-row">
              <Link to="/journey" className="btn btn-primary">Explore the Germany Journey</Link>
              <Link to="/contact" className="btn btn-ghost">Get Guidance</Link>
            </div>
            <p className="fine">{disclaimer}</p>
          </div>
          <svg className="hero-art" viewBox="0 0 400 360" role="img" aria-label="Illustration of a winding path rising toward a university building">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e8eefb" /><stop offset="1" stopColor="#fbf1dc" /></linearGradient>
            </defs>
            <rect width="400" height="360" rx="28" fill="url(#sky)" />
            <circle cx="310" cy="80" r="34" fill="#c8962e" opacity=".85" />
            <path className="path-draw" d="M30 330 C140 300 60 240 180 220 S 150 150 250 140" fill="none" stroke="#1d3557" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 14" />
            <g fill="#1d3557"><rect x="230" y="90" width="110" height="50" /><polygon points="222,90 285,50 348,90" /></g>
            <g fill="#fff"><rect x="245" y="105" width="14" height="35" /><rect x="278" y="105" width="14" height="35" /><rect x="311" y="105" width="14" height="35" /></g>
            <circle cx="30" cy="330" r="9" fill="#c8962e" />
          </svg>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Three ways we can help</p>
            <h2>Choose the support that fits.</h2>
          </Reveal>
          <ServiceCards />
          <p className="center" data-reveal="up"><Link to="/services">Compare the services in detail →</Link></p>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2>Eight stages, one clear map.</h2>
            <p className="lead">Every journey is different, but most follow these stages.</p>
          </Reveal>
          <ol className="mini-steps">
            {journeySteps.map((s, i) => (
              <li key={s.title} data-reveal="up" style={{ ['--d' as string]: `${(i % 4) * 60}ms` }}><span>{i + 1}</span><strong>{s.title}</strong><em>{s.short}</em></li>
            ))}
          </ol>
          <p className="center" data-reveal="up"><Link to="/journey" className="btn btn-primary">See the full journey</Link></p>
        </div>
      </section>

      <section className="section" aria-labelledby="coach-heading">
        <div className="container coach-grid">
          <div data-reveal="up">
            <ImageSlot src={coach.photo || undefined} alt={`Portrait of ${coach.name}, ${coach.role}`} label="Photo of Mrigank Kohli coming soon" ratio="4 / 5" />
          </div>
          <div data-reveal="up">
            <p className="eyebrow">Your career coach</p>
            <h2 id="coach-heading">{coach.name}</h2>
            <p className="lead">Guidance from someone who has been through it: {coach.name} studied in Germany and has lived and worked there for around {coach.yearsInGermany} years.</p>
            <p>His professional experience in Germany includes working at companies such as {coach.employers.join(' and ')}. He brings that first-hand view of student life, the job market and settling in to every conversation.</p>
            <ul className="chips" aria-label="Background">
              <li>Studied in Germany</li>
              <li>~{coach.yearsInGermany} years in Germany</li>
              {coach.employers.map((e) => <li key={e}>Worked at {e}</li>)}
            </ul>
            <p className="fine">Personal experience, not a guarantee of any admission, visa or job outcome. {/* TODO(owner): confirm wording and add any further details you want shown. */}</p>
            <Link to="/contact" className="btn btn-primary">Talk to {coach.name.split(' ')[0]}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <Reveal><h2>Questions families ask</h2></Reveal>
          {faqs.slice(0, 3).map((f) => (
            <details key={f.q} className="faq" data-reveal="up"><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
          <p><Link to="/faq">More questions →</Link></p>
        </div>
      </section>
    </>
  )
}
