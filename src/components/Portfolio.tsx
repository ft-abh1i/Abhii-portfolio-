"use client";

import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SceneMode } from "./SceneCanvas";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <div className="scene-canvas scene-canvas--fallback" aria-hidden="true" />,
});

const projects = [
  {
    number: "01",
    eyebrow: "Realtime product",
    title: "BlipTwit",
    description:
      "A private realtime messaging experience built around fast conversations, clear interaction states and a focused dark interface.",
    stack: ["JavaScript", "Firebase", "Product UI"],
    live: "https://bliptwit.vercel.app",
    code: "https://github.com/ft-abh1i/bliptwit",
    visual: "chat",
    mode: "matter" as SceneMode,
  },
  {
    number: "02",
    eyebrow: "Startup MVP",
    title: "Hapycure Food",
    description:
      "A warm food discovery interface that makes homemade meals feel trustworthy, accessible and easy to order.",
    stack: ["UX Design", "Frontend", "Figma"],
    live: "https://hapycure-food.vercel.app",
    code: "https://github.com/ft-abh1i/hapycure",
    visual: "food",
    mode: "orbit" as SceneMode,
  },
  {
    number: "03",
    eyebrow: "Brand website",
    title: "The Root Institution",
    description:
      "A structured institutional website translating credibility, information and responsive design into a focused digital presence.",
    stack: ["Web Design", "Development", "Responsive"],
    live: "https://therootinstitution.vercel.app",
    code: "https://github.com/ft-abh1i/therootinstitution",
    visual: "root",
    mode: "signal" as SceneMode,
  },
];

const labModes: Array<{ mode: SceneMode; label: string; meta: string; description: string }> = [
  {
    mode: "matter",
    label: "Matter",
    meta: "GLSL / deformation",
    description: "A procedural surface displaced in the vertex shader and shaded with fresnel-driven colour bands.",
  },
  {
    mode: "orbit",
    label: "Orbit",
    meta: "Geometry / motion",
    description: "A kinetic torus system combining layered rotations, metallic materials and spatial light.",
  },
  {
    mode: "signal",
    label: "Signal",
    meta: "Particles / line",
    description: "A generative helix assembled from particles, a continuous signal line and wireframe structure.",
  },
];

