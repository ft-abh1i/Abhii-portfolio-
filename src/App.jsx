import './corridor.css';
import './gameworld.css';

const projects = [
  { id: '01', title: 'Bliptwit', type: 'Secure Chat Concept', description: 'Privacy-first chat concept with clean UI and modern product-style interactions.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop', link: 'https://bliptwit.vercel.app' },
  { id: '02', title: 'Herbivya', type: 'Brand Website', description: 'Nature-inspired premium website direction built around trust and mobile-first storytelling.', image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop', link: '#contact' },
  { id: '03', title: 'The Root Institution', type: 'Coaching Website', description: 'Professional education website for students and parents with clear responsive execution.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop', link: 'https://theroot-institution.vercel.app' },
  { id: '04', title: 'Visit Kerala', type: 'Travel Experience', description: 'Visual tourism website showing destinations with smooth browsing and strong imagery.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop', link: 'https://kerala-beauty.vercel.app' },
];

const services = ['Website Design', 'Full Stack Development', 'App UI Design', 'Branding & SEO'];

export default function App() {
  return (
    <div className="portfolio-page exact-portfolio">
      <header className="topbar">
        <a href="#home" className="brand">Abhii Designs</a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#services">Services</a><a href="#contact">Contact</a></nav>
      </header>
      <main>
        <section className="hero-section" id="home">
          <p className="eyebrow">Web Designer & Full Stack Developer</p>
          <h1>I design and build websites for businesses.</h1>
          <p>Modern, mobile-first websites with clean UI, smooth experience, and launch-ready development.</p>
          <div className="hero-actions"><a href="#work" className="primary-btn">View Work</a><a href="#contact" className="ghost-btn">Start Project</a></div>
        </section>

        <section className="work-section" id="work">
          <p className="eyebrow">Selected Work</p>
          <h2>Projects built with design, clarity, and business goals.</h2>
          <div className="work-grid">
            {projects.map((project) => (
              <article className="work-card" key={project.id}>
                <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
                <div className="work-card-content">
                  <span>{project.id} / {project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <a href={project.link} target={project.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">Live Preview</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="services-section" id="services"><p className="eyebrow">Services</p><h2>Complete website partner for serious businesses.</h2><div className="services-grid">{services.map((service, index) => <div className="service-card" key={service}><span>0{index + 1}</span><h3>{service}</h3><p>Clean strategy, mobile-first design, fast execution, and professional launch-ready structure.</p></div>)}</div></section>
        <section className="contact-section" id="contact"><p className="eyebrow">Start a Project</p><h2>Need a premium website that converts visitors into clients?</h2><p>Send your business type, goal, timeline, and reference websites.</p><div className="hero-actions centered"><a href="#home" className="primary-btn">Back to Top</a><a href="#work" className="ghost-btn">View Work</a></div></section>
      </main>
    </div>
  );
}
