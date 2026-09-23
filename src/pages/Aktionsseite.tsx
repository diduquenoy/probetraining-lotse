import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AnfrageFormular from '../components/AnfrageFormular'
import type { Einreichung, LeadRepository } from '../lib/repository'

const ERWARTUNG = [
  ['Dein Ziel zuerst', 'Wir sprechen darüber, was du erreichen willst, und richten die Stunde danach aus.'],
  ['Eine Stunde für dich', 'Die ganze Stunde gehört dir, mit jemandem aus unserem Trainerteam an deiner Seite.'],
  ['Studio und Geräte kennenlernen', 'Du probierst aus, was zu deinem Ziel passt, und lernst dabei, wie die Geräte richtig eingestellt werden.'],
  ['Zeit für deine Fragen', 'Frag ruhig alles, was dir durch den Kopf geht, auch das, was dir vielleicht banal vorkommt.'],
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
          <p className="einleitung">
            Komm vorbei, lern das Studio kennen und finde heraus, was zu dir passt. Ohne Vertrag, ohne Druck.
          </p>
          <a href="#anfrage" className="knopf akzent">
            Probetraining anfragen
          </a>
          <p className="vertrauenszeile">Kostenlos · Ohne Vertrag · Antwort in zwei Werktagen</p>
        </div>
      </section>

      <section className="abschnitt" aria-labelledby="h-erwartung">
        <h2 id="h-erwartung">Was dich erwartet</h2>
        <ul className="erwartung">
          {ERWARTUNG.map(([titel, text]) => (
            <li key={titel}>
              <h3>{titel}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="buehne">
        <section aria-labelledby="h-ablauf">
          <h2 id="h-ablauf">So läuft dein Probetraining</h2>
          <ol className="vorteile">
            <li>
              <span className="zahl">1</span>
              <span>Du sagst uns kurz, was du erreichen willst und wann du Zeit hast.</span>
            </li>
            <li>
              <span className="zahl">2</span>
              <span>Wir melden uns innerhalb von zwei Werktagen mit einem Terminvorschlag.</span>
            </li>
            <li>
              <span className="zahl">3</span>
              <span>Beim Probetraining nimmt sich jemand aus unserem Trainerteam eine Stunde Zeit nur für dich.</span>
            </li>
          </ol>
        </section>

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
      </div>

      <section className="abschnitt vertrauen" aria-labelledby="h-vertrauen">
        <img
          className="probe-bild"
          src={`${import.meta.env.BASE_URL}bilder/probetraining.webp`}
          width={720}
          height={900}
          loading="lazy"
          decoding="async"
          alt="Trainierende im hellen Funktionsbereich des Studios, mit Kettlebells und Kunstrasen"
        />
        <div>
          <h2 id="h-vertrauen">Darauf kannst du dich verlassen</h2>
          <dl className="versprechen">
            <div>
              <dt>Echte Antworten</dt>
              <dd>
                Ein Mensch aus unserem Team liest und beantwortet deine Anfrage. Eine KI hilft uns nur dabei, sie
                vorzubereiten.
              </dd>
            </div>
            <div>
              <dt>Datenschutz</dt>
              <dd>
                Deine Angaben nutzen wir nur für deine Anfrage und dein Probetraining, alles Weitere steht in unserer{' '}
                <Link to="/datenschutz">Datenschutzerklärung</Link>.
              </dd>
            </div>
            <div>
              <dt>Ohne Verkaufsdruck</dt>
              <dd>
                Jemand aus unserem Trainerteam nimmt sich Zeit für dich und orientiert sich an deinem Ziel, nicht an
                einem Vertragsabschluss.
              </dd>
            </div>
          </dl>
        </div>
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
        <p>Schick uns deine Anfrage, wir melden uns innerhalb von zwei Werktagen mit einem Terminvorschlag.</p>
        <a href="#anfrage" className="knopf akzent">
          Probetraining anfragen
        </a>
      </section>
    </main>
  )
}
