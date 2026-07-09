import { FiExternalLink, FiGithub, FiStar, FiGitBranch } from 'react-icons/fi';
import { useLiveLogs } from '../hooks/useLiveLogs';

export default function ProjectCard({ project, compact = false }) {
  const {
    title,
    description,
    tech = [],
    github,
    demo,
    stars,
    forks,
    image,
    featured,
    id,
  } = project;
  const { addLog } = useLiveLogs();

  return (
    <article
      className={`project-card ${compact ? 'compact' : ''}`}
      onMouseEnter={() => addLog({ level: 'DEBUG', message: `GET /api/v1/projects/${id || title?.slice(0, 12)} → 200 OK` })}
    >
      {image && (
        <div className="project-card-image">
          <img src={image} alt={title} loading="lazy" />
        </div>
      )}

      <div className="project-card-body">
        <header className="project-card-header">
          <h3>{title}</h3>
          {featured && <span className="badge badge-featured">Destacado</span>}
        </header>

        {description && <p>{description}</p>}

        {stars !== undefined && (
          <div className="project-stats">
            <span title="Estrellas"><FiStar size={14} /> {stars}</span>
            <span title="Forks"><FiGitBranch size={14} /> {forks}</span>
          </div>
        )}

        {tech.length > 0 && (
          <div className="project-tech">
            {tech.map((t) => (
              <span key={t} className="tech-chip">{t}</span>
            ))}
          </div>
        )}
      </div>

      <footer className="project-card-links">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="link link-muted">
            <FiGithub size={14} /> Código
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noopener noreferrer" className="link link-accent">
            <FiExternalLink size={14} /> Demo
          </a>
        )}
      </footer>
    </article>
  );
}
