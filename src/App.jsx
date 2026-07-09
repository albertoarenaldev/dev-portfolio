import { useCallback, useEffect, useState } from 'react';
import data from './projects.json';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import GitHubStats from './components/GitHubStats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BootSequence from './components/BootSequence';
import LiveLogs from './components/LiveLogs';
import TerminalMode from './components/TerminalMode';
import { useTheme } from './hooks/useTheme';
import { LiveLogsProvider } from './hooks/useLiveLogs';
import './App.css';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [bootDone, setBootDone] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const handleBootDone = useCallback(() => setBootDone(true), []);
  const handleOpenTerminal = useCallback(() => setTerminalOpen(true), []);
  const handleCloseTerminal = useCallback(() => setTerminalOpen(false), []);

  // Global keyboard shortcut: Ctrl+` toggles terminal
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setTerminalOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ErrorBoundary>
      <LiveLogsProvider>
        {!bootDone && <BootSequence onComplete={handleBootDone} />}

        <div className="app-bg" aria-hidden="true">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>

        <Navbar name={data.name} theme={theme} onToggleTheme={toggleTheme} githubUsername={data.github} onOpenTerminal={handleOpenTerminal} />

        <main>
          <Hero data={data} />
          <About data={data} />
          <Skills skills={data.skills} />
          <Projects projects={data.projects} />
          <Experience items={data.experience} />
          <GitHubStats
            username={data.github}
            fallbackProfile={data.githubProfileFallback}
            fallbackRepos={data.githubTopRepos}
          />
          <Contact data={data} />
        </main>

        <Footer name={data.name} social={data.social} />

        <LiveLogs />

        {terminalOpen && (
          <TerminalMode data={data} onClose={handleCloseTerminal} />
        )}
      </LiveLogsProvider>
    </ErrorBoundary>
  );
}
