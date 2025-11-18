import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Disable automatic scroll restoration by the browser
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
