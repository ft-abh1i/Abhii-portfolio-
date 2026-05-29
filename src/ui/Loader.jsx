import { useEffect, useState } from 'react';

export function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`loader ${hidden ? 'loader-hidden' : ''}`}>
      <div className="loader-text">abhijeet</div>
      <div className="loader-line"><span /></div>
    </div>
  );
}
