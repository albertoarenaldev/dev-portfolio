import { useEffect, useState } from 'react';
import {
  FiGithub, FiStar, FiGitBranch, FiExternalLink, FiUserPlus, FiUsers,
} from 'react-icons/fi';
import {
  fetchGitHubRepos,
  fetchUserProfile,
} from '../api/github';
import { getCached, setCached } from '../hooks/useGitHubCache';
import { useReveal } from '../hooks/useReveal';

const CACHE_KEY = 'github:profile';

export default function GitHubStats({ username }) {
  const ref = useReveal();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!username) {
      setFailed(true);
      setLoading(false);
      return;
    }

    const cached = getCached(`${CACHE_KEY}:${username}`);
    if (cached) {
      setProfile(cached.profile);
      setRepos(cached.repos);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [p, r] = await Promise.all([
          fetchUserProfile(username),
          fetchGitHubRepos(username),
        ]);
        if (cancelled) return;
        const topRepos = r.slice().sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 6);
        setProfile(p);
        setRepos(topRepos);
        setCached(`${CACHE_KEY}:${username}`, { profile: p, repos: topRepos });
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [username]);

  // Silently render nothing useful if it failed — section just collapses
  if (failed) return null;

  return (
    <section id="github" className="section" ref={ref}>
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Código abierto</p>
          <h2 className="display">Lo que hago en GitHub.</h2>
        </header>

        <div className="github-grid">
          {/* Profile card */}
          <div className="github-profile glass">
            <div className="github-profile-head">
              {profile && (
                <img
                  className="github-avatar"
                  src={profile.avatar_url}
                  alt={profile.login}
                  width="80"
                  height="80"
                />
              )}
              <div>
                <h3>{profile?.name || username}</h3>
                <a
                  href={profile?.html_url || `https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-muted"
                >
                  <FiGithub size={14} /> @{profile?.login || username}
                </a>
              </div>
            </div>

            {profile?.bio && <p className="github-bio">{profile.bio}</p>}

            <ul className="github-stats">
              <li>
                <FiGitBranch size={16} />
                <strong>{profile?.public_repos ?? '—'}</strong>
                <span>repos</span>
              </li>
              <li>
                <FiUsers size={16} />
                <strong>{profile?.followers ?? '—'}</strong>
                <span>seguidores</span>
              </li>
              <li>
                <FiUserPlus size={16} />
                <strong>{profile?.following ?? '—'}</strong>
                <span>siguiendo</span>
              </li>
            </ul>

            {loading && <p className="mono github-loading">cargando…</p>}
          </div>

          {/* Top repos */}
          <div className="github-repos">
            <p className="github-repos-title">
              <span className="eyebrow">Top repositorios</span>
            </p>

            {repos.length === 0 && !loading && (
              <p className="empty-state glass">No se encontraron repositorios.</p>
            )}

            <ul className="github-repos-list">
              {repos.map((r) => (
                <li key={r.id} className="github-repo glass">
                  <header>
                    <a
                      href={r.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-repo-name"
                    >
                      {r.title}
                    </a>
                    <span className="github-repo-stars">
                      <FiStar size={12} /> {r.stars}
                    </span>
                  </header>
                  {r.description && <p>{r.description}</p>}
                  <footer>
                    {r.language && <span className="github-repo-lang">{r.language}</span>}
                    {r.demo && (
                      <a href={r.demo} target="_blank" rel="noopener noreferrer" className="link link-accent">
                        Demo <FiExternalLink size={12} />
                      </a>
                    )}
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
