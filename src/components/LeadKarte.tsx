import { useState } from 'react'
import { STATUS, STATUS_LABEL, type Lead, type Status } from '../lib/lead'

const DATUM = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' })

export default function LeadKarte({
  lead,
  onStatus,
  onNeuAnalysieren,
}: {
  lead: Lead
  onStatus: (s: Status) => void
  onNeuAnalysieren: () => Promise<void>
}) {
  const [kopiert, setKopiert] = useState(false)
  const [analysiert, setAnalysiert] = useState(false)
  const a = lead.analyse

  async function kopieren() {
    if (!a) return
    try {
      await navigator.clipboard.writeText(a.antwortentwurf)
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2000)
    } catch {
      // Zwischenablage gesperrt: Text bleibt markierbar.
    }
  }

  async function neu() {
    setAnalysiert(true)
    await onNeuAnalysieren()
    setAnalysiert(false)
  }

  return (
    <article className="karte lead">
      <div className="lead-kopf">
        <div>
          <h2>{lead.name}</h2>
          <div className="lead-meta">
            {DATUM.format(new Date(lead.erstelltAm))} · <a href={`mailto:${lead.email}`}>{lead.email}</a>
            {lead.telefon && (
              <>
                {' '}
                · <a href={`tel:${lead.telefon}`}>{lead.telefon}</a>
              </>
            )}
          </div>
        </div>
        <div className="etiketten">
          <span className="etikett">{lead.ziel}</span>
          {a && <span className={`etikett ${a.dringlichkeit}`}>Dringlichkeit: {a.dringlichkeit}</span>}
        </div>
      </div>

      <div className="lead-meta">Zeitfenster: {lead.zeiten.join(', ')}</div>
      {lead.nachricht && <p style={{ margin: 0 }}>„{lead.nachricht}“</p>}

      <div className="ki">
        <span className="ki-label">KI-Vorbereitung</span>
        {lead.kiStatus === 'fertig' && a ? (
          <>
            <p style={{ margin: 0 }}>{a.zusammenfassung}</p>
            <div className="entwurf">{a.antwortentwurf}</div>
            <div>
              <button type="button" className="knopf zweitrangig klein" onClick={kopieren}>
                {kopiert ? 'Kopiert' : 'Entwurf kopieren'}
              </button>
            </div>
          </>
        ) : lead.kiStatus === 'ausstehend' ? (
          <p className="lead-meta" style={{ margin: 0 }}>
            Wird vorbereitet …
          </p>
        ) : (
          <div className="meldung fehler" role="status">
            Die KI konnte diese Anfrage nicht vorbereiten. Die Anfrage ist trotzdem vollständig gespeichert.{' '}
            <button type="button" className="knopf zweitrangig klein" onClick={neu} disabled={analysiert}>
              {analysiert ? 'Läuft …' : 'Erneut versuchen'}
            </button>
          </div>
        )}
      </div>

      <div className="status-wahl" role="group" aria-label={`Status für ${lead.name}`}>
        {STATUS.map((s) => (
          <button
            key={s}
            type="button"
            className="knopf zweitrangig klein"
            aria-pressed={lead.status === s}
            onClick={() => onStatus(s)}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </article>
  )
}
