const projects = [
  {
    title: 'The Root Institution',
    type: 'Education / Coaching',
    url: 'https://theroot-institution.vercel.app',
    description:
      'A focused coaching website built to make classes, trust signals, and admission actions clear on mobile.',
  },
  {
    title: 'Kerala Beauty',
    type: 'Travel / Visual UI',
    url: 'https://kerala-beauty.vercel.app',
    description:
      'A visual travel experience with destination-led storytelling, smooth sections, and a polished presentation.',
  },
];

const services = [
  'Mobile-first website design',
  'React web apps',
  'Branding foundations',
  'SEO-ready structure',
];

function App() {
  return (
    <main className="site-shell">
      <div className="noise" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <nav className="navbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Abhii Designs home">
          <span className="brand-mark">AD</span>
          <span>Abhii Designs</span>
        </a>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero section-pad">
        <div className="hero-badge">Creative developer portfolio</div>
        <h1>I craft premium websites that make businesses look impossible to ignore.</h1>
        <p className="hero-subtext">
          Mobile-first websites, web apps, branding foundations, and SEO-ready digital experiences for businesses,
          coaching institutes, and startups.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="https://wa.me/919631192011" target="_blank" rel="noreferrer">
            Start a project
          </a>
          <a className="btn btn-secondary" href="#projects">
            View work
          </a>
        </div>
        <div className="hero-panel" aria-label="Portfolio highlights">
          <div>
            <strong>02</strong>
            <span>Live projects</span>
          </div>
          <div>
            <strong>4+</strong>
            <span>Core services</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Mobile-first</span>
          </div>
        </div>
      </section>

      <section id="projects" className="section-pad section-block">
        <div className="section-heading">
          <p>Selected work</p>
          <h2>Websites designed to look sharp, load clean, and convert attention into trust.</h2>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="card-topline">
                <span>{project.type}</span>
                <span>0{index + 1}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                Live preview <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="section-pad section-block">
        <div className="section-heading compact">
          <p>Services</p>
          <h2>Everything needed for a strong online first impression.</h2>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <div className="service-card" key={service}>
              <span />
              <h3>{service}</h3>
              <p>Clean structure, premium visual direction, and practical execution for real business use.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact section-pad">
        <div className="contact-card">
          <p>Have a business, institute, or startup?</p>
          <h2>Let’s build a website that makes people take you seriously.</h2>
          <div className="contact-actions">
            <a className="btn btn-primary" href="https://wa.me/919631192011" target="_blank" rel="noreferrer">
              WhatsApp Abhii
            </a>
            <a className="btn btn-secondary" href="mailto:contact@abhii.online">
              contact@abhii.online
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
