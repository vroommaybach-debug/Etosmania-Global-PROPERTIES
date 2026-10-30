import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  const isInjectedExtensionNoise = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('metamask') ||
      lower.includes('chrome-extension://') ||
      lower.includes('moz-extension://') ||
      lower.includes('inpage.js')
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      const combined = `${event.message || ''} ${event.filename || ''} ${event.error?.stack || ''}`;
      if (isInjectedExtensionNoise(combined)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason;
      const combined = `${reason?.message || String(reason || '')} ${reason?.stack || ''}`;
      if (isInjectedExtensionNoise(combined)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(<App />);

