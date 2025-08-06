import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
// import AppClean from './AppClean.tsx'; // Version sans onboarding
import './index.css';
import './styles/no-blur.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
