import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AnfrageFormular from '../components/AnfrageFormular'
import type { Einreichung, LeadRepository } from '../lib/repository'

const ERWARTUNG = [
  ['Dein Ziel zuerst', 'Die Stunde richtet sich nach dem, was du erreichen willst.'],
  ['Eine Stunde für dich', 'Mit jemandem aus dem Trainerteam an deiner Seite.'],
  ['Studio und Geräte', 'Du probierst aus, was zu deinem Ziel passt.'],
  ['Deine Fragen', 'Frag alles, auch das, was dir banal vorkommt.'],
] as const

const ABLAUF = [
  ['Anfragen', 'Sag uns kurz, was du willst und wann du Zeit hast.'],
  ['Termin finden', 'Wir melden uns innerhalb von zwei Werktagen.'],
  ['Loslegen', 'Eine Stunde Training, nur für dich.'],
] as const

const FAQ = [
  ['Was kostet das Probetraining?', 'Nichts. Dein erstes Training geht auf uns.'],
  [
    'Muss ich danach einen Vertrag abschließen?',
    'Nein. Du trainierst einmal mit uns und entscheidest danach in Ruhe, ob du wiederkommen willst.',
  ],
  [
    'Wie lange dauert es?',
    'Plan eine Stunde ein, dazu ein paar Minuten zum Umziehen. In dieser Stunde ist jemand aus unserem Trainerteam nur für dich da.',
  ],
  [
    'Was soll ich mitbringen?',
    'Bequeme Sportkleidung, saubere Hallenschuhe, ein Handtuch und etwas zu trinken. [Hinweis zu Umkleiden und Duschen]',
  ],
  [
    'Ich habe lange keinen Sport gemacht. Passt das trotzdem?',
    'Ja, genau dafür ist das Probetraining da. Wir fangen da an, wo du gerade stehst, nicht da, wo du vielleicht mal warst.',
  ],
  [
    'Ich habe Beschwerden oder eine Vorerkrankung. Kann ich mitmachen?',
    'Sprich vorher bitte mit deiner Ärztin oder deinem Arzt, eine medizinische Einschätzung können wir nicht geben. Erzähl uns beim Probetraining, was wir wissen sollten, dann stellen wir uns darauf ein.',
  ],
  [
    'Muss ich einen Termin vereinbaren oder kann ich spontan kommen?',
    'Bitte frag vorher an. So kann sich jemand aus unserem Trainerteam eine ganze Stunde Zeit für dich nehmen.',
  ],
  [
    'Wie oft kann ich ein Probetraining machen?',
    '[Regel des Studios, z. B. einmal pro Person]. Wenn du danach noch unsicher bist, sprich uns einfach an.',
  ],
  [
    'Ab welchem Alter kann ich mitmachen?',
    '[Mindestalter laut Studioregeln]. Wenn du noch nicht volljährig bist: [Regel für Minderjährige, z. B. Einverständnis der Eltern].',
  ],
  [
    'Darf ich jemanden mitbringen?',
    '[Regel des Studios zu Begleitpersonen]. Schreib es einfach in deine Nachricht, dann planen wir es mit ein.',
  ],
  [
    'Wann meldet ihr euch?',
    'Innerhalb von zwei Werktagen. Schau auch in deinen Spam-Ordner, falls nichts ankommt. Wenn du deine Telefonnummer angibst, geht es oft schneller.',
  ],
  [
    'Wo finde ich euch, und kann ich parken?',
    'Du findest uns hier: [Adresse des Studios]. [Hinweis zum Parken und zur Anfahrt mit Bus und Bahn]',
  ],
] as const

