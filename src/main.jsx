import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Loader from './components/Loader.jsx';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/loader.css';

function Root() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaderPhase, setLoaderPhase] = useState('loading');

  useEffect(() => {
    let current = 0;
    const progressTimer = window.setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setLoadingProgress(100);
        window.clearInterval(progressTimer);
        window.setTimeout(() => setLoaderPhase('welcome'), 420);
        window.setTimeout(() => setLoaderPhase('hidden'), 1350);
      } else {
        setLoadingProgress(current);
      }
    }, 95);

    return () => window.clearInterval(progressTimer);
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
