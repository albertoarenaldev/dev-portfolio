import { useMemo, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import ProjectCard from './ProjectCard';
import { useReveal } from '../hooks/useReveal';

export default function Projects({ projects = [] }) {
  const ref = useReveal();
  const [filter, setFilter] = useState('all');

  // Auto-generate the set of technologies from all projects
  const techs = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.tech || []).forEach((t) => set.add(t)));
    return ['all', ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => (p.tech || []).includes(filter));
  }, [projects, filter]);

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Trabajo reciente</p>
          <h2 className="display">Proyectos en los que he puesto cariño.</h2>
        </header>

        <div className="filter-bar" role="toolbar" aria-label="Filtrar por tecnología">
          <FiFilter size={14} aria-hidden="true" />
          <div className="filter-chips">
            {techs.map((t) => (
              <button
                key={t}
                type="button"
                className={`filter-chip ${filter === t ? 'is-active' : ''}`}
                onClick={() => setFilter(t)}
                aria-pressed={filter === t}
              >
                {t === 'all' ? 'Todos' : t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state glass">
            <p>Ningún proyecto coincide con <strong>{filter}</strong>.</p>
            <button type="button" className="btn btn-ghost" onClick={() => setFilter('all')}>
              Limpiar filtro
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
