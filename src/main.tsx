import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize error capture for production debugging
import '@/lib/errorCapture';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
