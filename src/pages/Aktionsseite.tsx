import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource/barlow-condensed/800.css'
import './landing.css'
import AnfrageFormular from '../components/AnfrageFormular'
import type { Einreichung, LeadRepository } from '../lib/repository'

const ERWARTUNG = [
  ['Dein Ziel zuerst', 'Die Stunde richtet sich nach dem, was du erreichen willst.'],
  ['Eine Stunde für dich', 'Mit jemandem aus dem Trainerteam an deiner Seite.'],
  ['Studio und Geräte', 'Du probierst aus, was zu deinem Ziel passt.'],
  ['Deine Fragen', 'Frag alles, auch das, was dir banal vorkommt.'],
] as const

const ABLAUF = [
  ['Anfrage stellen', 'Kurzes Formular: dein Ziel und wann du Zeit hast.'],
  ['Termin finden', 'Wir melden uns innerhalb von zwei Werktagen mit einem Vorschlag.'],
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

const bild = (datei: string) => `${import.meta.env.BASE_URL}bilder/${datei}`

/** Kleine Linien-Icons für den Vertrauensblock, bewusst ohne Icon-Bibliothek. */
function Icon({ name }: { name: 'antwort' | 'schloss' | 'hand' }) {
  const pfade = {
    antwort: 'M4 5h16v11H9l-5 4V5z M8 10h8 M8 13h5',
    schloss: 'M6 11h12v9H6z M9 11V8a3 3 0 0 1 6 0v3 M12 15v2',
    hand: 'M8 13V6.5a1.5 1.5 0 0 1 3 0V12 M11 11V5.5a1.5 1.5 0 0 1 3 0V12 M14 12V7.5a1.5 1.5 0 0 1 3 0V15a5 5 0 0 1-5 5h-1a5 5 0 0 1-4.3-2.5L5 13.3a1.5 1.5 0 0 1 2.6-1.5L8 12.5',
  }
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={pfade[name]} />
    </svg>
  )
}

export default function Aktionsseite({ repo }: { repo: LeadRepository }) {
  const [ergebnis, setErgebnis] = useState<Extract<Einreichung, { gespeichert: true }> | null>(null)
  const dankeRef = useRef<HTMLHeadingElement>(null)

  // Nach dem Absenden den Fokus auf die Bestätigung setzen, damit Screenreader sie vorlesen.
  useEffect(() => {
    if (ergebnis) dankeRef.current?.focus()
  }, [ergebnis])

  return (
    <main id="inhalt" className="lp">
      <section className="lp-hero" aria-labelledby="h-hero">
        <div className="lp-hero-text">
          <p className="lp-tag">Fitness · Gesundheit · Mehr Energie im Alltag</p>
          <h1 id="h-hero">
            <span className="lp-kicker">Kostenloses Probetraining</span>
            <span className="lp-gross">
              Dein Training.
              <br />
              Dein Tempo.
            </span>
          </h1>
          <p className="lp-lede">
            Dein erstes Training geht auf uns: Lern das Studio kennen, ohne Vertrag und ohne Druck.
          </p>
          <a href="#anfrage" className="pill lime">
            Kostenloses Probetraining anfragen <span aria-hidden="true">→</span>
          </a>
          <ul className="lp-fakten">
            <li>Kostenlos</li>
            <li>Ohne Vertrag</li>
            <li>60 Minuten nur für dich</li>
          </ul>
        </div>
        <picture className="lp-hero-bild">
          <source media="(max-width: 720px)" srcSet={bild('training-hero-mobil.webp')} type="image/webp" />
          <source srcSet={bild('training-hero.webp')} type="image/webp" />
          <img
            src={bild('training-hero.jpg')}
            width={1536}
            height={1024}
            fetchPriority="high"
            alt="Frau mit Brille und geflochtenen Zöpfen im dunklen Trainingsbereich des Studios"
          />
        </picture>
      </section>

      <section className="lp-abschnitt" id="erwartung" aria-labelledby="h-erwartung">
        <div className="lp-kopfzeile">
          <h2 id="h-erwartung">Was dich erwartet.</h2>
          <p className="lp-tag">Persönlich. Ehrlich. Ohne Druck.</p>
        </div>
        <ol className="lp-spalten vier">
          {ERWARTUNG.map(([titel, text], i) => (
            <li key={titel}>
              <span className="lp-nr" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{titel}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-abschnitt" id="ablauf" aria-labelledby="h-ablauf">
        <div className="lp-kopfzeile">
          <h2 id="h-ablauf">So läuft dein Probetraining ab.</h2>
          <p className="lp-tag">Einfach. Unkompliziert. Persönlich.</p>
        </div>
        <ol className="lp-schritte">
          {ABLAUF.map(([titel, text], i) => (
            <li key={titel}>
              <span className="lp-nr" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{titel}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="lp-anfrage">
        <section className="lp-formular" id="anfrage" aria-label="Probetraining anfragen">
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
              <button type="button" className="pill dunkel" onClick={() => setErgebnis(null)}>
                Weitere Anfrage senden
              </button>
            </div>
          ) : (
            <AnfrageFormular repo={repo} onErfolg={setErgebnis} />
          )}
        </section>
        <figure className="lp-motivation">
          <picture>
            <source srcSet={bild('probetraining.webp')} type="image/webp" />
            <img
              src={bild('probetraining.jpg')}
              width={720}
              height={900}
              loading="lazy"
              decoding="async"
              alt="Trainierende im hellen Funktionsbereich des Studios, mit Kettlebells und Kunstrasen"
            />
          </picture>
          <figcaption>
            <p className="lp-motivation-titel">Dein erster Schritt muss kein großer sein.</p>
            <ul className="lp-check">
              <li>Unverbindlich und kostenlos</li>
              <li>Persönliche Begleitung statt Standardprogramm</li>
              <li>Ehrliche Antworten auf all deine Fragen</li>
            </ul>
          </figcaption>
        </figure>
      </div>

      <section className="lp-vertrauen" aria-labelledby="h-vertrauen">
        <h2 id="h-vertrauen" className="visuell-versteckt">
          Darauf kannst du dich verlassen
        </h2>
        <dl>
          <div>
            <Icon name="antwort" />
            <dt>Echte Antworten</dt>
            <dd>Ein Mensch aus dem Team antwortet dir. Eine KI hilft nur beim Vorbereiten.</dd>
          </div>
          <div>
            <Icon name="schloss" />
            <dt>Datenschutz</dt>
            <dd>
              Deine Angaben nutzen wir nur für dein Probetraining. Mehr in der{' '}
              <Link to="/datenschutz">Datenschutzerklärung</Link>.
            </dd>
          </div>
          <div>
            <Icon name="hand" />
            <dt>Ohne Verkaufsdruck</dt>
            <dd>Es geht um dein Ziel, nicht um einen Vertrag.</dd>
          </div>
        </dl>
      </section>

      <section className="lp-abschnitt" id="faq" aria-labelledby="h-faq">
        <div className="lp-kopfzeile">
          <h2 id="h-faq">Häufige Fragen.</h2>
        </div>
        <div className="lp-faq">
          {FAQ.map(([frage, antwort]) => (
            <details key={frage}>
              <summary>{frage}</summary>
              <p>{antwort}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="lp-abschluss" aria-labelledby="h-abschluss">
        <div>
          <h2 id="h-abschluss">
            Deine erste
            <br />
            Stunde wartet.
          </h2>
          <p>Starte mit deinem kostenlosen Probetraining und erlebe Studio Weitblick selbst.</p>
          <a href="#anfrage" className="pill lime">
            Probetraining anfragen <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  )
}
