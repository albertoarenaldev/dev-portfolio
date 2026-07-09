import { FiArrowRight, FiMapPin, FiCircle } from 'react-icons/fi';
import { useReveal } from '../hooks/useReveal';
import ResponsiveAvatar from './ResponsiveAvatar';
import SocialIcons from './SocialIcons';
import CopyButton from './CopyButton';

const SPECIALTY = 'Spring Boot y bases de datos relacionales';

/** Keys we exclude from the icon strip — direct contact lives in the dedicated rows below. */
const DIRECT_KEYS = ['email', 'phone'];

export default function Hero({ data }) {
  const reveal = useReveal(0.05);
  const initial = (data.name || 'T').trim()[0] || 'T';

  // Icon strip: only profile/indirect channels (github/linkedin/website).
  // Email & phone live in the direct contact rows below — no duplicate icons.
  const socialForIcons = Object.fromEntries(
    Object.entries(data.social || {}).filter(
      ([key, url]) => url && !DIRECT_KEYS.includes(key)
    )
  );
  const hasIndirectChannels = Object.values(socialForIcons).some(Boolean);

  return (
    <section id="hero" className="hero" ref={reveal}>
      <div className="container hero-inner">
        <div className="availability">
          <FiCircle className="dot" />
          {data.availability || 'Disponible para proyectos'}
        </div>

        <div className="hero-avatar" aria-hidden="true">
          {data.avatar ? (
            <ResponsiveAvatar config={data.avatar} />
          ) : (
            <span className="hero-avatar-fallback gradient-text">{initial}</span>
          )}
        </div>

        <h1 className="display hero-title">
          Hola, soy <span className="gradient-text">{data.name}</span>
        </h1>

        <div className="hero-stack-badges">
          <span className="stack-badge">Java 17+</span>
          <span className="stack-badge">Spring Boot 3</span>
          <span className="stack-badge">PostgreSQL</span>
          <span className="stack-badge">Docker</span>
        </div>

        <p className="hero-subtitle">
          {data.subtitle || data.title}
        </p>

        <div className="hero-role-bar">
          <span className="hero-role-prefix">Especialidad</span>
          <span className="hero-role">{SPECIALTY}</span>
        </div>

        <div className="hero-meta">
          {data.location && (
            <span><FiMapPin size={14} /> {data.location}</span>
          )}
        </div>

        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            Ver proyectos <FiArrowRight />
          </a>
        </div>

        {hasIndirectChannels && (
          <>
            <p className="eyebrow connect-eyebrow">Encuéntrame en</p>
            <SocialIcons social={socialForIcons} iconSize={20} className="hero-connect" />
          </>
        )}

        {data.social && (data.social.email || data.social.phone) && (
          <div className="direct-contact">
            {data.social.email && (
              <div className="direct-row">
                <a href={`mailto:${data.social.email}`} className="direct-value mono" aria-label={`Enviar email a ${data.social.email}`}>
                  {data.social.email}
                </a>
                <CopyButton value={data.social.email} label="Copiar" />
              </div>
            )}
            {data.social.phone && (
              <div className="direct-row">
                <a href={`tel:${data.social.phone}`} className="direct-value mono" aria-label={`Llamar al ${data.social.phone}`}>
                  {data.social.phone}
                </a>
                <CopyButton value={data.social.phone} label="Copiar teléfono" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
