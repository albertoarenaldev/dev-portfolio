import { useEffect, useRef, useState } from 'react';
import { useLiveLogs } from '../hooks/useLiveLogs';

const PROMPT = 'invitado@alberto-backend:~$';

const COMMANDS = {
  help: () => `
Comandos disponibles:
  whoami           ─ Quién es Alberto
  ls projects      ─ Lista proyectos
  ls skills        ─ Lista tecnologías
  neofetch         ─ Especificaciones del sistema
  curl /api/contact ─ Info de contacto
  sudo hire alberto ─ Contratar (requiere sudo)
  rm -rf /         ─ ⚠️ Usar con precaución
  clear            ─ Limpiar terminal
  exit             ─ Cerrar terminal
`.trim(),

  whoami: (data) => `
Nombre:   ${data.name}
Título:   ${data.title}
Stack:    Java · Spring Boot · PostgreSQL · Docker
GitHub:   github.com/${data.github}
Ubicación: ${data.location || '—'}
`.trim(),

  'ls projects': (data) => {
    const rows = (data.projects || []).map(
      (p) => `  ${(p.title || '').padEnd(48)} ${String(p.stars ?? '—').padStart(3)} ⭐  ${(p.tech || [])[0] || '—'}`
    );
    return ['PROJECT                          STARS  LANG', ...rows].join('\n');
  },

  'ls skills': (data) => {
    const cats = (data.skills || []).map((g) => {
      const items = (g.items || []).map((i) => i.name).join(', ');
      return `  [${g.category}]  ${items}`;
    });
    return cats.join('\n');
  },

  neofetch: () => `
       ▄▄▄▄▄▄▄       invitado@alberto-backend
    ▄████████████▄    ──────────────────────────
  ▄████████████████▄  OS: PortfolioOS v3.0 (purple)
  ██████████████████  Kernel: React 19.2 + Vite 8
  ██████▀▀▀▀▀██████  Shell: bash 5.2
  █████▀      ▀█████  DE: Glassmorphism 2.0
  ████▀        ▀████  Theme: Purple Dark [Premium]
  ███▀          ▀███  Uptime: since 2025
  ██▀            ▀██  Packages: react-icons 5.7
  █▀              ▀█  Terminal: TerminalMode.jsx
  ▀                ▀
`.trim(),

  'curl /api/contact': (data) => `
HTTP/1.1 200 OK
Content-Type: application/json

{
  "name": "${data.name}",
  "email": "${data.social?.email || '—'}",
  "github": "${data.social?.github || '—'}",
  "linkedin": "${data.social?.linkedin || 'null'}",
  "status": "available"
}
`.trim(),

  'sudo hire alberto': () => null, // handled specially — triggers confetti

  'rm -rf /': () => null, // handled specially — dark mode apocalypse
};

