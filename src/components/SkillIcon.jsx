import {
  // Web / Frontend humor
  SiJavascript, SiTypescript, SiReact, SiNodedotjs, SiPython,
  SiHtml5, SiTailwindcss, SiNextdotjs, SiFigma,
  // Backend / DB (existing)
  SiGit, SiGithub, SiDocker, SiVite, SiExpress, SiPostgresql, SiMongodb,
  SiFastapi,
  // Backend Java stack (Alberto)
  SiSpring, SiMysql, SiPostman, SiLinux, SiUbuntu,
  SiApachemaven, SiAngular,
} from 'react-icons/si';
import { DiJavascript1, DiJava } from 'react-icons/di';
import { FiCode, FiMonitor } from 'react-icons/fi';

/**
 * Map of Simple-Icons name -> React-Icons component.
 * Any unknown / missing name falls back to a generic code glyph (FiCode).
 */
const SI = {
  SiJavascript, SiTypescript, SiReact, SiNodedotjs, SiPython,
  SiHtml5, SiTailwindcss, SiNextdotjs, SiFigma,
  SiGit, SiGithub, SiDocker, SiVite, SiExpress, SiPostgresql, SiMongodb,
  SiFastapi,
  // Java-stack
  SiSpring, SiMysql, SiPostman, SiLinux, SiUbuntu,
  SiApachemaven, SiAngular,
};

// Backwards-compatible aliases for the legacy iconMap keys and trademark fallbacks
const ALIASES = {
  SiDiJavascript: DiJavascript1,
  SiJava: DiJava,         // trademark fallback for the Java logo
  SiWindows: FiMonitor,   // no SimpleIcon equivalent falls back to a monitor glyph
};

export default function SkillIcon({ name, size = 16 }) {
  const Icon = SI[name] ?? ALIASES[name] ?? FiCode;
  return <Icon size={size} aria-hidden="true" />;
}
