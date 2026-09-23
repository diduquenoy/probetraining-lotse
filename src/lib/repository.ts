import type { Anfrage, Lead, Status } from './lead'

/**
 * Alles, was die Oberfläche von der Datenhaltung braucht.
 * Zwei Umsetzungen: Supabase (echt) und Demo (lokal im Browser, ohne Konto).
 */
export interface LeadRepository {
  readonly modus: 'supabase' | 'demo'
  /** Speichert die Anfrage. Wirft nur, wenn das Speichern selbst scheitert. */
  speichern(id: string, anfrage: Anfrage): Promise<void>
  /** Stößt die KI-Analyse an. Darf scheitern, ohne dass die Anfrage verloren geht. */
  analysieren(id: string): Promise<void>
  liste(): Promise<Lead[]>
  statusSetzen(id: string, status: Status): Promise<void>
}

export type Einreichung =
  | { gespeichert: true; analyse: 'fertig' | 'fehlgeschlagen' }
  | { gespeichert: false; fehler: string }

/**
 * Reihenfolge ist Absicht: erst speichern, dann analysieren.
 * Fällt die KI aus, ist die Anfrage trotzdem da und das Studio kann sie von Hand bearbeiten.
 */
export async function anfrageEinreichen(
  repo: LeadRepository,
  anfrage: Anfrage,
  neueId: () => string = () => crypto.randomUUID(),
): Promise<Einreichung> {
  const id = neueId()
  try {
    await repo.speichern(id, anfrage)
  } catch (e) {
    console.error('Speichern fehlgeschlagen', e)
    return { gespeichert: false, fehler: 'Deine Anfrage konnte gerade nicht gesendet werden. Bitte versuch es gleich noch einmal.' }
  }
  try {
    await repo.analysieren(id)
    return { gespeichert: true, analyse: 'fertig' }
  } catch (e) {
    console.warn('KI-Analyse fehlgeschlagen, Anfrage bleibt gespeichert', e)
    return { gespeichert: true, analyse: 'fehlgeschlagen' }
  }
}
