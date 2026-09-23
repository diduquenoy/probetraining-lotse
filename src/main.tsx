import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/900.css'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Die Startseite kommt vorgerendert vom Server und wird nur "aufgeweckt".
// Andere Routen (z. B. /team) bekommen dasselbe HTML ausgeliefert und werden deshalb neu gerendert.
const istStartseite = window.location.pathname.replace(/\/$/, '') === import.meta.env.BASE_URL.replace(/\/$/, '')
if (root.hasChildNodes() && istStartseite && !window.location.hash.includes('error')) {
  hydrateRoot(root, app)
} else {
  root.innerHTML = ''
  createRoot(root).render(app)
}
