import type { Analyse } from '../../supabase/functions/_shared/analysis'
import type { Anfrage, Lead, Status } from './lead'
import type { LeadRepository } from './repository'

const SCHLUESSEL = 'probetraining-lotse:demo-leads'

function lesen(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '[]') as Lead[]
  } catch {
    return []
  }
}

function schreiben(leads: Lead[]) {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(leads))
  } catch {
    // Privater Modus o. ä.: Demo läuft dann nur bis zum Neuladen.
  }
}

/** Regelbasierte Platzhalter-Analyse, damit die Demo ohne API-Key vollständig durchklickbar ist. */
export function demoAnalyse(a: Anfrage): Analyse {
  const vorname = a.name.split(' ')[0]
  const abends = a.zeiten.includes('Mo-Fr abends')
  return {
    zusammenfassung: `${a.name} möchte ein Probetraining mit dem Ziel „${a.ziel}“.${a.nachricht ? ' Hat eine Nachricht hinterlassen.' : ''}`,
    ziel: a.ziel,
    wunschzeit: a.zeiten.join(', '),
    dringlichkeit: a.telefon ? 'hoch' : 'mittel',
    antwortentwurf:
      `Hallo ${vorname}, danke für deine Anfrage! Schön, dass du bei uns reinschnuppern willst. ` +
      `Für dein Ziel „${a.ziel}“ nehmen wir uns beim Probetraining Zeit für ein kurzes Gespräch und zeigen dir die passenden Geräte. ` +
      `${abends ? 'Abends ist bei uns etwas mehr los, wir planen dich trotzdem so ein, dass du in Ruhe starten kannst. ' : ''}` +
      `Wir melden uns in den nächsten Tagen mit einem konkreten Terminvorschlag. Bis bald im Studio!`,
  }
}

export function erstelleDemoRepository(): LeadRepository {
  return {
    modus: 'demo',
    async speichern(id: string, anfrage: Anfrage) {
      const lead: Lead = {
        ...anfrage,
        id,
        erstelltAm: new Date().toISOString(),
        status: 'neu',
        kiStatus: 'ausstehend',
        analyse: null,
        kiFehler: null,
      }
      schreiben([lead, ...lesen()])
    },
    async analysieren(id: string) {
      const leads = lesen()
      const lead = leads.find((l) => l.id === id)
      if (!lead) throw new Error('Anfrage nicht gefunden')
      await new Promise((r) => setTimeout(r, 600))
      lead.analyse = demoAnalyse(lead)
      lead.kiStatus = 'fertig'
      schreiben(leads)
    },
    async liste() {
      return lesen()
    },
    async statusSetzen(id: string, status: Status) {
      schreiben(lesen().map((l) => (l.id === id ? { ...l, status } : l)))
    },
  }
}
