import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('zeigt bei einem abgelaufenen Anmeldelink einen verständlichen Hinweis statt still auf der Startseite zu landen', async () => {
    window.location.hash = '#error=access_denied&error_code=otp_expired'
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    // Mit Supabase-Zugang erscheint die Team-Anmeldung mit Hinweis, im Demo-Modus direkt die Anfragenliste.
    const ueberschrift = await screen.findByRole('heading', { name: /Team-Anmeldung|Anfragen/ })
    if (ueberschrift.textContent === 'Team-Anmeldung') {
      expect(screen.getByText(/Anmeldelink ist abgelaufen/)).toBeInTheDocument()
    }
    expect(screen.queryByText(/Dein erstes Training/)).not.toBeInTheDocument()
    window.location.hash = ''
  })
})
