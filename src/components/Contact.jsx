import { FiGithub, FiLinkedin, FiMail, FiGlobe, FiPhone, FiArrowUpRight } from 'react-icons/fi';
import { useReveal } from '../hooks/useReveal';
import CopyButton from './CopyButton';
// Note: the previous big primary CTA button ("Escríbeme") was removed because it
// duplicated the Email detail-card below (both are mailto:). The detail-cards are now
// the single canonical contact zone; CTA emphasis lives in the Hero direct rows.

const ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
  phone: FiPhone,
  website: FiGlobe,
};

const LABELS = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
  phone: 'Teléfono',
  website: 'Web',
};

/** E.164 (+CCxxxxxxxxx) -> "+CC NNN NN NN NN" */
function formatPhone(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('34')) {
    return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }
  return value;
}

function displayFor(key, url) {
  if (key === 'phone') return formatPhone(url);
  if (key === 'email') return url;
  return LABELS[key] ?? key;
}

const HREF_KINDS = {
  email: (url) => (url.startsWith('mailto:') ? url : `mailto:${url}`),
  phone: (url) => (url.startsWith('tel:') ? url : `tel:${url}`),
};

const PROTOCOL_KEYS = ['email', 'phone'];

export default function Contact({ data }) {
  const ref = useReveal();
  const social = data.social || {};
  const hasDirect = !!(social.email || social.phone);
  const hasIndirect = ['github', 'linkedin', 'website'].some((k) => social[k]);

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

          {/* Direct contact — address visible, selectable, with copy button */}
          {hasDirect && (
            <div className="contact-details">
              {PROTOCOL_KEYS.map((key) => {
                const url = social[key];
                if (!url) return null;
                const Icon = ICONS[key];
                const value = displayFor(key, url);
                const href = HREF_KINDS[key](url);
                return (
                  <div key={key} className="detail-card">
                    <div className="detail-row detail-row-head">
                      <span className="detail-icon" aria-hidden="true">
                        <Icon size={16} />
                      </span>
                      <span className="detail-label">{LABELS[key]}</span>
                    </div>
                    <a
                      href={href}
                      className="detail-value mono"
                      aria-label={key === 'phone' ? `Llamar al ${value}` : `Enviar email a ${value}`}
                    >
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
              {Object.entries(social)
                .filter(([key, url]) => url && !PROTOCOL_KEYS.includes(key))
                .map(([key, url]) => {
                  const Icon = ICONS[key] ?? FiGlobe;
                  return (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-pill"
                        aria-label={LABELS[key] ?? key}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{LABELS[key] ?? key}</span>
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
