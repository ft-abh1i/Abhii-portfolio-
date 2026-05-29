import { useEffect, useState } from 'react';

export function Loader() {
  const [isDone, setIsDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000;
    const startedAt = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(interval);
        setShowWelcome(true);
        window.setTimeout(() => setIsDone(true), 1800);
      }
    }, 30);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`loader ${isDone ? 'loader-hidden' : ''} ${showWelcome ? 'loader-welcome-active' : ''}`}>
      {!showWelcome && (
        <>
          <div className="loader-marquee loader-marquee-top">
            <div className="loader-marquee-track loader-left-to-right">
              <span>Full Stack Developer</span>
              <span>Full Stack Developer</span>
              <span>Full Stack Developer</span>
              <span>Full Stack Developer</span>
            </div>
          </div>

          <div className="loader-center">
            <div className="loader-count">{progress}%</div>
            <div className="loader-bar">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="loader-caption">Loading</div>
          </div>

          <div className="loader-marquee loader-marquee-bottom">
            <div className="loader-marquee-track loader-right-to-left">
              <span>Creative Web Designer</span>
              <span>Creative Web Designer</span>
              <span>Creative Web Designer</span>
              <span>Creative Web Designer</span>
            </div>
          </div>
        </>
      )}

      {showWelcome && <div className="loader-welcome">Welcome</div>}
    </div>
  );
}