export default function TerminalMode({ data = {}, onClose }) {
  const [lines, setLines] = useState([
    { type: 'output', text: 'Terminal interactiva · escribe help para empezar' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [sudoFired, setSudoFired] = useState(false);
  const [rmActive, setRmActive] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const timersRef = useRef([]);
  const { addLog } = useLiveLogs();

  // Focus input always
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup all pending timers on unmount
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Escape or Ctrl+` closes (with preventDefault to avoid browser conflicts)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.ctrlKey && e.key === '`') { e.preventDefault(); onClose(); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const addLine = (text) => setLines((prev) => [...prev, { type: 'output', text }]);

  const execute = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setLines((prev) => [...prev, { type: 'prompt', text: `${PROMPT} ${trimmed}` }]);
      return;
    }

    // Add to history
    setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);

    // Echo prompt
    setLines((prev) => [...prev, { type: 'prompt', text: `${PROMPT} ${trimmed}` }]);

    // Handle special commands
    if (trimmed === 'clear') {
      setLines([]);
      addLog({ level: 'INFO', message: 'Terminal: clear executed' });
      return;
    }

    if (trimmed === 'exit') {
      addLog({ level: 'INFO', message: 'Terminal: session closed' });
      onClose();
      return;
    }

    if (trimmed === 'sudo hire alberto') {
      setSudoFired(true);
      addLog({ level: 'SUCCESS', message: 'sudo hire alberto — initiating contact sequence' });
      addLine('🔓 Permiso concedido. Iniciando protocolo de contratación...');
      addLine('');
      addLine('✅ Contrato generado. Redirigiendo a contacto directo...');
      setTimeout(() => {
        window.location.href = `mailto:${data.social?.email || ''}`;
      }, 1500);
      return;
    }

    if (trimmed === 'rm -rf /') {
      setRmActive(true);
      addLog({ level: 'WARN', message: 'rm -rf / executed — system shutdown initiated' });
      addLine('⚠️  Eliminando sistema de archivos...');
      addLine('');
      timersRef.current.push(setTimeout(() => addLine('.'), 400));
      timersRef.current.push(setTimeout(() => addLine('..'), 800));
      timersRef.current.push(setTimeout(() => addLine('...'), 1200));
      timersRef.current.push(setTimeout(() => {
        addLine('');
        addLine('just kidding ;)  ─  rm está aliasado a \'rm -i\'');
        addLine('');
        setRmActive(false);
      }, 2200));
      return;
    }

    // Neofetch
    if (trimmed === 'neofetch') {
      addLine(COMMANDS.neofetch());
      addLog({ level: 'DEBUG', message: 'Terminal: neofetch' });
      return;
    }

    // Dispatch command
    const handler = COMMANDS[trimmed];
    if (handler) {
      const output = handler(data);
      if (output !== null && output !== undefined) {
        addLine(output);
      }
      addLog({ level: 'DEBUG', message: `Terminal: ${trimmed}` });
    } else if (trimmed.startsWith('ls ') || trimmed.startsWith('curl ')) {
      addLine(`bash: ${trimmed.split(' ')[0]}: command not found`);
      addLine('Prueba: ls projects, ls skills, curl /api/contact');
    } else {
      addLine(`bash: ${trimmed}: command not found`);
      addLine('Escribe help para ver la lista de comandos.');
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      execute(input);
      setInput('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(newIdx);
      if (history[newIdx] !== undefined) setInput(history[newIdx]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? '' : history[newIdx] || '');
    }
  };

  return (
    <div
      className={`terminal-overlay ${rmActive ? 'terminal-rm-active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-label="Terminal interactiva"
    >
      <div className="terminal-container">
        <div className="terminal-bar">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="terminal-bar-title">Terminal — alberto-backend</span>
          <button type="button" className="terminal-close" onClick={onClose} aria-label="Cerrar terminal">
            ✕
          </button>
        </div>

        <div className="terminal-body" ref={scrollRef}>
          {lines.map((l, i) => (
            <div key={i} className={`terminal-line ${l.type}`}>
              {l.type === 'prompt' ? (
                <span>
                  <span className="terminal-prompt-user">invitado@alberto-backend</span>
                  <span className="terminal-prompt-sep">:</span>
                  <span className="terminal-prompt-path">~</span>
                  <span className="terminal-prompt-dollar">$</span>
                  <span> {l.text.slice(PROMPT.length + 1)}</span>
                </span>
              ) : (
                <span className="terminal-output-text">{l.text}</span>
              )}
            </div>
          ))}

          <div className="terminal-input-line">
            <span className="terminal-prompt-user">invitado@alberto-backend</span>
            <span className="terminal-prompt-sep">:</span>
            <span className="terminal-prompt-path">~</span>
            <span className="terminal-prompt-dollar">$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              spellCheck={false}
              autoComplete="off"
              aria-label="Comando de terminal"
            />
          </div>
        </div>

        {sudoFired && <div className="terminal-confetti" aria-hidden="true" />}
      </div>
    </div>
  );
}