function ProjectVisual({ type }: { type: string }) {
  if (type === "chat") {
    return (
      <div className="browser browser--chat" aria-hidden="true">
        <div className="browser-bar"><i /><i /><i /><span>bliptwit.app</span></div>
        <div className="chat-layout">
          <div className="chat-sidebar">
            <b>Messages</b>
            {[0, 1, 2, 3].map((item) => <div className="chat-contact" key={item}><i /><span /></div>)}
          </div>
          <div className="chat-room">
            <div className="chat-room-head"><i /><span /></div>
            <div className="chat-messages"><i /><i className="mine" /><i /><i className="mine" /></div>
            <div className="chat-input"><span /><b>↑</b></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "food") {
    return (
      <div className="browser browser--food" aria-hidden="true">
        <div className="browser-bar"><i /><i /><i /><span>hapycure.food</span></div>
        <div className="food-layout">
          <div className="food-copy"><small>Homemade today</small><b>Comfort food,<br />made nearby.</b><span /><span /><button type="button">Explore menu</button></div>
          <div className="food-plate"><i /><em>fresh</em></div>
        </div>
      </div>
    );
  }

  return (
    <div className="browser browser--root" aria-hidden="true">
      <div className="browser-bar"><i /><i /><i /><span>therootinstitution.org</span></div>
      <div className="root-layout">
        <div className="root-nav"><b>ROOT.</b><span>About&nbsp;&nbsp; Programs&nbsp;&nbsp; Contact</span></div>
        <div className="root-hero"><small>LEARN / GROW / LEAD</small><b>Education with<br />strong foundations.</b><i>R</i></div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorDot = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SceneMode>("matter");
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const escape = window.setTimeout(() => setLoaded(true), 2600);
    return () => window.clearTimeout(escape);
  }, []);

  useEffect(() => {
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const header = document.querySelector<HTMLElement>(".site-header");

    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const amount = window.scrollY / max;
      progress?.style.setProperty("transform", `scaleX(${amount})`);
      header?.classList.toggle("is-scrolled", window.scrollY > 40);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const next = visible?.target.getAttribute("data-scene") as SceneMode | null;
        if (next) setMode(next);
      },
      { rootMargin: "-28% 0px -42% 0px", threshold: [0.05, 0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      gsap.set(".hero-word", { yPercent: 115 });
      gsap.set(".hero-fade", { opacity: 0, y: 22 });

      const intro = gsap.timeline({ delay: 0.25 });
      intro
        .to(".hero-word", { yPercent: 0, duration: 1.05, stagger: 0.08, ease: "power4.out" })
        .to(".hero-fade", { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: "power3.out" }, "-=0.55");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 54, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".project-chapter").forEach((chapter) => {
        const card = chapter.querySelector(".project-card");
        const title = chapter.querySelector(".project-title");
        gsap.fromTo(
          card,
          { scale: 0.94, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 78%", end: "top 24%", scrub: 0.7 },
          },
        );
        gsap.fromTo(
          title,
          { xPercent: 8 },
          {
            xPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );
      });

      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-ghost", {
          yPercent: 34,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
        });
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (!cursor.current || !cursorDot.current || window.matchMedia("(pointer: coarse)").matches) return;
    const ring = cursor.current;
    const dot = cursorDot.current;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let targetX = ringX;
    let targetY = ringY;
    let frame = 0;

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };
    const tick = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = window.requestAnimationFrame(tick);
    };
    const enter = () => ring.classList.add("is-active");
    const leave = () => ring.classList.remove("is-active");
    const targets = Array.from(document.querySelectorAll("a, button, input, textarea, .project-card"));

    window.addEventListener("pointermove", move, { passive: true });
    targets.forEach((target) => {
      target.addEventListener("pointerenter", enter);
      target.addEventListener("pointerleave", leave);
    });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      targets.forEach((target) => {
        target.removeEventListener("pointerenter", enter);
        target.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  const tilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${-y * 4.5}deg`);
    card.style.setProperty("--tilt-y", `${x * 5.5}deg`);
    card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={root} className={loaded ? "portfolio is-loaded" : "portfolio is-loading"}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <div className="loader" aria-hidden={loaded}>
        <div className="loader-top"><span>ABHII / PORTFOLIO</span><span>WEBGL EXPERIENCE</span></div>
        <div className="loader-center"><span>Entering</span><strong>the third dimension.</strong></div>
        <div className="loader-line"><i /></div>
      </div>

      <div className="scroll-progress" />
      <SceneCanvas mode={mode} onReady={() => setLoaded(true)} />
      <div className="scene-vignette" aria-hidden="true" />
      <div className="scene-grid" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div ref={cursor} className="cursor-ring" aria-hidden="true" />
      <div ref={cursorDot} className="cursor-dot" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Abhii portfolio home">
          <span className="brand-mark">A</span>
          <span className="brand-copy"><b>Abhii</b><small>Creative developer</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a><a href="#work">Work</a><a href="#lab">Labs</a><a href="#contact">Contact</a>
        </nav>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="menu-overlay">
          <span>{menuOpen ? "Close" : "Menu"}</span><i className={menuOpen ? "is-open" : ""} />
        </button>
      </header>

      <div id="menu-overlay" className={menuOpen ? "menu-overlay is-open" : "menu-overlay"} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <a href="#about" onClick={closeMenu}><span>01</span>About</a>
          <a href="#work" onClick={closeMenu}><span>02</span>Selected work</a>
          <a href="#lab" onClick={closeMenu}><span>03</span>3D labs</a>
          <a href="#contact" onClick={closeMenu}><span>04</span>Contact</a>
        </nav>
        <div className="menu-foot"><a href="https://github.com/ft-abh1i" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://in.linkedin.com/in/abh1i" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
      </div>

      <main id="main-content">
        <section className="hero" id="top" data-scene="matter">
          <div className="hero-ghost" aria-hidden="true">ABHII</div>
          <div className="hero-topline hero-fade"><span>INDIA / 2026</span><span>WEB · MOTION · 3D</span></div>
          <div className="hero-copy">
            <div className="hero-kicker hero-fade"><i /> Available for creative collaborations</div>
            <h1 aria-label="Creative developer and 3D designer">
              <span className="line"><span className="hero-word">Creative</span></span>
              <span className="line line--offset"><span className="hero-word">developer <em>&amp;</em></span></span>
              <span className="line"><span className="hero-word">3D designer.</span></span>
            </h1>
            <p className="hero-description hero-fade">I create interactive web experiences where visual design, motion and real-time 3D work as one system.</p>
            <div className="hero-actions hero-fade">
              <a className="round-link" href="#work"><span>View work</span><b>↘</b></a>
              <a className="text-link" href="mailto:contact@abhii.online">contact@abhii.online ↗</a>
            </div>
          </div>
          <div className="hero-index hero-fade"><span>SCENE / 01</span><b>PROCEDURAL MATTER</b><small>Move your pointer</small></div>
          <div className="scroll-label hero-fade"><i /> Scroll to explore</div>
        </section>

        <div className="ticker" aria-hidden="true"><div>
          <span>THREE.JS</span><i>✦</i><span>REACT THREE FIBER</span><i>✦</i><span>INTERACTION DESIGN</span><i>✦</i><span>GSAP</span><i>✦</i><span>SPATIAL UI</span><i>✦</i>
          <span>THREE.JS</span><i>✦</i><span>REACT THREE FIBER</span><i>✦</i><span>INTERACTION DESIGN</span><i>✦</i><span>GSAP</span><i>✦</i><span>SPATIAL UI</span><i>✦</i>
        </div></div>

        <section className="about section" id="about" data-scene="signal">
          <div className="section-head reveal"><span>01 / ABOUT</span><p>DESIGNING BETWEEN<br />LOGIC AND FEELING</p></div>
          <div className="about-grid">
            <div className="about-title reveal"><h2>Digital work<br />should feel <em>alive.</em></h2></div>
            <div className="about-copy reveal">
              <p className="lead">I am Abhijeet, a creative developer and designer focused on turning flat interfaces into expressive, interactive digital spaces.</p>
              <p>My process connects concept, typography, motion and code. The goal is not to add 3D everywhere—it is to use depth and interaction where they make the experience clearer, more tactile and more memorable.</p>
              <div className="about-meta"><div><span>FOCUS</span><b>Creative development<br />Spatial interfaces<br />Digital design</b></div><div><span>BASED IN</span><b>India<br />Working worldwide</b></div></div>
            </div>
          </div>
          <div className="principles">
            <article className="reveal"><span>01</span><h3>Concept first</h3><p>Every visual effect starts with a reason and supports the idea.</p></article>
            <article className="reveal"><span>02</span><h3>Motion with intent</h3><p>Animation guides attention, explains change and creates rhythm.</p></article>
            <article className="reveal"><span>03</span><h3>Real-device thinking</h3><p>Responsive fallbacks and performance budgets are part of the design.</p></article>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="work-intro reveal"><div><span>02 / SELECTED WORK</span><h2>Built to be used.<br /><em>Designed to be remembered.</em></h2></div><p>Selected product and brand experiences developed through interface design, frontend code and interaction systems.</p></div>

          <div className="project-stack">
            {projects.map((project) => (
              <article className="project-chapter" key={project.title} data-scene={project.mode}>
                <div className="project-card" onPointerMove={tilt} onPointerLeave={resetTilt}>
                  <div className="project-card-top"><span>{project.number} / {project.eyebrow}</span><span>2026</span></div>
                  <div className="project-stage"><ProjectVisual type={project.visual} /></div>
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-bottom"><div>{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-actions"><a href={project.live} target="_blank" rel="noreferrer">Live site ↗</a><a href={project.code} target="_blank" rel="noreferrer">Source ↗</a></div></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="lab section" id="lab" data-scene={mode}>
          <div className="section-head reveal"><span>03 / 3D LABS</span><p>PROCEDURAL EXPERIMENTS<br />RUNNING IN YOUR BROWSER</p></div>
          <div className="lab-grid">
            <div className="lab-title reveal"><h2>Not screenshots.<br /><em>Live systems.</em></h2><p>The scene behind this interface is rendered in real time. Switch its visual logic below.</p></div>
            <div className="lab-list reveal">
              {labModes.map((item, index) => (
                <button className={mode === item.mode ? "lab-item is-active" : "lab-item"} type="button" key={item.mode} onClick={() => setMode(item.mode)}>
                  <span>0{index + 1}</span><div><b>{item.label}</b><small>{item.meta}</small><p>{item.description}</p></div><i>↗</i>
                </button>
              ))}
            </div>
          </div>
          <div className="lab-status reveal"><span><i /> LIVE WEBGL</span><span>NEXT.JS / R3F / THREE.JS / GLSL</span><span>{mode.toUpperCase()} MODE ACTIVE</span></div>
        </section>

        <section className="capabilities section" data-scene="orbit">
          <div className="section-head reveal"><span>04 / CAPABILITIES</span><p>A FOCUSED TOOLKIT FOR<br />EXPRESSIVE DIGITAL WORK</p></div>
          <div className="capability-list">
            <div className="capability-row reveal"><span>01</span><h3>Creative frontend</h3><p>Responsive interfaces, component architecture and interaction systems.</p><b>React / Next.js / JavaScript</b></div>
            <div className="capability-row reveal"><span>02</span><h3>Realtime 3D</h3><p>Procedural scenes, geometry, materials, lights and pointer interaction.</p><b>Three.js / R3F / GLSL</b></div>
            <div className="capability-row reveal"><span>03</span><h3>Motion design</h3><p>Scroll narratives, transitions, choreography and micro-interactions.</p><b>GSAP / CSS / Timing</b></div>
            <div className="capability-row reveal"><span>04</span><h3>Digital design</h3><p>Visual direction, interface systems, hierarchy and responsive layouts.</p><b>Figma / UI / Prototyping</b></div>
          </div>
        </section>

        <section className="contact section" id="contact" data-scene="matter">
          <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="contact-copy reveal"><span>05 / CONTACT</span><h2>Have an idea<br />that needs <em>depth?</em></h2><p>Tell me what you are building. I am open to selected freelance projects, collaborations and creative-development opportunities.</p><a className="contact-email" href="mailto:contact@abhii.online">contact@abhii.online <b>↗</b></a></div>
          <form className="contact-form reveal" action="https://formspree.io/f/xyklvzld" method="POST">
            <label><span>Your name</span><input name="name" type="text" autoComplete="name" placeholder="Name" required /></label>
            <label><span>Your email</span><input name="email" type="email" autoComplete="email" placeholder="Email address" required /></label>
            <label><span>Project details</span><textarea name="message" placeholder="A little about the idea, scope and timeline" minLength={15} required /></label>
            <button type="submit"><span>Send inquiry</span><b>↗</b></button>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div><a className="brand" href="#top"><span className="brand-mark">A</span><span className="brand-copy"><b>Abhii</b><small>Creative developer</small></span></a><p>Interactive web experiences shaped through code, motion and digital design.</p></div>
        <div className="footer-links"><span>CONNECT</span><a href="https://github.com/ft-abh1i" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://in.linkedin.com/in/abh1i" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://instagram.com/ft.abh1i" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        <div className="footer-meta"><span>BUILT WITH</span><b>Next.js + React Three Fiber</b><small>© 2026 Abhijeet Shrivastava</small></div>
      </footer>
    </div>
  );
}
