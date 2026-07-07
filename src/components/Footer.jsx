/** E.164 -> "+CC NNN NN NN NN" — same formatter used elsewhere. */
function formatPhone(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('34')) {
    return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }
  return value;
}

export default function Footer({ name, social }) {
  const email = social?.email;
  const phone = social?.phone;
  const hasDirect = !!(email || phone);

  return (
    <footer className="site-footer">
      <div className="container">
        {hasDirect && (
          <p className="footer-line mono" aria-label="Contacto directo">
            {email && (
              <a href={`mailto:${email}`} className="footer-link">
                {email}
              </a>
            )}
            {email && phone && (
              <span className="footer-dot" aria-hidden="true">·</span>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="footer-link">
                {formatPhone(phone)}
              </a>
            )}
          </p>
        )}

        {hasDirect && <hr className="divider" />}

        <div className="footer-row">
          <p className="footer-copy mono">
            © {new Date().getFullYear()} {name} · Hecho con React + Vite
          </p>
          <a href="#hero" className="footer-top">Volver arriba ↑</a>
        </div>
      </div>
    </footer>
  );
}
