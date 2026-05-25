import { useState } from 'react';
import { motion } from 'framer-motion';
import { navLinks } from '../data/portfolio.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <a className="brand" href="#home" onClick={() => setOpen(false)}>Abhii Designs</a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navLinks.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
      </nav>
      <a className="nav-cta" href="#contact">Start a Project</a>
      <button className="menu-btn" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        <span />
        <span />
      </button>
      {open && (
        <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} aria-label="Mobile navigation">
          {navLinks.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>)}
          <a className="mobile-cta" href="#contact" onClick={() => setOpen(false)}>Start a Project</a>
        </motion.nav>
      )}
    </header>
  );
}
