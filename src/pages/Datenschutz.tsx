import { Link } from 'react-router-dom'

/**
 * Datenschutzhinweis der Demo. Beschreibt ehrlich, welche Dienste die Anfragen tatsächlich verarbeiten.
 * Für einen echten Kunden müsste der Text rechtlich geprüft und um die Angaben des Studios ergänzt werden.
 */
export default function Datenschutz() {
  return (
    <main id="inhalt" className="rechtstext">
      <h1>Datenschutzhinweis zur Demo</h1>
      <p className="meldung info">
        Studio Weitblick ist ein fiktives Studio. Diese Seite ist ein Prototyp von Diana Duquenoy. Du kannst das
        Formular gern mit erfundenen Angaben ausprobieren.
      </p>

      <h2>Verantwortlich</h2>
      <p>
        Diana Duquenoy. Die Kontaktdaten stehen im{' '}
        <a href="https://diana-duquenoy.com/impressum/">Impressum von diana-duquenoy.com</a>.
      </p>

      <h2>Was mit deiner Anfrage passiert</h2>
      <ul>
        <li>
          Deine Angaben aus dem Formular (Name, E-Mail, optional Telefon, Ziel, Zeitfenster, optional Nachricht)
          werden in einer Datenbank bei <strong>Supabase</strong> gespeichert. Der Server steht in der EU (Irland).
        </li>
        <li>
          Damit das Team schneller antworten kann, schickt die Seite Name, Ziel, Zeitfenster und Nachricht, aber keine E-Mail-Adresse und keine Telefonnummer, an die KI{' '}
          <strong>Claude von Anthropic</strong> (USA). Die KI fasst sie zusammen und schreibt einen Antwortentwurf.
          Verschickt wird nichts automatisch, ein Mensch prüft jeden Entwurf.
        </li>
        <li>
          Die Seite selbst liegt bei <strong>Strato</strong> (Deutschland). Schriften und Bilder werden von dort
          geladen, nicht von Google oder anderen Anbietern.
        </li>
      </ul>

      <h2>Worauf wir achten</h2>
      <ul>
        <li>Wir fragen nur, was wir für eine Antwort brauchen. Telefon und Nachricht sind freiwillig.</li>
        <li>Bitte schreib keine Gesundheitsangaben ins Formular. Beschwerden besprechen wir beim Probetraining.</li>
        <li>Es gibt keine Werbe-Cookies und kein Tracking auf dieser Seite.</li>
      </ul>

      <h2>Deine Rechte</h2>
      <p>
        Du kannst jederzeit Auskunft, Berichtigung oder Löschung deiner Anfrage verlangen und deine Einwilligung
        widerrufen. Eine kurze Nachricht an die Adresse im Impressum reicht.
      </p>

      <p>
        <Link to="/">Zurück zum Probetraining</Link>
      </p>
    </main>
  )
}
