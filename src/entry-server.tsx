import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

/** Rendert eine Route zu HTML, damit Crawler, KI-Abrufe und Link-Vorschauen den Inhalt ohne JavaScript sehen. */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename="/lotse">
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
