import { useEffect, useState } from 'react';
import { FiArrowRight, FiMapPin, FiCircle } from 'react-icons/fi';
import { useReveal } from '../hooks/useReveal';
import ResponsiveAvatar from './ResponsiveAvatar';
import SocialIcons from './SocialIcons';
import CopyButton from './CopyButton';

const ROLES = [
  'Full Stack Developer',
  'UI/UX Enthusiast',
  'Open Source Contributor',
  'Problem Solver',
];

/** Keys we exclude from the icon strip — direct contact lives in the dedicated rows below. */
const DIRECT_KEYS = ['email', 'phone'];

/** Formats an E.164 Spanish phone string (+34xxxxxxxxx) as "+34 NNN NN NN NN". */
function formatPhoneForHero(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('34')) {
    return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }
  return value;
}

/** Cycles through a list of strings with a typing-like effect. */
function useRotator(items, intervalMs = 2800) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const target = items[index];
    let i = 0;
    setText('');
    const typing = setInterval(() => {
      i += 1;
      setText(target.slice(0, i));
      if (i >= target.length) clearInterval(typing);
    }, 70);
    const advance = setTimeout(
      () => setIndex((n) => (n + 1) % items.length),
      intervalMs
    );
    return () => {
      clearInterval(typing);
      clearTimeout(advance);
    };
  }, [index, items, intervalMs]);

  return text;
}

export default function Hero({ data }) {
  const reveal = useReveal(0.05);
  const role = useRotator(ROLES);
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

        <p className="hero-subtitle">
          {data.subtitle || data.title}
        </p>

        <div className="hero-role-bar">
          <span className="hero-role-prefix">Soy</span>
          <span className="hero-role">{role}<span className="caret" /></span>
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
          <div className="hero-direct-contact">
            {data.social.email && (
              <div className="direct-row">
                <a href={`mailto:${data.social.email}`} className="direct-value mono">
                  {data.social.email}
                </a>
                <CopyButton value={data.social.email} label="Copiar" />
              </div>
            )}
            {data.social.phone && (
              <div className="direct-row">
                <a href={`tel:${data.social.phone}`} className="direct-value mono">
                  {formatPhoneForHero(data.social.phone)}
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
