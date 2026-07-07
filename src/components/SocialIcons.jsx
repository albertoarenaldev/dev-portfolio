import { FiGithub, FiLinkedin, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';

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
  email: 'Enviar email',
  phone: 'Llamar por teléfono',
  website: 'Sitio web',
};

// Builds the href for protocol-style entries. Idempotent.
const HREF_KINDS = {
  email: (url) => (url.startsWith('mailto:') ? url : `mailto:${url}`),
  phone: (url) => (url.startsWith('tel:') ? url : `tel:${url}`),
};

const PROTOCOL_KEYS = new Set(['email', 'phone']);

/** E.164 (+CCxxxxxxxxx) -> "+CC NNN NN NN NN" for screen-reader labels. */
function formatPhone(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('34')) {
    return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }
  return value;
}

/**
 * Compact icon-only strip of social / contact channels.
 * Skips channels whose URL is empty/null. Handles mailto:/tel: protocols.
 */
export default function SocialIcons({ social, className = '', iconSize = 22 }) {
  if (!social) return null;

  return (
    <div className={`connect-strip ${className}`} role="list">
      {Object.entries(social)
        .filter(([, url]) => url)
        .map(([key, url]) => {
          const Icon = ICONS[key];
          if (!Icon) return null;
          const buildHref = HREF_KINDS[key];
          const href = buildHref ? buildHref(url) : url;
          const isProtocol = PROTOCOL_KEYS.has(key);
          const aria = key === 'phone' ? formatPhone(url) : (LABELS[key] ?? key);
          return (
            <a
              key={key}
              href={href}
              target={isProtocol ? undefined : '_blank'}
              rel={isProtocol ? undefined : 'noopener noreferrer'}
              className="connect-link"
              aria-label={aria}
            >
              <Icon size={iconSize} aria-hidden="true" />
            </a>
          );
        })}
    </div>
  );
}
