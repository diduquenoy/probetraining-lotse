import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { pruefeAnfrage, ZEITFENSTER, ZIELE, type AnfrageEingabe, type Feldfehler } from '../lib/lead'
import { anfrageEinreichen, type Einreichung, type LeadRepository } from '../lib/repository'

type Erfolg = Extract<Einreichung, { gespeichert: true }>

const LEER: AnfrageEingabe = {
  name: '',
  email: '',
  telefon: '',
  ziel: '' as AnfrageEingabe['ziel'],
  zeiten: [],
  nachricht: '',
  einwilligung: false as unknown as true,
}

export default function AnfrageFormular({
  repo,
  onErfolg,
}: {
  repo: LeadRepository
  onErfolg: (e: Erfolg) => void
}) {
  const [werte, setWerte] = useState<AnfrageEingabe>(LEER)
  const [fehler, setFehler] = useState<Feldfehler>({})
  const [sendet, setSendet] = useState(false)
  const [sendefehler, setSendefehler] = useState<string | null>(null)
  const [honig, setHonig] = useState('')

  function setze<K extends keyof AnfrageEingabe>(feld: K, wert: AnfrageEingabe[K]) {
    setWerte((w) => ({ ...w, [feld]: wert }))
    if (fehler[feld]) setFehler((f) => ({ ...f, [feld]: undefined }))
  }

  function zeitUmschalten(zeit: (typeof ZEITFENSTER)[number]) {
    const aktuell = werte.zeiten
    setze('zeiten', aktuell.includes(zeit) ? aktuell.filter((z) => z !== zeit) : [...aktuell, zeit])
  }

  async function absenden(e: FormEvent) {
    e.preventDefault()
    setSendefehler(null)
    // Bots füllen das versteckte Feld aus. Wir tun so, als hätte alles geklappt.
    if (honig) {
      onErfolg({ gespeichert: true, analyse: 'fertig' })
      return
    }
    const pruefung = pruefeAnfrage(werte)
    if (!pruefung.ok) {
      setFehler(pruefung.fehler)
      const erstes = Object.keys(pruefung.fehler)[0]
      document.getElementById(`feld-${erstes}`)?.focus()
      return
    }
    setSendet(true)
    const ergebnis = await anfrageEinreichen(repo, pruefung.daten)
    setSendet(false)
    if (ergebnis.gespeichert) {
      setWerte(LEER)
      onErfolg(ergebnis)
    } else {
      setSendefehler(ergebnis.fehler)
    }
  }

  return (
    <form className="formular" onSubmit={absenden} noValidate aria-busy={sendet}>
      <h2>Probetraining anfragen</h2>
      <p className="formular-hinweis">
        Felder ohne „(optional)“ brauchen wir, damit wir dir antworten können. Demo-Studio: Erfundene Angaben sind
        völlig in Ordnung.
      </p>

      <div className="feld" data-fehler={!!fehler.name}>
        <label htmlFor="feld-name">Name</label>
        <input
          id="feld-name"
          autoComplete="name"
          value={werte.name}
          onChange={(e) => setze('name', e.target.value)}
          aria-invalid={!!fehler.name}
          aria-describedby={fehler.name ? 'fehler-name' : undefined}
        />
        {fehler.name && <span id="fehler-name" className="fehlertext">{fehler.name}</span>}
      </div>

      <div className="feld" data-fehler={!!fehler.email}>
        <label htmlFor="feld-email">E-Mail</label>
        <input
          id="feld-email"
          type="email"
          autoComplete="email"
          value={werte.email}
          onChange={(e) => setze('email', e.target.value)}
          aria-invalid={!!fehler.email}
          aria-describedby={fehler.email ? 'fehler-email' : undefined}
        />
        {fehler.email && <span id="fehler-email" className="fehlertext">{fehler.email}</span>}
      </div>

      <div className="feld" data-fehler={!!fehler.telefon}>
        <label htmlFor="feld-telefon">
          Telefon <span className="optional">(optional, für eine schnellere Rückmeldung)</span>
        </label>
        <input
          id="feld-telefon"
          type="tel"
          autoComplete="tel"
          value={werte.telefon}
          onChange={(e) => setze('telefon', e.target.value)}
          aria-invalid={!!fehler.telefon}
          aria-describedby={fehler.telefon ? 'fehler-telefon' : undefined}
        />
        {fehler.telefon && <span id="fehler-telefon" className="fehlertext">{fehler.telefon}</span>}
      </div>

      <div className="feld" data-fehler={!!fehler.ziel}>
        <label htmlFor="feld-ziel">Was willst du erreichen?</label>
        <select
          id="feld-ziel"
          value={werte.ziel}
          onChange={(e) => setze('ziel', e.target.value as AnfrageEingabe['ziel'])}
          aria-invalid={!!fehler.ziel}
          aria-describedby={fehler.ziel ? 'fehler-ziel' : undefined}
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          {ZIELE.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        {fehler.ziel && <span id="fehler-ziel" className="fehlertext">{fehler.ziel}</span>}
      </div>

      <fieldset className="feld" aria-describedby={fehler.zeiten ? 'fehler-zeiten' : undefined}>
        <legend>Wann passt es dir meistens?</legend>
        <div className="kacheln">
          {ZEITFENSTER.map((z, i) => (
            <label key={z} className="kachel">
              <input
                id={i === 0 ? 'feld-zeiten' : undefined}
                type="checkbox"
                checked={werte.zeiten.includes(z)}
                onChange={() => zeitUmschalten(z)}
              />
              <span>{z}</span>
            </label>
          ))}
        </div>
        {fehler.zeiten && <span id="fehler-zeiten" className="fehlertext">{fehler.zeiten}</span>}
      </fieldset>

      <div className="feld" data-fehler={!!fehler.nachricht}>
        <label htmlFor="feld-nachricht">
          Möchtest du uns noch etwas sagen? <span className="optional">(optional)</span>
        </label>
        <textarea
          id="feld-nachricht"
          value={werte.nachricht}
          onChange={(e) => setze('nachricht', e.target.value)}
          placeholder="z. B. lange Pause, Wunschtag, Fragen zum Kursplan"
          maxLength={600}
          aria-invalid={!!fehler.nachricht}
          aria-describedby={fehler.nachricht ? 'fehler-nachricht' : undefined}
        />
        <span className="zaehler" aria-live="polite">
          {(werte.nachricht ?? '').length} / 600 Zeichen. Gesundheitsangaben besprechen wir bitte beim Probetraining.
        </span>
        {fehler.nachricht && <span id="fehler-nachricht" className="fehlertext">{fehler.nachricht}</span>}
      </div>

      <div className="honigtopf" aria-hidden="true">
        <label htmlFor="feld-website">Website</label>
        <input id="feld-website" tabIndex={-1} autoComplete="off" value={honig} onChange={(e) => setHonig(e.target.value)} />
      </div>

      <div>
        <label className="einwilligung">
          <input
            id="feld-einwilligung"
            type="checkbox"
            checked={werte.einwilligung as boolean}
            onChange={(e) => setze('einwilligung', e.target.checked as true)}
            aria-invalid={!!fehler.einwilligung}
            aria-describedby={fehler.einwilligung ? 'fehler-einwilligung' : undefined}
          />
          <span>
            Ich bin einverstanden, dass das Studio mich zu meiner Anfrage kontaktiert. Ein KI-Assistent bereitet die
            Antwort vor, ein Mensch prüft und verschickt sie. Mehr dazu im{' '}
            <Link to="/datenschutz">Datenschutzhinweis</Link>.
          </span>
        </label>
        {fehler.einwilligung && (
          <span id="fehler-einwilligung" className="fehlertext">
            {fehler.einwilligung}
          </span>
        )}
      </div>

      {sendefehler && (
        <div className="meldung fehler" role="alert">
          {sendefehler}
        </div>
      )}

      <button type="submit" className="knopf akzent" disabled={sendet}>
        {sendet ? 'Wird gesendet …' : 'Probetraining anfragen'}
      </button>
    </form>
  )
}
