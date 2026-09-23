import { useState } from 'react'
import AnfrageFormular from '../components/AnfrageFormular'
import type { Einreichung, LeadRepository } from '../lib/repository'

export default function Aktionsseite({ repo }: { repo: LeadRepository }) {
  const [ergebnis, setErgebnis] = useState<Extract<Einreichung, { gespeichert: true }> | null>(null)

  return (
    <>
      <section className="hero-band">
        <div className="hero-text">
          <h1>
            Dein erstes Training <em>geht auf uns.</em>
          </h1>
          <p className="einleitung">
            Komm vorbei, lern das Studio kennen und finde heraus, was zu dir passt. Ohne Vertrag, ohne Druck.
          </p>
          <a href="#anfrage" className="knopf akzent">
            Probetraining sichern
          </a>
        </div>
      </section>
    <main className="buehne">
      <section>
        <h2 className="unterzeile">So läuft dein Probetraining</h2>
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
        <img
          className="probe-bild"
          src={`${import.meta.env.BASE_URL}bilder/probetraining.jpg`}
          width={720}
          height={900}
          loading="lazy"
          alt="Frau mit Brille und grauem Tanktop macht im hellen Funktionsbereich des Studios ein Selfie, im Hintergrund Kettlebells und Kunstrasen"
        />
      </section>

      <section className="karte" id="anfrage" aria-live="polite">
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
    </>
  )
}
