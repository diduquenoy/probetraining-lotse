// Supabase Edge Function: bereitet eine neue Anfrage mit Claude vor.
// Aufruf: POST { id } direkt nach dem Speichern (Besucher) oder über "Erneut versuchen" (Team).
import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { ANALYSE_SCHEMA, parseAnalyse } from '../_shared/analysis.ts'
import { anfrageAlsText, SYSTEM_PROMPT } from '../_shared/prompt.ts'

// Günstigstes aktuelles Modell: für Zusammenfassen und einen kurzen Entwurf reicht es.
const MODELL = 'claude-haiku-4-5'
const MAX_VERSUCHE = 5
const BESUCHER_FENSTER_MS = 10 * 60 * 1000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function antwort(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })
}

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY'), maxRetries: 2, timeout: 30_000 })

async function analysieren(text: string) {
  if (!Deno.env.get('ANTHROPIC_API_KEY')) throw new Error('API-Schlüssel für die KI fehlt')
  const res = await anthropic.messages.create({
    model: MODELL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }],
    output_config: { format: { type: 'json_schema', schema: ANALYSE_SCHEMA } },
  })
  if (res.stop_reason === 'refusal') throw new Error('Modell hat die Anfrage abgelehnt')
  if (res.stop_reason === 'max_tokens') throw new Error('Antwort abgeschnitten')
  const block = res.content.find((b) => b.type === 'text')
  const analyse = parseAnalyse(block?.type === 'text' ? block.text : null)
  if (!analyse) throw new Error('Antwort entsprach nicht dem Schema')
  return analyse
}

function fehlerKurz(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'API-Schlüssel ungültig'
  if (e instanceof Anthropic.RateLimitError) return 'Zu viele Anfragen an die KI, später erneut versuchen'
  if (e instanceof Anthropic.APIConnectionError) return 'KI nicht erreichbar'
  if (e instanceof Anthropic.APIError) return `KI-Fehler (${e.status ?? 'unbekannt'})`
  return e instanceof Error ? e.message : 'Unbekannter Fehler'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return antwort({ ok: false, fehler: 'Nur POST' }, 405)

  let id: unknown
  try {
    id = (await req.json())?.id
  } catch {
    return antwort({ ok: false, fehler: 'Ungültiger Aufruf' }, 400)
  }
  if (typeof id !== 'string' || !UUID.test(id)) return antwort({ ok: false, fehler: 'Ungültige ID' }, 400)

  const url = Deno.env.get('SUPABASE_URL')!
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Ist der Aufrufer ein angemeldetes Team-Mitglied? Dann darf er eine Analyse wiederholen.
  const nutzerClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  })
  const { data: nutzer } = await nutzerClient.auth.getUser()
  const istTeam = !!nutzer?.user

  const { data: lead, error } = await admin
    .from('leads')
    .select('id, created_at, name, ziel, zeiten, nachricht, telefon, ki_status, ki_versuche')
    .eq('id', id)
    .maybeSingle()
  if (error) return antwort({ ok: false, fehler: 'Datenbankfehler' }, 500)
  if (!lead) return antwort({ ok: false, fehler: 'Anfrage nicht gefunden' }, 404)

  // Besucher dürfen nur ihre eigene, gerade gespeicherte Anfrage einmal analysieren lassen.
  // So kann niemand über fremde IDs beliebig oft KI-Kosten auslösen.
  const frisch = Date.now() - new Date(lead.created_at).getTime() < BESUCHER_FENSTER_MS
  const erlaubt = istTeam
    ? lead.ki_versuche < MAX_VERSUCHE
    : lead.ki_status === 'ausstehend' && lead.ki_versuche === 0 && frisch
  if (!erlaubt) return antwort({ ok: false, fehler: 'Analyse für diese Anfrage nicht (mehr) möglich' }, 403)

  // Versuch zuerst zählen, erst dann das Modell aufrufen. Die Bedingung auf den alten Zählerstand
  // verhindert, dass zwei gleichzeitige Aufrufe beide durchkommen.
  const { data: gezaehlt } = await admin
    .from('leads')
    .update({ ki_versuche: lead.ki_versuche + 1 })
    .eq('id', id)
    .eq('ki_versuche', lead.ki_versuche)
    .select('id')
  if (!gezaehlt?.length) return antwort({ ok: false, fehler: 'Analyse läuft bereits' }, 409)

  try {
    const analyse = await analysieren(anfrageAlsText(lead))
    await admin.from('leads').update({ ki_status: 'fertig', ki_analyse: analyse, ki_fehler: null }).eq('id', id)
    return antwort({ ok: true })
  } catch (e) {
    const fehler = fehlerKurz(e)
    console.error('Analyse fehlgeschlagen', id, fehler)
    await admin.from('leads').update({ ki_status: 'fehlgeschlagen', ki_fehler: fehler }).eq('id', id)
    // 200 mit ok:false: Die Anfrage ist gespeichert, nur die Vorbereitung fehlt.
    return antwort({ ok: false, fehler })
  }
})
