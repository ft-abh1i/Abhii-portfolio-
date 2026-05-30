import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Loader from './components/Loader.jsx';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/loader.css';

const PRELOAD_IMAGES = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
];

function preloadPortfolioAssets() {
  PRELOAD_IMAGES.forEach((src) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });
}

function Root() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaderPhase, setLoaderPhase] = useState('loading');

  useEffect(() => {
    preloadPortfolioAssets();

    const duration = 4000;
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setLoadingProgress(nextProgress);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(tick);
      } else {
        setLoadingProgress(100);
        setLoaderPhase('hidden');
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <Loader progress={loadingProgress} phase={loaderPhase} />
      <App />
    </>
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(<Root />);
