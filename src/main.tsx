import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { ngrokService } from './services/ngrok.service';

// Extend Window interface for public URL
declare global {
  interface Window {
    __PUBLIC_URL__?: string;
  }
}

// Initialize ngrok and store public URL globally
ngrokService.initialize().then((publicUrl) => {
  window.__PUBLIC_URL__ = publicUrl;
  console.log('✅ Global access enabled:', publicUrl);
  console.log('📍 Public URL stored in window.__PUBLIC_URL__');
  console.log('⚠️ CRITICAL: All QR codes will use this URL + /view/:sessionId');
  console.log('Example QR URL:', `${publicUrl}/view/abc123xyz`);
}).catch((error) => {
  console.error('❌ Failed to initialize ngrok:', error);
  window.__PUBLIC_URL__ = window.location.origin;
  console.log('⚠️ Falling back to local URL:', window.location.origin);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
