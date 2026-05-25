import { useEffect } from 'react';

const projects = [
  {
    number: '01',
    title: 'The Root Institution',
    type: 'Education / Coaching',
    url: 'https://theroot-institution.vercel.app',
    short: 'Admission-focused coaching website',
    description:
      'A clean education platform designed around credibility, course clarity, and fast mobile action for students and parents.',
    tags: ['Institute UI', 'Mobile CTA', 'Trust design'],
  },
  {
    number: '02',
    title: 'Kerala Beauty',
    type: 'Travel / Visual UI',
    url: 'https://kerala-beauty.vercel.app',
    short: 'Visual travel experience',
    description:
      'A scenic destination interface with immersive sections, bold imagery direction, and a calm travel discovery flow.',
    tags: ['Visual UI', 'Travel flow', 'Story layout'],
  },
];

const capabilities = [
  ['01', 'Direction', 'Website concept, structure, copy hierarchy, and visual positioning before touching the final UI.'],
  ['02', 'Build', 'React/Vite interfaces with responsive layouts, polished movement, and production-ready deployment.'],
  ['03', 'Brand layer', 'Color, typography, section rhythm, CTA language, and SEO-ready foundations for business credibility.'],
];

const stack = ['React', 'Vite', 'Mobile-first', 'SEO structure', 'Branding', 'Landing pages', 'Web apps', 'Fast deploy'];

function App() {
  useEffect(() => {
    const updatePointer = (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', updatePointer);
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  return (
    <main className="site-shell">
      <div className="grain" />
      <div className="cursor-aura" />

      <nav className="nav" aria-label="Main navigation">
        <a className="nav-brand" href="#top" aria-label="Abhii Designs home">
          <span>Abhii</span>
          <span>Designs</span>
        </a>
        <div className="nav-menu">
          <a href="#work">Work</a>
          <a href="#method">Method</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero section">
        <div className="hero-left">
          <p className="eyebrow">Creative developer · India</p>
          <h1>I craft premium websites that make businesses look impossible to ignore.</h1>
          <div className="hero-meta">
            <p>
              Mobile-first websites, web apps, branding foundations, and SEO-ready digital experiences for businesses,
              coaching institutes, and startups.
            </p>
            <a className="magnetic-link" href="https://wa.me/919631192011" target="_blank" rel="noreferrer">
              Start a project
              <span>↗</span>
            </a>
          </div>
        </div>

        <aside className="hero-orbit" aria-label="Abhii Designs status panel">
          <div className="orbit-card main-card">
            <span className="status-dot" />
            <p>Available for selected builds</p>
            <strong>Websites that feel expensive before anyone reads the price.</strong>
          </div>
          <div className="orbit-card mini-card top-card">
            <span>Focus</span>
            <strong>Mobile-first</strong>
          </div>
          <div className="orbit-card mini-card bottom-card">
            <span>Output</span>
            <strong>Live deploys</strong>
          </div>
          <div className="orb-ring" />
        </aside>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>
          {stack.concat(stack).map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section id="work" className="work section">
        <div className="section-intro">
          <span>Selected work</span>
          <h2>Not templates. Business faces with a strong first impression.</h2>
        </div>

        <div className="work-list">
          {projects.map((project) => (
            <article className="work-item" key={project.title}>
              <div className="work-index">{project.number}</div>
              <div className="work-preview">
                <div className="browser-bar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-stage">
                  <p>{project.type}</p>
                  <h3>{project.title}</h3>
                  <div className="preview-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
              <div className="work-copy">
                <p className="project-type">{project.short}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a href={project.url} target="_blank" rel="noreferrer">
                  Open live project <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="method" className="method section">
        <div className="section-intro split">
          <span>How I build</span>
          <h2>Premium is not decoration. It is clarity, spacing, motion, and trust.</h2>
        </div>

        <div className="method-grid">
          {capabilities.map(([number, title, text]) => (
            <article className="method-card" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto section">
        <p>
          A local business should not look local on the internet. It should look sharp, current, and serious enough
          that customers trust it before calling.
        </p>
      </section>

      <section id="contact" className="contact section">
        <div className="contact-panel">
          <p className="eyebrow">Contact</p>
          <h2>Need a website that does not look like everyone else’s?</h2>
          <div className="contact-links">
            <a href="https://wa.me/919631192011" target="_blank" rel="noreferrer">
              WhatsApp
              <span>+91 9631192011</span>
            </a>
            <a href="mailto:contact@abhii.online">
              Email
              <span>contact@abhii.online</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
