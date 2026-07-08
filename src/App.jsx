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
import { useTheme } from './hooks/useTheme';
import './App.css';

export default function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <ErrorBoundary>
      <div className="app-bg" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <Navbar name={data.name} theme={theme} onToggleTheme={toggleTheme} githubUsername={data.github} />

      <main>
        <Hero data={data} />
        <About data={data} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience items={data.experience} />
        <GitHubStats username={data.github} />
        <Contact data={data} />
      </main>

      <Footer name={data.name} social={data.social} />
    </ErrorBoundary>
  );
}
