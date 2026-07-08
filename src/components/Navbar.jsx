import { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { fetchUserProfile } from '../api/github';
import { getCached, setCached } from '../hooks/useGitHubCache';

const PROFILE_CACHE_KEY = 'github:profile';

const SECTIONS = [
  { id: 'about',      label: 'Sobre mí' },
  { id: 'skills',     label: 'Tecnologías' },
  { id: 'projects',   label: 'Proyectos' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'github',     label: 'GitHub' },
  { id: 'contact',    label: 'Contacto' },
];

export default function Navbar({ name, theme, onToggleTheme, githubUsername }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const activeId = useScrollSpy(SECTIONS.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu after nav
  useEffect(() => { setOpen(false); }, [activeId]);

  // Lazy-fetch GitHub avatar once, shared via cache with GitHubStats section.
  // Falls back silently to the gradient square on failure/offline.
  useEffect(() => {
    if (!githubUsername) return;
    const cacheKey = `${PROFILE_CACHE_KEY}:${githubUsername}`;
    const cached = getCached(cacheKey);
    if (cached?.profile?.avatar_url) {
      setAvatarUrl(cached.profile.avatar_url);
      return;
    }
    let cancelled = false;
    fetchUserProfile(githubUsername)
      .then((p) => {
        if (cancelled || !p?.avatar_url) return;
        setAvatarUrl(p.avatar_url);
        // Repo list intentionally empty — the GitHubStats section will fetch
        // and re-cache it with both pieces; this entry just stays warm.
        setCached(cacheKey, { profile: p, repos: [] });
      })
      .catch(() => { /* silent — keep fallback square */ });
    return () => { cancelled = true; };
  }, [githubUsername]);

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <a href="#hero" className="navbar-brand" aria-label="Inicio">
          {avatarUrl ? (
            <span className="brand-mark-avatar-wrapper" aria-hidden="true">
              <img src={avatarUrl} alt="" width="22" height="22" />
            </span>
          ) : (
            <span className="brand-mark gradient-bg" aria-hidden="true" />
          )}
          <span className="brand-name">{name}</span>
        </a>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`} aria-label="Principal">
          <ul>
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={activeId === id ? 'is-active' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <button
            type="button"
            className="icon-btn navbar-menu-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