export default function Aktionsseite({ repo }: { repo: LeadRepository }) {
  const [ergebnis, setErgebnis] = useState<Extract<Einreichung, { gespeichert: true }> | null>(null)
  const dankeRef = useRef<HTMLHeadingElement>(null)

  // Nach dem Absenden den Fokus auf die Bestätigung setzen, damit Screenreader sie vorlesen.
  useEffect(() => {
    if (ergebnis) dankeRef.current?.focus()
  }, [ergebnis])

  return (
    <main id="inhalt">
      <section className="hero-band" aria-labelledby="h-hero">
        <div className="hero-text">
          <h1 id="h-hero">
            <span className="hero-kicker">Kostenloses Probetraining</span>
            Dein erstes Training <em>geht auf uns.</em>
          </h1>
          <p className="einleitung">Lern das Studio kennen. Ohne Vertrag, ohne Druck.</p>
          <a href="#anfrage" className="knopf akzent">
            Probetraining anfragen <span aria-hidden="true">→</span>
          </a>
          <ul className="fakten">
            <li>Kostenlos</li>
            <li>Ohne Vertrag</li>
            <li>60 Minuten</li>
          </ul>
        </div>
      </section>

      <section className="abschnitt raster" aria-labelledby="h-erwartung">
        <h2 id="h-erwartung">Was dich erwartet</h2>
        <ol className="nummern vier">
          {ERWARTUNG.map(([titel, text], i) => (
            <li key={titel}>
              <span className="nr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{titel}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="abschnitt" aria-labelledby="h-ablauf">
        <h2 id="h-ablauf">So läuft dein Probetraining</h2>
        <ol className="nummern drei">
          {ABLAUF.map(([titel, text], i) => (
            <li key={titel}>
              <span className="nr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{titel}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="anfrage-bereich">
        <section className="karte formular-karte" id="anfrage" aria-label="Probetraining anfragen">
          {ergebnis ? (
            <div className="erfolg">
              <div className="haken" aria-hidden="true">
                ✓
              </div>
              <h2 ref={dankeRef} tabIndex={-1}>
                Danke, deine Anfrage ist angekommen.
              </h2>
              <p>
                Wir melden uns innerhalb von zwei Werktagen mit einem Terminvorschlag. Falls du nichts von uns siehst,
                schau bitte auch in deinen Spam-Ordner.
              </p>
              <p>
                Bis dahin findest du in den <a href="#faq">häufigen Fragen</a>, was du mitbringen solltest.
              </p>
              <button type="button" className="knopf zweitrangig" onClick={() => setErgebnis(null)}>
                Weitere Anfrage senden
              </button>
            </div>
          ) : (
            <AnfrageFormular repo={repo} onErfolg={setErgebnis} />
          )}
        </section>
        <img
          className="anfrage-bild"
          src={`${import.meta.env.BASE_URL}bilder/probetraining.webp`}
          width={720}
          height={900}
          loading="lazy"
          decoding="async"
          alt="Trainierende im hellen Funktionsbereich des Studios, mit Kettlebells und Kunstrasen"
        />
      </div>

      <section className="abschnitt" aria-labelledby="h-vertrauen">
        <h2 id="h-vertrauen" className="leise">Darauf kannst du dich verlassen</h2>
        <dl className="versprechen">
          <div>
            <dt>Echte Antworten</dt>
            <dd>Ein Mensch aus dem Team antwortet dir. Eine KI hilft nur beim Vorbereiten.</dd>
          </div>
          <div>
            <dt>Datenschutz</dt>
            <dd>
              Deine Angaben nutzen wir nur für dein Probetraining. Mehr in der{' '}
              <Link to="/datenschutz">Datenschutzerklärung</Link>.
            </dd>
          </div>
          <div>
            <dt>Ohne Verkaufsdruck</dt>
            <dd>Es geht um dein Ziel, nicht um einen Vertrag.</dd>
          </div>
        </dl>
      </section>

      <section className="abschnitt" id="faq" aria-labelledby="h-faq">
        <h2 id="h-faq">Häufige Fragen</h2>
        <div className="faq">
          {FAQ.map(([frage, antwort]) => (
            <details key={frage}>
              <summary>{frage}</summary>
              <p>{antwort}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="abschluss" aria-labelledby="h-abschluss">
        <h2 id="h-abschluss">Bereit für deine erste Stunde?</h2>
        <a href="#anfrage" className="knopf akzent">
          Probetraining anfragen <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
}
