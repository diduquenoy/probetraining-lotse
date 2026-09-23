import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import LeadKarte from '../components/LeadKarte'
import { STATUS, STATUS_LABEL, type Lead, type Status } from '../lib/lead'
import type { LeadRepository } from '../lib/repository'

type Filter = Status | 'alle'

export default function Team({ repo, supabase }: { repo: LeadRepository; supabase: SupabaseClient | null }) {
  const [session, setSession] = useState<Session | null>(null)
  const [bereit, setBereit] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setBereit(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [supabase])

  if (!bereit) return null
  if (supabase && !session) return <Anmeldung supabase={supabase} />
  return <Anfragen repo={repo} onAbmelden={supabase ? () => supabase.auth.signOut() : undefined} />
}

function Anmeldung({ supabase }: { supabase: SupabaseClient }) {
  const hinweis = (useLocation().state as { hinweis?: string } | null)?.hinweis
  const [email, setEmail] = useState('')
  const [zustand, setZustand] = useState<'offen' | 'gesendet' | 'fehler'>('offen')

  async function senden(e: FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // Nur bereits angelegte Team-Mitglieder dürfen sich anmelden.
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}team` },
    })
    setZustand(error ? 'fehler' : 'gesendet')
  }

  return (
    <main className="team">
      <div className="karte" style={{ maxWidth: 440 }}>
        <form className="formular" onSubmit={senden}>
          <h1 style={{ fontSize: '1.6rem' }}>Team-Anmeldung</h1>
          {hinweis && zustand === 'offen' && (
            <p className="meldung info" role="status">
              {hinweis}
            </p>
          )}
          {zustand === 'gesendet' ? (
            <p className="meldung info">Schau in dein Postfach, der Anmeldelink ist unterwegs.</p>
          ) : (
            <>
              <div className="feld">
                <label htmlFor="team-email">E-Mail</label>
                <input id="team-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {zustand === 'fehler' && (
                <p className="meldung fehler" role="alert">
                  Das hat nicht geklappt. Ist die Adresse als Team-Mitglied angelegt?
                </p>
              )}
              <button className="knopf" type="submit">
                Anmeldelink senden
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  )
}

function Anfragen({ repo, onAbmelden }: { repo: LeadRepository; onAbmelden?: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [filter, setFilter] = useState<Filter>('alle')
  const [fehler, setFehler] = useState<string | null>(null)

  const laden = useCallback(async () => {
    try {
      setLeads(await repo.liste())
      setFehler(null)
    } catch (e) {
      console.error(e)
      setFehler('Die Anfragen konnten nicht geladen werden.')
    }
  }, [repo])

  useEffect(() => {
    let aktiv = true
    repo
      .liste()
      .then((l) => aktiv && setLeads(l))
      .catch((e) => {
        console.error(e)
        if (aktiv) setFehler('Die Anfragen konnten nicht geladen werden.')
      })
    return () => {
      aktiv = false
    }
  }, [repo])

  async function statusSetzen(id: string, status: Status) {
    setLeads((l) => l?.map((x) => (x.id === id ? { ...x, status } : x)) ?? null)
    try {
      await repo.statusSetzen(id, status)
    } catch {
      setFehler('Der Status konnte nicht gespeichert werden.')
      laden()
    }
  }

  async function neuAnalysieren(id: string) {
    try {
      await repo.analysieren(id)
    } catch {
      setFehler('Die KI ist gerade nicht erreichbar. Bitte später erneut versuchen.')
    }
    await laden()
  }

  const sichtbar = leads?.filter((l) => filter === 'alle' || l.status === filter) ?? []
  const anzahl = (f: Filter) => leads?.filter((l) => f === 'alle' || l.status === f).length ?? 0

  return (
    <main className="team">
      <div className="team-kopf">
        <div>
          <h1>Anfragen</h1>
          {repo.modus === 'demo' && (
            <p className="lead-meta" style={{ margin: '6px 0 0' }}>
              Demo-Modus: Daten liegen nur in diesem Browser, die KI-Vorbereitung ist simuliert.
            </p>
          )}
        </div>
        <div className="filter" role="group" aria-label="Nach Status filtern">
          {(['alle', ...STATUS] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className="knopf zweitrangig klein"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === 'alle' ? 'Alle' : STATUS_LABEL[f]} ({anzahl(f)})
            </button>
          ))}
          {onAbmelden && (
            <button type="button" className="knopf zweitrangig klein" onClick={onAbmelden}>
              Abmelden
            </button>
          )}
        </div>
      </div>

      {fehler && (
        <p className="meldung fehler" role="alert">
          {fehler}
        </p>
      )}

      {leads === null ? (
        <p className="leer">Lädt …</p>
      ) : sichtbar.length === 0 ? (
        <p className="leer">Hier ist gerade nichts. Neue Anfragen erscheinen automatisch nach dem Neuladen.</p>
      ) : (
        <div className="liste">
          {sichtbar.map((l) => (
            <LeadKarte
              key={l.id}
              lead={l}
              onStatus={(s) => statusSetzen(l.id, s)}
              onNeuAnalysieren={() => neuAnalysieren(l.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
