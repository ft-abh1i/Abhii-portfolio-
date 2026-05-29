import { useEffect, useMemo, useState } from 'react';
import './corridor.css';

const projects = [
  {
    id: '01',
    title: 'Bliptwit',
    type: 'Secure Chat Concept',
    description: 'A privacy-first social chat concept with clean UI, secure messaging ideas, and modern product-style interactions.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop',
    link: 'https://bliptwit.vercel.app',
  },
  {
    id: '02',
    title: 'Herbivya',
    type: 'Brand Website',
    description: 'A premium nature-inspired website direction built around trust, calm visuals, brand presence, and mobile-first storytelling.',
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1400&auto=format&fit=crop',
    link: '#contact',
  },
  {
    id: '03',
    title: 'The Root Institution',
    type: 'Coaching Website',
    description: 'A professional education website for students and parents with trust-focused sections, clear content, and responsive execution.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop',
    link: 'https://theroot-institution.vercel.app',
  },
  {
    id: '04',
    title: 'Visit Kerala',
    type: 'Travel Experience',
    description: 'A visual tourism website experience showing Kerala destinations with smooth browsing, strong imagery, and simple navigation.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1400&auto=format&fit=crop',
    link: 'https://kerala-beauty.vercel.app',
  },
];

const services = ['Website Design', 'Full Stack Development', 'App UI Design', 'Branding & SEO'];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const activeProject = useMemo(() => projects[activeIndex], [activeIndex]);

  useEffect(() => {
    const section = document.querySelector('.corridor-section');
    if (!section) return undefined;

    const updateScene = () => {
      const rect = section.getBoundingClientRect();
      const totalScroll = section.offsetHeight - window.innerHeight;
      const rawProgress = totalScroll > 0 ? Math.min(Math.max(-rect.top / totalScroll, 0), 1) : 0;
      const index = Math.min(projects.length - 1, Math.floor(rawProgress * projects.length));
      setProgress(rawProgress);
      setActiveIndex(index);
    };

    updateScene();
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);

    return () => {
      window.removeEventListener('scroll', updateScene);
      window.removeEventListener('resize', updateScene);
    };
  }, []);

  return (
    <div className="portfolio-page">
      <header className="topbar">
        <a href="#home" className="brand">Abhii Designs</a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <p className="eyebrow">Web Designer & Full Stack Developer in India</p>
          <h1>Scroll through my work like a cinematic project corridor.</h1>
          <p>I build mobile-first websites, full stack web apps, branding, and SEO-focused digital experiences for businesses, coaching institutes, startups, and modern brands.</p>
          <div className="hero-actions">
            <a href="#work" className="primary-btn">Enter Portfolio</a>
            <a href="#contact" className="ghost-btn">Start Project</a>
          </div>
        </section>

        <section className="corridor-section" id="work" aria-label="Scroll project corridor">
          <div className="sticky-scene">
            <div className="room">
              <div className="wall left-wall" />
              <div className="wall right-wall" />
              <div className="floor" />

              <div className="character" style={{ transform: `translateX(-50%) translateY(${-progress * 70 + Math.sin(progress * 70) * 5}px) scale(${1 - progress * 0.18})` }} aria-hidden="true">
                <span className="character-head" />
                <span className="character-body" />
                <span className="character-legs" />
              </div>

              {projects.map((project, index) => {
                const distance = Math.abs(index - activeIndex);
                const side = index % 2 === 0 ? 'left' : 'right';

                return (
                  <article className={`project-frame ${side} ${index === activeIndex ? 'active' : ''}`} key={project.id} style={{ opacity: index === activeIndex ? 1 : Math.max(0.14, 0.65 - distance * 0.2), filter: index === activeIndex ? 'blur(0)' : `blur(${Math.min(distance * 2, 5)}px)` }}>
                    <img src={project.image} alt={`${project.title} preview`} />
                    <div className="project-content">
                      <span>{project.id} / {project.type}</span>
                      <h2>{project.title}</h2>
                      <p>{project.description}</p>
                      <a href={project.link} target={project.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">Live Preview</a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="scene-status">
              <span>Viewing</span>
              <strong>{activeProject.title}</strong>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <p className="eyebrow">Services</p>
          <h2>Complete website partner for serious businesses.</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={service}>
                <span>0{index + 1}</span>
                <h3>{service}</h3>
                <p>Clean strategy, mobile-first design, fast execution, and professional launch-ready structure.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="eyebrow">Start a Project</p>
          <h2>Need a premium website that converts visitors into clients?</h2>
          <p>Send your business type, goal, timeline, and reference websites. I will reply with clear next steps.</p>
          <div className="hero-actions centered">
            <a href="mailto:contact@abhii.online" className="primary-btn">Email Me</a>
            <a href="https://www.instagram.com/ft.abh1i/" className="ghost-btn" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </section>
      </main>
    </div>
  );
}
