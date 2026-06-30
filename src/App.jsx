import { useState } from 'react';
import './hero-custom.css';

export default function App() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="abhii-portfolio-page">
      <header>
        <div className="logo">
          <span>Abhii</span>
          <span>portfolio</span>
        </div>

        <nav>
          <button type="button" onClick={() => setAboutOpen(true)}>About</button>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className={`about-page ${aboutOpen ? 'active' : ''}`}>
        <div className="about-header">
          <h2 className="about-title">About Me</h2>
          <button className="close-btn" type="button" onClick={() => setAboutOpen(false)}>x</button>
        </div>

        <div className="about-content">
          <p>Hello, I'm</p>
          <h1>Abhijeet Shrivastav</h1>
        </div>
      </section>
    </div>
  );
}
