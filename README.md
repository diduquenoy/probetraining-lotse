# Probetraining-Lotse

Aktionsseite für ein fiktives Fitnessstudio. Interessierte fragen ein Probetraining an, eine KI bereitet jede Anfrage für das Team vor: kurze Zusammenfassung, Ziel, Wunschzeit, Dringlichkeit und ein Antwortentwurf. Ein Mensch prüft und verschickt, die KI versendet nichts selbst.

Prototyp von Diana Duquenoy. Studio, Angebot und Personen sind erfunden.

## Das Problem

Studios bekommen Probetraining-Anfragen über Aktionsseiten, oft abends und am Wochenende. Bis jemand antwortet, vergehen Tage, und jede Antwort wird von Hand formuliert. Der Lotse verkürzt das: Das Team sieht jede Anfrage schon aufbereitet und muss den Entwurf nur noch prüfen, anpassen und senden.

## Was die App macht

| Bereich | Was passiert |
|---|---|
| Aktionsseite `/` | Formular mit Name, E-Mail, Telefon (optional), Ziel, Zeitfenster, Nachricht, Einwilligung. Prüfung direkt im Browser mit verständlichen Fehlertexten. |
| Speichern | Anfrage landet in Supabase (Postgres). Besucher dürfen nur einfügen, nichts lesen. |
| KI-Vorbereitung | Supabase Edge Function ruft Claude Haiku 4.5 mit strukturierter Ausgabe (JSON-Schema) auf. Die Antwort wird vor dem Speichern noch einmal geprüft. |
| Team-Ansicht `/team` | Anmeldung per E-Mail-Link, Liste aller Anfragen, Filter nach Status (neu, kontaktiert, Termin steht), Entwurf kopieren, bei Fehlern „Erneut versuchen“. |
| Demo-Modus | Ohne Supabase-Zugang läuft alles im Browser, die KI-Vorbereitung ist dann regelbasiert simuliert. |

## Architektur

```
Browser (React + TypeScript, Vite)
  │ 1. insert  (RLS: anon darf nur einfügen)
  ▼
Supabase Postgres: Tabelle leads
  ▲ 3. Ergebnis speichern (Service Role)
  │
Edge Function analyze-lead  ◄── 2. Aufruf mit der ID der Anfrage
  │
  └─► Claude Haiku 4.5 (JSON-Schema-Ausgabe)
```

## Entscheidungen

- **Erst speichern, dann analysieren.** Fällt die KI aus, ist die Anfrage trotzdem da. Das Team sieht einen klaren Hinweis und kann die Analyse neu anstoßen. Der Besucher bekommt in jedem Fall seine Bestätigung.
- **Kostenschutz.** Besucher können die KI nur einmal pro Anfrage auslösen, und nur in den ersten 10 Minuten nach dem Speichern. Das Team hat maximal 5 Versuche pro Anfrage. Der Zähler wird vor dem Modellaufruf hochgesetzt, gleichzeitige Aufrufe blockieren sich gegenseitig.
- **Die KI schlägt vor, der Mensch entscheidet.** Kein automatischer Versand. Der Prompt verbietet Preise, feste Terminzusagen und medizinische Einschätzungen und behandelt den Inhalt der Anfrage als Daten, nicht als Anweisung.
- **Doppelte Prüfung der KI-Antwort.** Das Modell liefert per JSON-Schema, und `parseAnalyse` prüft das Ergebnis trotzdem noch einmal, bevor es in die Datenbank geht. Dieselbe Datei läuft in der Edge Function (Deno) und im Frontend.
- **Günstigstes passendes Modell.** Zusammenfassen und ein kurzer Entwurf brauchen kein großes Modell. Pro Anfrage fallen Bruchteile eines Cents an.
- **Datenschutz.** Schriften liegen lokal im Build, kein Google-Fonts-Aufruf. Die Einwilligung nennt die KI-Vorbereitung ausdrücklich. Selbstregistrierung ist aus, Team-Mitglieder werden eingeladen.
- **Schlanker Spamschutz.** Ein verstecktes Honeypot-Feld fängt einfache Bots ab. Für echten Betrieb käme ein Rate-Limit oder Captcha dazu.

## Tests

```bash
npm test
```

8 Tests in 4 Dateien:

- Prüfung der KI-Antwort: gültige Antwort, kaputtes JSON, fehlende Felder, unbekannte Werte
- Formularprüfung: vollständige Anfrage, jedes fehlende Pflichtfeld mit Fehlertext
- Ablauf: KI fällt aus, die Anfrage bleibt gespeichert; Speichern scheitert, die KI wird nicht aufgerufen
- Formular im Browser: Fehler statt Absenden, erfolgreiche Anfrage

## Lokal starten

```bash
npm install
npm run dev        # Demo-Modus, ohne Konten
```

Mit Supabase: `.env.example` nach `.env.local` kopieren und URL und Key eintragen.

## Einrichten mit Supabase

1. Projekt anlegen (Region EU).
2. Migration `supabase/migrations/20260923000000_leads.sql` im SQL-Editor ausführen.
3. Edge Function `analyze-lead` deployen und das Secret `ANTHROPIC_API_KEY` setzen.
4. Unter Authentication die Selbstregistrierung ausschalten und das Team per Einladung anlegen.
5. Unter Authentication > URL Configuration die Adresse der App als Site URL und Redirect URL `…/team` eintragen.

## Stack

React 19, TypeScript, Vite, React Router, Zod, Supabase (Postgres, Row Level Security, Auth, Edge Functions), Claude API (Haiku 4.5, Structured Outputs), Vitest und Testing Library, Hosting als statische Seite auf All-Inkl (Apache, .htaccess für die Routen).
