import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Initialize error capture for production debugging
import '@/lib/errorCapture';

// Register service worker for caching and offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Service worker registered successfully
      })
      .catch((registrationError) => {
        // Service worker registration failed - this is expected in development
        if (import.meta.env.DEV) {
          console.warn('Service worker registration failed (expected in development):', registrationError);
        }
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)
