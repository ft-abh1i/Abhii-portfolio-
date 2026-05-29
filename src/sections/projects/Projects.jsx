import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects.js';

export function Projects() {
  return (
    <section className="section projects" id="work">
      <div className="section-heading">
        <p className="eyebrow">Featured work</p>
        <h2>Selected builds with clean design and strong execution.</h2>
      </div>
      <div className="project-list">
        {projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <span className="project-index">0{index + 1}</span>
            <div>
              <p className="project-tag">{project.tag}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <a className="project-link" href={project.href} aria-label={`Open ${project.title}`}>
              <ArrowUpRight size={22} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
