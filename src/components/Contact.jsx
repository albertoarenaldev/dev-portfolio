import { FiGithub, FiLinkedin, FiMail, FiGlobe, FiPhone, FiArrowUpRight } from 'react-icons/fi';
import { useReveal } from '../hooks/useReveal';
import CopyButton from './CopyButton';

// Channel labels for the indirect social pills.
const PILL_LABEL = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  website: 'Sitio web',
};

// Order matters: email is the primary direct channel.
const DIRECT_KEYS = ['email', 'phone'];
const INDIRECT_KEYS = ['github', 'linkedin', 'website'];

const ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
  phone: FiPhone,
  website: FiGlobe,
};

/** E.164 (+CCxxxxxxxxx) -> "+CC NNN NN NN NN" */
function formatPhone(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('34')) {
    return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }
  return value;
}

function hrefFor(key, url) {
  if (key === 'email') return url.startsWith('mailto:') ? url : `mailto:${url}`;
  if (key === 'phone') return url.startsWith('tel:') ? url : `tel:${url}`;
  return url;
}

export default function Contact({ data }) {
  const ref = useReveal();
  const social = data.social || {};
  const directKeys = DIRECT_KEYS.filter((k) => social[k]);
  const indirectKeys = INDIRECT_KEYS.filter((k) => social[k]);
  const hasDirect = directKeys.length > 0;
  const hasIndirect = indirectKeys.length > 0;

  return (
    <section id="contact" className="section section-contact" ref={ref}>
      <div className="container">
        <div className="contact-card glass">
          <p className="eyebrow">¿Hablamos?</p>
          <h2 className="display">
            <span className="gradient-text">Construyamos algo juntos.</span>
          </h2>
          <p className="contact-sub">
            ¿Tienes una idea, un proyecto freelance o una colaboración en mente?
            Estoy disponible para trabajar en cosas interesantes.
          </p>

          {/* Direct channels — compact rows with copy button (same UX as Hero) */}
          {hasDirect && (
            <div className="direct-contact contact-channels">
              {directKeys.map((key) => {
                const url = social[key];
                const Icon = ICONS[key];
                const value = key === 'phone' ? formatPhone(url) : url;
                const href = hrefFor(key, url);
                const ariaCopy =
                  key === 'phone'
                    ? `Llamar al ${value}`
                    : `Enviar email a ${value}`;
                return (
                  <div key={key} className="direct-row">
                    <span className="direct-icon" aria-hidden="true">
                      <Icon size={14} />
                    </span>
                    <a href={href} className="direct-value mono" aria-label={ariaCopy}>
                      {value}
                    </a>
                    <CopyButton value={url} label="Copiar" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Indirect social channels — pill style */}
          {hasIndirect && (
            <ul className="contact-socials">
              {indirectKeys.map((key) => {
                const url = social[key];
                const Icon = ICONS[key] ?? FiGlobe;
                return (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-pill"
                      aria-label={PILL_LABEL[key] ?? key}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{PILL_LABEL[key] ?? key}</span>
                      <FiArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
