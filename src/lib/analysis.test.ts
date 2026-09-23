import { describe, expect, it } from 'vitest'
import { parseAnalyse } from '../../supabase/functions/_shared/analysis'

const gueltig = {
  zusammenfassung: 'Anna möchte nach einer Pause wieder einsteigen.',
  ziel: 'Rücken & Gesundheit',
  wunschzeit: 'unter der Woche abends',
  dringlichkeit: 'mittel',
  antwortentwurf: 'Hallo Anna, schön, dass du wieder einsteigen willst. Wir melden uns mit einem Terminvorschlag.',
}

describe('parseAnalyse', () => {
  it('nimmt eine vollständige Modellantwort an, auch als JSON-Text', () => {
    expect(parseAnalyse(gueltig)).toEqual(gueltig)
    expect(parseAnalyse(JSON.stringify(gueltig))?.ziel).toBe('Rücken & Gesundheit')
  })

  it('lehnt kaputtes JSON, fehlende Felder und unbekannte Werte ab', () => {
    expect(parseAnalyse('{"zusammenfassung": ')).toBeNull()
    expect(parseAnalyse({ ...gueltig, antwortentwurf: '' })).toBeNull()
    expect(parseAnalyse({ ...gueltig, ziel: 'Marathon' })).toBeNull()
    expect(parseAnalyse({ ...gueltig, dringlichkeit: 'sofort' })).toBeNull()
    expect(parseAnalyse(null)).toBeNull()
  })
})
