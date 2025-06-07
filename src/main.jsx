import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './service-worker';

createRoot(document.getElementById('root')).render(<App />);
