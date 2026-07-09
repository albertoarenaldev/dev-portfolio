import { useEffect, useState, useRef } from 'react';

/** Each line is [text, delayBeforeTypingMs]. */
const LOG_LINES = [
  ['  .   ____          _            __ _ _', 100],
  [' /\\\\ / ___ \'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\', 80],
  ['( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\', 60],
  [' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )', 60],
  ['  \'  |____| .__|_| |_|_| |_\\__, | / / / /', 60],
  [' =========|_|==============|___/=/_/_/_/', 300],
  ['', 200],
  [':: Spring Boot ::        (v3.4.1)', 400],
  ['', 200],
  ['[INFO] Starting PortfolioApplication v1.0.0', 150],
  ['[INFO] Active profiles: purple, premium', 100],
  ['[DEBUG] Registering @Beans: SkillService, ProjectRepository...', 120],
  ['[INFO]  └─ SkillService        : registered (18 technologies)', 80],
  ['[INFO]  └─ ProjectRepository   : registered (3 projects)', 80],
  ['[DEBUG] Configuring JPA EntityManagerFactory...', 100],
  ['[DEBUG]  └─ Dialect: PostgreSQL 16', 80],
  ['[INFO] Connecting to Database @ jdbc:postgresql://prod/portfolio', 150],
  ['[INFO]  └─ Connection pool: HikariCP — 10 connections [OK]', 100],
  ['[DEBUG] Building REST controllers...', 80],
  ['[INFO]  └─ GET  /api/v1/about       → AboutController', 60],
  ['[INFO]  └─ GET  /api/v1/skills      → SkillController', 60],
  ['[INFO]  └─ GET  /api/v1/projects    → ProjectController', 60],
  ['[INFO]  └─ GET  /api/v1/experience  → ExperienceController', 60],
  ['[INFO]  └─ GET  /api/v1/contact     → ContactController', 60],
  ['[DEBUG] Configuring CORS — allowed origins: *', 80],
  ['[DEBUG] Loading security filter chain...', 80],
  ['[INFO] JWT secret loaded [OK]', 100],
  ['[DEBUG] Registering ExceptionHandlerAdvice...', 80],
  ['', 100],
  ['[INFO] Tomcat started on port(s): 8080 (http)', 600],
  ['[INFO] PortfolioApplication started in 2.847 seconds', 400],
  ['', 200],
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
      totalDelay += delay;
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

    // Total animation time ~ sum of all delays
    const totalTime = LOG_LINES.reduce((acc, [, d]) => acc + d, 0);

    setTimeout(() => {
      if (cancelled) return;
      setPhase('exploding');
    }, totalTime + 800);

    setTimeout(() => {
      if (cancelled) return;
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* quota exceeded */ }
      onComplete();
    }, totalTime + 1800);

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
