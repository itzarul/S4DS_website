import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { detectRenderQuality } from './config';
import './styles/globals.css';

window.RenderQuality = detectRenderQuality();
document.documentElement.dataset.renderQuality = window.RenderQuality.low
  ? 'economy'
  : window.RenderQuality.mobile
    ? 'mobile'
    : 'full';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
