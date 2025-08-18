import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './index.css';
import './styles/mobile-fixes.css';

// Test déploiement OmniFit - 2025-08-15
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
