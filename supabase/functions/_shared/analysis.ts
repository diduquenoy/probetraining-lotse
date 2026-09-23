// Gemeinsam genutzt von der Edge Function (Deno) und dem Frontend (Vite).
// Bewusst ohne Abhängigkeiten, damit dieselbe Datei in beiden Laufzeiten läuft.

export const ZIELE = [
  'Abnehmen',
  'Muskelaufbau',
  'Rücken & Gesundheit',
  'Fitter werden',
  'Noch unklar',
] as const
export type Ziel = (typeof ZIELE)[number]

export const DRINGLICHKEITEN = ['hoch', 'mittel', 'niedrig'] as const
export type Dringlichkeit = (typeof DRINGLICHKEITEN)[number]

export interface Analyse {
  zusammenfassung: string
  ziel: Ziel
  wunschzeit: string
  dringlichkeit: Dringlichkeit
  antwortentwurf: string
}

/** JSON-Schema für die strukturierte Ausgabe des Modells (output_config.format). */
export const ANALYSE_SCHEMA = {
  type: 'object',
  properties: {
    zusammenfassung: {
      type: 'string',
      description: 'Ein bis zwei Sätze: Wer fragt an und was ist das Anliegen?',
    },
    ziel: { type: 'string', enum: [...ZIELE] },
    wunschzeit: {
      type: 'string',
      description: 'Wann die Person trainieren möchte, in Alltagssprache.',
    },
    dringlichkeit: {
      type: 'string',
      enum: [...DRINGLICHKEITEN],
      description: 'Wie schnell sich das Studio melden sollte.',
    },
    antwortentwurf: {
      type: 'string',
      description: 'Antwort an die Person in Du-Form, 60 bis 110 Wörter, ohne Preise und ohne Terminzusage.',
    },
  },
  required: ['zusammenfassung', 'ziel', 'wunschzeit', 'dringlichkeit', 'antwortentwurf'],
  additionalProperties: false,
} as const

function istText(wert: unknown, min = 1): wert is string {
  return typeof wert === 'string' && wert.trim().length >= min
}

/**
 * Prüft eine Modellantwort, bevor sie gespeichert wird.
 * Gibt null zurück, wenn etwas fehlt oder nicht passt. Dann gilt die Analyse als fehlgeschlagen,
 * die Anfrage selbst bleibt aber gespeichert.
 */
export function parseAnalyse(roh: unknown): Analyse | null {
  let daten = roh
  if (typeof roh === 'string') {
    try {
      daten = JSON.parse(roh)
    } catch {
      return null
    }
  }
  if (typeof daten !== 'object' || daten === null) return null
  const d = daten as Record<string, unknown>

  if (!istText(d.zusammenfassung) || !istText(d.wunschzeit) || !istText(d.antwortentwurf, 20)) {
    return null
  }
  if (!ZIELE.includes(d.ziel as Ziel)) return null
  if (!DRINGLICHKEITEN.includes(d.dringlichkeit as Dringlichkeit)) return null

  return {
    zusammenfassung: d.zusammenfassung.trim(),
    ziel: d.ziel as Ziel,
    wunschzeit: d.wunschzeit.trim(),
    dringlichkeit: d.dringlichkeit as Dringlichkeit,
    antwortentwurf: d.antwortentwurf.trim(),
  }
}
