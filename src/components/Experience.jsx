import { FiBriefcase } from 'react-icons/fi';
import { useReveal } from '../hooks/useReveal';

export default function Experience({ items = [] }) {
  const ref = useReveal();

  if (items.length === 0) return null;

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Trayectoria</p>
          <h2 className="display">Dónde he trabajado.</h2>
        </header>

        <ol className="timeline">
          {items.map((entry, i) => (
            <li key={i} className="timeline-item glass">
              <span className="timeline-dot" aria-hidden="true">
                <FiBriefcase size={14} />
              </span>
              <div className="timeline-content">
                <header>
                  <h3>{entry.role}</h3>
                  <span className="timeline-period">{entry.period}</span>
                </header>
                <p className="timeline-company">{entry.company}</p>
                {entry.description && <p>{entry.description}</p>}
                {entry.tech?.length > 0 && (
                  <ul className="timeline-tech">
                    {entry.tech.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
