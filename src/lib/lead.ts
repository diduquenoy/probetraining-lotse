import { z } from 'zod'
import { ZIELE, type Analyse } from '../../supabase/functions/_shared/analysis'

export { ZIELE }

export const ZEITFENSTER = [
  'Mo-Fr morgens',
  'Mo-Fr mittags',
  'Mo-Fr abends',
  'Wochenende',
] as const

export const STATUS = ['neu', 'kontaktiert', 'termin'] as const
export type Status = (typeof STATUS)[number]

export const STATUS_LABEL: Record<Status, string> = {
  neu: 'Neu',
  kontaktiert: 'Kontaktiert',
  termin: 'Termin steht',
}

export type KiStatus = 'ausstehend' | 'fertig' | 'fehlgeschlagen'

export const anfrageSchema = z.object({
  name: z.string().trim().min(2, 'Bitte gib deinen Namen an.').max(80, 'Der Name ist zu lang.'),
  email: z.string().trim().email('Bitte prüf deine E-Mail-Adresse.'),
  telefon: z
    .string()
    .trim()
    .max(30, 'Die Nummer ist zu lang.')
    .regex(/^[0-9+()\s/-]*$/, 'Bitte nur Ziffern und + ( ) / - verwenden.')
    .optional()
    .or(z.literal('')),
  ziel: z.enum(ZIELE, { error: 'Bitte wähl ein Ziel.' }),
  zeiten: z.array(z.enum(ZEITFENSTER)).min(1, 'Wähl mindestens ein Zeitfenster.'),
  nachricht: z.string().trim().max(600, 'Bitte fass dich etwas kürzer (max. 600 Zeichen).').optional().or(z.literal('')),
  einwilligung: z.literal(true, { error: 'Wir brauchen deine Einwilligung, um dich zu kontaktieren.' }),
})

export type AnfrageEingabe = z.input<typeof anfrageSchema>
export type Anfrage = z.output<typeof anfrageSchema>

export type Feldfehler = Partial<Record<keyof AnfrageEingabe, string>>

export function pruefeAnfrage(
  eingabe: AnfrageEingabe,
): { ok: true; daten: Anfrage } | { ok: false; fehler: Feldfehler } {
  const ergebnis = anfrageSchema.safeParse(eingabe)
  if (ergebnis.success) return { ok: true, daten: ergebnis.data }
  const fehler: Feldfehler = {}
  for (const issue of ergebnis.error.issues) {
    const feld = issue.path[0] as keyof AnfrageEingabe
    if (feld && !fehler[feld]) fehler[feld] = issue.message
  }
  return { ok: false, fehler }
}

export interface Lead extends Anfrage {
  id: string
  erstelltAm: string
  status: Status
  kiStatus: KiStatus
  analyse: Analyse | null
  kiFehler: string | null
}
