# Dimora degli Ulivi

Agriturismo **fittizio**: azienda, informazioni, immagini di riferimento e operazioni sono dimostrative. Nessuna prenotazione, pagamento o comunicazione reale.

## Stato: milestone 2

Sito boutique luminoso e fotografico, costruito sulla foundation Qwik City SSR per Cloudflare Pages. Hero a tutta larghezza, palette acqua/lino/miele/ulivo e contenuti editoriali completi: tre atmosfere di camera, esperienze, territorio, galleria con crediti e FAQ. L’accesso alla disponibilità è visibile anche su mobile; la ricerca simulata appartiene alla milestone 3 ed è ancora assente.

`AGENTS.md` e `docs/MVP.md` sono le specifiche vincolanti e non sono state modificate. Nessun deployment è stato effettuato.

## Avvio locale

Prerequisiti: Node.js 22.16+ nella serie 22 oppure Node.js 24+, npm e Git. Verificato in Windows/PowerShell con Node 22.16.0 e npm 10.9.2. Non occorrono account, credenziali o variabili d’ambiente.

```powershell
npm ci
npm run dev
```

Aprire l’indirizzo locale stampato da Vite (normalmente `http://localhost:5173`). Vite è esclusivamente la toolchain di Qwik, con modalità SSR.

## Verifiche e produzione locale

```powershell
npm run typecheck
npm run lint
npm run build
npm run preview
```

Lasciare aperto il terminale della preview. In un secondo terminale, nella stessa repository:

```powershell
npm test
```

La preview usa **Wrangler Pages locale**, `http://127.0.0.1:8947`, ed esegue il worker della build di produzione. `npm test` richiede quella preview già avviata: 12 test controllano le sette risposte HTML senza eseguire JavaScript, metadati, link e ancore, asset, crediti e contenuti editoriali, 404 e artefatti SSR. Non usa mock di HTTP. Per una porta diversa impostare `SSR_TEST_ORIGIN` nella sola sessione di test. Arrestare la preview con `Ctrl+C`.

## Stack e struttura

- Qwik e Qwik City 1.20.4 stabili, TypeScript strict, Tailwind CSS 4, Vite 7, Wrangler 4; versioni risolte in `package-lock.json`.
- `src/routes/`: routing file-based, layout condiviso e `DocumentHead` per ogni pagina.
- `src/components/`: marchio, header/menu, footer, head HTML, introduzione, fotografie e invito al soggiorno.
- `src/data/`: navigazione, testi editoriali e registro delle fotografie, senza inventario o dati di prenotazione.
- `adapters/cloudflare-pages/`: adapter ufficiale con SSG disabilitato.
- `public/`: asset locali, favicon e direttive per i crawler.
- `tests/`: smoke test HTTP sulla produzione locale con il test runner nativo di Node.

Rotte: `/`, `/camere/`, `/esperienze/`, `/territorio/`, `/galleria/`, `/disponibilita/`, `/contatti/`. La rotta disponibilità dichiara che la ricerca è in preparazione. Rotte sconosciute: pagina 404 e status HTTP 404.

## Documentazione

- [Architettura e decisioni](docs/ARCHITECTURE.md)
- [Riproduzione build, hosting previsto e rollback](docs/DEPLOYMENT.md)
- [Worklog e risultati delle verifiche](docs/WORKLOG.md)
- [Caso di studio e limiti](docs/CASE_STUDY.md)
- [Fonti e licenze degli asset](docs/ASSETS.md)
- [Direzione del brand e criteri visivi](docs/BRAND_DIRECTION.md)

La demo emette `noindex, nofollow` e `robots.txt` restrittivo. Il canonical è omesso senza un’origine pubblica esplicitamente configurata: vedere `docs/DEPLOYMENT.md`. Queste direttive SEO non sostituiscono Cloudflare Access.

## Git e confini operativi

Milestone 1 e 2 sul solo `feature/mvp-foundation`, derivato da `develop` e mantenuto su richiesta. Nessun merge o rebase; push solo al branch di lavoro. `develop` integra, `preview` è staging, `master` produzione. Pubblicazione, DNS, Access, secrets, CI e billing restano riservati al proprietario.

`npm audit` segnala dipendenze transitive dello scaffold: vedere il worklog per evidenza e limiti. Non usare `npm audit fix --force` senza una revisione di compatibilità.
