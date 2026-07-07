import { useReveal } from '../hooks/useReveal';
import { FiBriefcase, FiCode, FiLayers, FiSmile } from 'react-icons/fi';

const STAT_META = [
  { key: 'yearsExperience',    label: 'Años de experiencia', icon: FiBriefcase },
  { key: 'projectsCompleted',  label: 'Proyectos completados', icon: FiCode },
  { key: 'technologies',       label: 'Tecnologías', icon: FiLayers },
  { key: 'happyClients',       label: 'Clientes felices', icon: FiSmile },
];

export default function About({ data }) {
  const ref = useReveal();
  const about = Array.isArray(data.about) ? data.about : [data.bio].filter(Boolean);
  const stats = data.stats || {};

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Sobre mí</p>
          <h2 className="display">Construyo productos que la gente realmente quiere usar.</h2>
        </header>

        <div className="about-grid">
          <div className="about-copy">
            {about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ul className="stats-grid" aria-label="Cifras clave">
            {STAT_META.map(({ key, label, icon: Icon }) => (
              <li key={key} className="stat-card glass">
                <span className="stat-icon"><Icon size={20} /></span>
                <div>
                  <strong className="display stat-value">
                    {stats[key] ?? '—'}
                    {key === 'yearsExperience' && '+'}
                  </strong>
                  <span className="stat-label">{label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
