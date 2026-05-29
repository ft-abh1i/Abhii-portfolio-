import { ArrowUpRight } from 'lucide-react';
import { site } from '../../data/site.js';

export function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Available for selected builds</p>
          <h1>{site.role}</h1>
          <p className="hero-headline">{site.headline}</p>
          <p className="hero-intro">{site.intro}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">View Work <ArrowUpRight size={18} /></a>
            <a className="btn btn-ghost" href="#contact">Start Project</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="avatar-core">AS</div>
          <div className="ring ring-one" />
          <div className="ring ring-two" />
        </div>
      </div>
    </section>
  );
}
