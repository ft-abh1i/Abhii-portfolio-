import { useEffect, useMemo, useState } from 'react';
import './corridor.css';
import './gameworld.css';

const projects = [
  {
    id: '01',
    title: 'Bliptwit',
    type: 'Secure Chat Concept',
    description: 'Privacy-first chat concept with clean UI, secure messaging ideas, and modern product-style interactions.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    link: 'https://bliptwit.vercel.app',
  },
  {
    id: '02',
    title: 'Herbivya',
    type: 'Brand Website',
    description: 'Nature-inspired premium website direction built around trust, calm visuals, and mobile-first storytelling.',
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop',
    link: '#contact',
  },
  {
    id: '03',
    title: 'The Root Institution',
    type: 'Coaching Website',
    description: 'Professional education website for students and parents with clear content and responsive execution.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    link: 'https://theroot-institution.vercel.app',
  },
  {
    id: '04',
    title: 'Visit Kerala',
    type: 'Travel Experience',
    description: 'Visual tourism website showing Kerala destinations with smooth browsing and strong imagery.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    link: 'https://kerala-beauty.vercel.app',
  },
];

const services = ['Website Design', 'Full Stack Development', 'App UI Design', 'Branding & SEO'];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const smooth = (value) => value * value * (3 - 2 * value);

export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = document.querySelector('.corridor-section');
    if (!section) return undefined;

    let frameId = 0;
    const updateScene = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        setProgress(total > 0 ? clamp(-rect.top / total, 0, 1) : 0);
      });
    };

    updateScene();
    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateScene);
      window.removeEventListener('resize', updateScene);
    };
  }, []);

  const activeIndex = useMemo(() => {
    const stops = projects.map((_, index) => (index + 0.5) / projects.length);
    return stops.reduce((closest, stop, index) => (
      Math.abs(progress - stop) < Math.abs(progress - stops[closest]) ? index : closest
    ), 0);
  }, [progress]);

  const activeProject = projects[activeIndex];

  return (
    <div className="portfolio-page exact-portfolio">
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
          <p className="eyebrow">Interactive One Page Portfolio</p>
          <h1>A running character inside a project room.</h1>
          <p>Scroll karo. Character room mein aage badhega. Wall ki photo paas aate hi zoom hogi, details dikhenge, phir zoom out hoke next photo par jayega.</p>
          <div className="hero-actions">
            <a href="#work" className="primary-btn">Enter Room</a>
            <a href="#contact" className="ghost-btn">Start Project</a>
          </div>
        </section>

        <section className="corridor-section exact-corridor" id="work" aria-label="Running character project corridor">
          <div className="exact-stage" style={{ '--scroll': progress }}>
            <div className="room-backdrop" />
            <div className="room-wall room-wall-left" />
            <div className="room-wall room-wall-right" />
            <div className="room-floor" />
            <div className="room-depth-lines" />

            <div
              className="runner"
              style={{ '--run': progress }}
              aria-hidden="true"
            >
              <span className="runner-shadow" />
              <span className="runner-head" />
              <span className="runner-body" />
              <span className="runner-arm runner-arm-left" />
              <span className="runner-arm runner-arm-right" />
              <span className="runner-leg runner-leg-left" />
              <span className="runner-leg runner-leg-right" />
            </div>

            {projects.map((project, index) => {
              const stop = (index + 0.5) / projects.length;
              const distance = Math.abs(progress - stop);
              const rawFocus = clamp(1 - distance * projects.length * 2.15, 0, 1);
              const focus = smooth(rawFocus);
              const side = index % 2 === 0 ? 'left' : 'right';
              const isFocused = focus > 0.46;
              const wallX = side === 'left' ? 18 : 82;
              const centerX = 50;
              const x = wallX + (centerX - wallX) * focus;
              const y = 28 + index * 7 - focus * 2;
              const scale = 0.58 + focus * 0.55;
              const rotate = side === 'left' ? -13 + focus * 13 : 13 - focus * 13;

              return (
                <article
                  key={project.id}
                  className={`wall-photo wall-photo-${side} ${isFocused ? 'is-focused' : ''}`}
                  style={{
                    '--focus': focus,
                    left: `${x}%`,
                    top: `${y}%`,
                    opacity: 0.36 + focus * 0.64,
                    transform: `translate(-50%, -50%) scale(${scale}) rotateY(${rotate}deg)`,
                    zIndex: isFocused ? 30 : 10 + index,
                  }}
                >
                  <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
                  <div className="photo-details">
                    <span>{project.id} / {project.type}</span>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <a href={project.link} target={project.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">Live Preview</a>
                  </div>
                </article>
              );
            })}

            <div className="room-caption">
              <span>Now viewing</span>
              <strong>{activeProject.title}</strong>
            </div>

            <div className="room-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress})` }} />
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
