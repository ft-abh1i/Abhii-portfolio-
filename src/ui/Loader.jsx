import { useEffect, useState } from 'react';

export function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`loader ${hidden ? 'loader-hidden' : ''}`}>
      <div className="loader-stage" aria-hidden="true">
        <div className="loader-orbit loader-orbit-one" />
        <div className="loader-orbit loader-orbit-two" />
        <div className="loader-core">
          <span>AS</span>
        </div>
      </div>

      <div className="loader-content">
        <p className="loader-label loader-label-top">Full Stack Developer</p>

        <div className="loader-bar-wrap">
          <div className="loader-ticker">
            <span>Loading Experience</span>
            <span>Websites</span>
            <span>Apps</span>
            <span>Frontend</span>
            <span>Backend</span>
            <span>Motion</span>
            <span>Performance</span>
          </div>
          <div className="loader-progress"><span /></div>
        </div>

        <p className="loader-label loader-label-bottom">Creative Web Designer</p>
      </div>
    </div>
  );
}
