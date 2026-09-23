import { describe, expect, it } from 'vitest'
import { pruefeAnfrage, type AnfrageEingabe } from './lead'

const basis: AnfrageEingabe = {
  name: 'Anna Beispiel',
  email: 'anna@example.org',
  telefon: '',
  ziel: 'Fitter werden',
  zeiten: ['Mo-Fr abends'],
  nachricht: '',
  einwilligung: true,
}

describe('pruefeAnfrage', () => {
  it('akzeptiert eine vollständige Anfrage ohne optionale Felder', () => {
    expect(pruefeAnfrage(basis).ok).toBe(true)
  })

  it('meldet jedes fehlende Pflichtfeld mit einem verständlichen Text', () => {
    const ergebnis = pruefeAnfrage({
      ...basis,
      name: ' ',
      email: 'anna@',
      zeiten: [],
      einwilligung: false as unknown as true,
    })
    expect(ergebnis.ok).toBe(false)
    if (ergebnis.ok) return
    expect(Object.keys(ergebnis.fehler).sort()).toEqual(['einwilligung', 'email', 'name', 'zeiten'])
    expect(ergebnis.fehler.email).toBe('Bitte prüf deine E-Mail-Adresse.')
  })
})
