-- Anfragen für das Probetraining.
create table public.leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefon text check (telefon is null or char_length(telefon) <= 30),
  ziel text not null check (ziel in ('Abnehmen', 'Muskelaufbau', 'Rücken & Gesundheit', 'Fitter werden', 'Noch unklar')),
  zeiten text[] not null check (cardinality(zeiten) between 1 and 4),
  nachricht text check (nachricht is null or char_length(nachricht) <= 600),
  einwilligung boolean not null check (einwilligung),
  status text not null default 'neu' check (status in ('neu', 'kontaktiert', 'termin')),
  ki_status text not null default 'ausstehend' check (ki_status in ('ausstehend', 'fertig', 'fehlgeschlagen')),
  ki_analyse jsonb,
  ki_fehler text,
  ki_versuche int not null default 0
);

create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Besucher (anon) dürfen nur neue Anfragen anlegen, nichts lesen oder ändern.
-- Die KI-Felder und der Status bleiben dabei auf ihren Standardwerten.
create policy "Besucher legen Anfragen an"
  on public.leads for insert to anon
  with check (status = 'neu' and ki_status = 'ausstehend' and ki_analyse is null and ki_versuche = 0);

-- Angemeldete Team-Mitglieder sehen alle Anfragen und pflegen den Status.
-- Neue Team-Mitglieder werden nur im Supabase-Dashboard eingeladen (Selbstregistrierung ist aus).
create policy "Team liest Anfragen"
  on public.leads for select to authenticated
  using (true);

create policy "Team ändert Status"
  on public.leads for update to authenticated
  using (true)
  with check (true);

-- Das Team darf nur den Status ändern, nicht die Anfrage selbst oder die KI-Felder.
revoke update on public.leads from authenticated;
grant update (status) on public.leads to authenticated;
