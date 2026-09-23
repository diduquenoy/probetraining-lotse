// Schreibt das vorgerenderte HTML der Startseite in dist/index.html.
// /team wird bewusst nicht vorgerendert (Login-Bereich, im Browser gerendert).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const datei = resolve('dist/index.html')
const vorlage = readFileSync(datei, 'utf8')
const html = render('/lotse/')
if (!vorlage.includes('<div id="root"></div>')) throw new Error('Platzhalter <div id="root"></div> nicht gefunden')
writeFileSync(datei, vorlage.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`Vorgerendert: / (${html.length} Zeichen HTML)`)
