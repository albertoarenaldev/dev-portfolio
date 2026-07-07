import { useState } from 'react';
import { fetchGitHubRepos } from '../api/github';
import ProjectCard from './ProjectCard';
import { FiGithub } from 'react-icons/fi';

export default function GitHubRepos() {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch(e) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchGitHubRepos(username.trim());
      setRepos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="github-input" onSubmit={handleFetch}>
        <FiGithub size={20} style={{ alignSelf: 'center', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Usuario de GitHub..."
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error">❌ {error}</div>}

      {loading && <div className="loading">Cargando repositorios...</div>}

      {repos && !loading && (
        repos.length === 0
          ? <div className="empty-repos">No se encontraron repositorios públicos.</div>
          : <div className="projects-grid">
              {repos.map(repo => <ProjectCard key={repo.id} project={repo} />)}
            </div>
      )}
    </div>
  );
}
