import { Link } from 'react-router-dom'
import { services } from '../data/services'

export default function ServiceCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="cards">
      {services.map((s, i) => (
        <article key={s.id} className="card" id={s.id} data-reveal="up" style={{ ['--d' as string]: `${i * 120}ms` }}>
          <span className="card-num">0{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.summary}</p>
          {detailed && (
            <>
              <p className="muted"><strong>Best for:</strong> {s.forWhom}</p>
              <h4>Includes</h4>
              <ul>{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
              <h4>Does not include</h4>
              <ul className="not">{s.notIncluded.map((x) => <li key={x}>{x}</li>)}</ul>
            </>
          )}
          <Link className="btn btn-primary" to={`/contact?service=${s.id}`}>
            Choose this service<span className="sr-only">: {s.title}</span>
          </Link>
        </article>
      ))}
    </div>
  )
}
