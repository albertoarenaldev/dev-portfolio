import { useReveal } from '../hooks/useReveal';
import SkillIcon from './SkillIcon';

export default function Skills({ skills = [] }) {
  const ref = useReveal();

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <header className="section-header">
          <p className="eyebrow">Stack</p>
          <h2 className="display">Tecnologías que uso cada día.</h2>
        </header>

        <div className="skills-categories">
          {skills.map((group) => (
            <div key={group.category} className="skill-category glass">
              <h3>{group.category}</h3>
              <ul className="skill-tags">
                {group.items.map((item) => (
                  <li key={item.name} className="skill-tag">
                    <span className="skill-tag-icon">
                      <SkillIcon name={item.icon} size={18} />
                    </span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
