import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';
import '@/styles/admin.css';
import App from './App';

const raiz = document.getElementById('root');
if (!raiz) throw new Error('No se encontró el elemento #root en index.html');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
