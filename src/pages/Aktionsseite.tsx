import { useState } from 'react'
import AnfrageFormular from '../components/AnfrageFormular'
import type { Einreichung, LeadRepository } from '../lib/repository'

export default function Aktionsseite({ repo }: { repo: LeadRepository }) {
  const [ergebnis, setErgebnis] = useState<Extract<Einreichung, { gespeichert: true }> | null>(null)

  return (
    <main className="buehne">
      <section>
        <h1>Dein erstes Training <em>geht auf uns.</em></h1>
        <p className="einleitung">
          Komm vorbei, lern das Studio kennen und finde heraus, was zu dir passt. Ohne Vertrag, ohne Druck.
        </p>
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
            <span>Beim Probetraining nimmt sich ein Trainer eine Stunde Zeit nur für dich.</span>
          </li>
        </ol>
      </section>

      <section className="karte" aria-live="polite">
        {ergebnis ? (
          <div className="erfolg">
            <div className="haken" aria-hidden="true">
              ✓
            </div>
            <h2>Danke, deine Anfrage ist da.</h2>
            <p>Wir melden uns innerhalb von zwei Werktagen bei dir. Schau auch in deinen Spam-Ordner.</p>
            <button type="button" className="knopf zweitrangig" onClick={() => setErgebnis(null)}>
              Weitere Anfrage senden
            </button>
          </div>
        ) : (
          <AnfrageFormular repo={repo} onErfolg={setErgebnis} />
        )}
      </section>
    </main>
  )
}
