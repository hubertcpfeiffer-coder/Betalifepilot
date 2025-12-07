import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupGlobalErrorHandler, initSentry } from './lib/errorTracking'

// Initialize error tracking
setupGlobalErrorHandler();
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
