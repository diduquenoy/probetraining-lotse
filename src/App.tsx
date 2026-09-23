import { Link, Route, Routes } from 'react-router-dom'
import { repository, supabase } from './lib/backend'
import Aktionsseite from './pages/Aktionsseite'
import Team from './pages/Team'

export const STUDIO = 'Studio Weitblick'

export default function App() {
  return (
    <div className="huelle">
      <header className="kopf">
        <Link to="/" className="marke">
          {STUDIO}
        </Link>
        <span className="demo-hinweis">Fiktives Demo-Studio</span>
      </header>
      <Routes>
        <Route path="/" element={<Aktionsseite repo={repository} />} />
        <Route path="/team" element={<Team repo={repository} supabase={supabase} />} />
      </Routes>
      <footer className="fuss">
        <span>Prototyp von Diana Duquenoy. Studio, Angebot und Personen sind erfunden.</span>
        <Link to="/team">Team-Ansicht</Link>
      </footer>
    </div>
  )
}
