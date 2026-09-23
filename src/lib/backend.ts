import type { SupabaseClient } from '@supabase/supabase-js'
import { erstelleDemoRepository } from './demoRepository'
import type { LeadRepository } from './repository'
import { erstelleSupabaseClient, erstelleSupabaseRepository } from './supabaseRepository'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Ohne Supabase-Zugang läuft die App im Demo-Modus, komplett im Browser. */
export const supabase: SupabaseClient | null = url && anonKey ? erstelleSupabaseClient(url, anonKey) : null

export const repository: LeadRepository = supabase
  ? erstelleSupabaseRepository(supabase)
  : erstelleDemoRepository()
