import { useEffect, useState, useRef } from 'react';

/** Multiplicador de velocidad: 1 = actual, 0.282 = ~1.3s total */
const SPEED = 0.282;

/** Each line is [text, delayBeforeTypingMs]. */
const LOG_LINES = [
  ['  .   ____          _            __ _ _', 40],
  [' /\\\\ / ___ \'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\', 32],
  ['( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\', 24],
  [' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )', 24],
  ['  \'  |____| .__|_| |_|_| |_\\__, | / / / /', 24],
  [' =========|_|==============|___/=/_/_/_/', 120],
  ['', 80],
  [':: Spring Boot ::        (v3.4.1)', 160],
  ['', 80],
  ['[INFO] Starting PortfolioApplication v1.0.0', 60],
  ['[INFO] Active profiles: purple, premium', 40],
  ['[DEBUG] Registering @Beans: SkillService, ProjectRepository...', 48],
  ['[INFO]  └─ SkillService        : registered (18 technologies)', 32],
  ['[INFO]  └─ ProjectRepository   : registered (3 projects)', 32],
  ['[DEBUG] Configuring JPA EntityManagerFactory...', 40],
  ['[DEBUG]  └─ Dialect: PostgreSQL 16', 32],
  ['[INFO] Connecting to Database @ jdbc:postgresql://prod/portfolio', 60],
  ['[INFO]  └─ Connection pool: HikariCP — 10 connections [OK]', 40],
  ['[DEBUG] Building REST controllers...', 32],
  ['[INFO]  └─ GET  /api/v1/about       → AboutController', 24],
  ['[INFO]  └─ GET  /api/v1/skills      → SkillController', 24],
  ['[INFO]  └─ GET  /api/v1/projects    → ProjectController', 24],
  ['[INFO]  └─ GET  /api/v1/experience  → ExperienceController', 24],
  ['[INFO]  └─ GET  /api/v1/contact     → ContactController', 24],
  ['[DEBUG] Configuring CORS — allowed origins: *', 32],
  ['[DEBUG] Loading security filter chain...', 32],
  ['[INFO] JWT secret loaded [OK]', 40],
  ['[DEBUG] Registering ExceptionHandlerAdvice...', 32],
  ['', 40],
  ['[INFO] Tomcat started on port(s): 8080 (http)', 240],
  ['[INFO] PortfolioApplication started in 1.536 seconds', 160],,
  ['', 80],
  ['▸ READY.', 0],
];

const STORAGE_KEY = 'boot-sequence-shown';

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'exploding'
  const containerRef = useRef(null);

  useEffect(() => {
    // Only show once per session
    let alreadyShown = false;
    try { alreadyShown = typeof window !== 'undefined' && !!sessionStorage.getItem(STORAGE_KEY); } catch { /* SSR guard */ }
    if (alreadyShown) {
      onComplete();
      return;
    }

    let cancelled = false;
    const lines = [];
    let totalDelay = 0;

    LOG_LINES.forEach(([text, delay]) => {
      totalDelay += delay * SPEED;
      setTimeout(() => {
        if (cancelled) return;
        lines.push(text);
        setVisibleLines([...lines]);
        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, totalDelay);
    });

    // Total animation time with speed factor applied
    const totalTime = LOG_LINES.reduce((acc, [, d]) => acc + d, 0) * SPEED;

    setTimeout(() => {
      if (cancelled) return;
      setPhase('exploding');
    }, totalTime + 200);

    setTimeout(() => {
      if (cancelled) return;
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* quota exceeded */ }
      onComplete();
    }, totalTime + 600);

    return () => { cancelled = true; };
  }, [onComplete]);

  return (
    <div className={`boot-overlay ${phase === 'exploding' ? 'boot-explode' : ''}`} aria-hidden="true">
      <div className="boot-terminal" ref={containerRef}>
        {visibleLines.map((line, i) => (
          <div key={i} className="boot-line">
            {line || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
}
