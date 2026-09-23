import { describe, expect, it, vi } from 'vitest'
import type { Anfrage } from './lead'
import { anfrageEinreichen, type LeadRepository } from './repository'

const anfrage: Anfrage = {
  name: 'Anna Beispiel',
  email: 'anna@example.org',
  telefon: '',
  ziel: 'Abnehmen',
  zeiten: ['Wochenende'],
  nachricht: '',
  einwilligung: true,
}

function repo(ueberschreiben: Partial<LeadRepository>): LeadRepository {
  return {
    modus: 'demo',
    speichern: vi.fn().mockResolvedValue(undefined),
    analysieren: vi.fn().mockResolvedValue(undefined),
    liste: vi.fn().mockResolvedValue([]),
    statusSetzen: vi.fn().mockResolvedValue(undefined),
    ...ueberschreiben,
  }
}

vi.spyOn(console, 'warn').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

describe('anfrageEinreichen', () => {
  it('behält die Anfrage, wenn die KI ausfällt', async () => {
    const r = repo({ analysieren: vi.fn().mockRejectedValue(new Error('KI nicht erreichbar')) })
    const ergebnis = await anfrageEinreichen(r, anfrage, () => 'id-1')
    expect(r.speichern).toHaveBeenCalledWith('id-1', anfrage)
    expect(ergebnis).toEqual({ gespeichert: true, analyse: 'fehlgeschlagen' })
  })

  it('ruft die KI gar nicht erst auf, wenn das Speichern scheitert', async () => {
    const r = repo({ speichern: vi.fn().mockRejectedValue(new Error('offline')) })
    const ergebnis = await anfrageEinreichen(r, anfrage, () => 'id-2')
    expect(r.analysieren).not.toHaveBeenCalled()
    expect(ergebnis.gespeichert).toBe(false)
  })
})
