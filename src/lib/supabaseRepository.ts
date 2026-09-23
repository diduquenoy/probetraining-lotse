import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { parseAnalyse } from '../../supabase/functions/_shared/analysis'
import type { Anfrage, KiStatus, Lead, Status } from './lead'
import type { LeadRepository } from './repository'

interface LeadZeile {
  id: string
  created_at: string
  name: string
  email: string
  telefon: string | null
  ziel: Lead['ziel']
  zeiten: Lead['zeiten']
  nachricht: string | null
  einwilligung: boolean
  status: Status
  ki_status: KiStatus
  ki_analyse: unknown
  ki_fehler: string | null
}

function zuLead(z: LeadZeile): Lead {
  return {
    id: z.id,
    erstelltAm: z.created_at,
    name: z.name,
    email: z.email,
    telefon: z.telefon ?? '',
    ziel: z.ziel,
    zeiten: z.zeiten,
    nachricht: z.nachricht ?? '',
    einwilligung: true,
    status: z.status,
    kiStatus: z.ki_status,
    analyse: parseAnalyse(z.ki_analyse),
    kiFehler: z.ki_fehler,
  }
}

export function erstelleSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey)
}

export function erstelleSupabaseRepository(supabase: SupabaseClient): LeadRepository {
  return {
    modus: 'supabase',
    async speichern(id: string, a: Anfrage) {
      // Kein .select() danach: Besucher dürfen einfügen, aber nichts lesen (siehe RLS).
      const { error } = await supabase.from('leads').insert({
        id,
        name: a.name,
        email: a.email,
        telefon: a.telefon || null,
        ziel: a.ziel,
        zeiten: a.zeiten,
        nachricht: a.nachricht || null,
        einwilligung: a.einwilligung,
      })
      if (error) throw error
    },
    async analysieren(id: string) {
      const { data, error } = await supabase.functions.invoke('analyze-lead', { body: { id } })
      if (error) throw error
      if (!data?.ok) throw new Error(data?.fehler ?? 'Analyse fehlgeschlagen')
    },
    async liste() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data as LeadZeile[]).map(zuLead)
    },
    async statusSetzen(id: string, status: Status) {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id)
      if (error) throw error
    },
  }
}
