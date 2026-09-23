import { useEffect } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { repository, supabase } from './lib/backend'
import Aktionsseite from './pages/Aktionsseite'
import Team from './pages/Team'

export const STUDIO = 'Studio Weitblick'

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const aktionsseite = pathname === '/'

  // Supabase leitet bei abgelaufenen oder schon benutzten Anmeldelinks mit #error=... auf die Startseite.
  // Dann gehört die Person in die Team-Anmeldung, mit einem verständlichen Hinweis.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const code = hash.get('error_code')
    if (!code) return
    const hinweis =
      code === 'otp_expired'
        ? 'Der Anmeldelink ist abgelaufen oder wurde schon benutzt. Fordere einfach einen neuen an.'
        : 'Die Anmeldung hat nicht geklappt. Bitte fordere einen neuen Anmeldelink an.'
    navigate('/team', { replace: true, state: { hinweis } })
  }, [navigate])
  // Die Aktionsseite läuft im dunklen Studio-Look, die Team-Ansicht bleibt hell und ruhig.
  useEffect(() => {
    document.body.classList.toggle('studio-dunkel', aktionsseite)
  }, [aktionsseite])
  return (
    <div className="huelle">
      <header className="kopf">
        <Link to="/" className="marke">
          Studio <span>Weitblick</span>
        </Link>
        <span className="demo-hinweis">Fiktives Demo-Studio</span>
      </header>
      <Routes>
        <Route path="/" element={<Aktionsseite repo={repository} />} />
        <Route path="/team" element={<Team repo={repository} supabase={supabase} />} />
      </Routes>
      <footer className="fuss">
        <span>Prototyp von Diana Duquenoy. Studio und Angebot sind erfunden. Fotos: echte Aufnahmen, Hintergrund mit KI bearbeitet.</span>
        <Link to="/team">Team-Ansicht</Link>
      </footer>
    </div>
  )
}
