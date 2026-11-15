# Dimora degli Ulivi

Agriturismo **fittizio**: azienda, informazioni, immagini e operazioni sono dimostrative. Nessuna prenotazione, pagamento o comunicazione reale.

## Stato: milestone 3; collaudo 4A con blocco browser

Sito boutique luminoso e fotografico su Qwik City SSR per Cloudflare Pages. La ricerca disponibilità è ora attiva come simulatore: date, ospiti e camere, inventario locale Ulivo/Acqua/Lino, combinazioni coerenti, importi per soggiorno, errori e casi senza risultati. La direzione acqua/lino/miele/ulivo e le fotografie della milestone 2 sono conservate.

`AGENTS.md` e `docs/MVP.md` restano invariati. Nessun deployment o servizio alberghiero esterno.

## Avvio locale

Prerequisiti: Node.js 22.16+ nella serie 22 oppure Node.js 24+, npm e Git. Verificato in Windows/PowerShell con Node 22.16.0 e npm 10.9.2. Non occorrono account, credenziali o variabili d’ambiente.

```powershell
npm ci
npm run dev
```

Aprire l’indirizzo locale stampato da Vite (normalmente `http://localhost:5173`). Vite è esclusivamente la toolchain di Qwik, in modalità SSR.

## Verifiche e produzione locale

```powershell
npm run typecheck
npm run lint
npm run test.unit
npm run build
npm run preview
```

Lasciare aperta la preview e, in un secondo terminale nella repository, eseguire:

```powershell
npm test
```

Wrangler Pages locale serve il worker di produzione a `http://127.0.0.1:8947`. `test.unit` esegue 17 test del motore senza server; `test.ssr` esegue 19 test HTTP reali su pagine, query del simulatore, metadati, associazioni ARIA, link, asset, 404 e artefatti SSR. `npm test` esegue entrambe le suite e richiede quindi la preview attiva. Per una porta diversa usare `SSR_TEST_ORIGIN` nella sola sessione dei test. Arrestare la preview con `Ctrl+C`.

Esempio: aprire `/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1`: tre soluzioni, Lino 405 €, Ulivo 465 €, Acqua 555 € per l’intero soggiorno. Calendario demo fisso 2027, da 1 a 14 notti, massimo 12 ospiti / 5 camere. Il modulo funziona anche tramite GET senza JavaScript; con JavaScript ricalcola localmente. Regole e limiti in [AVAILABILITY_SIMULATOR.md](docs/AVAILABILITY_SIMULATOR.md).

## Stack e struttura

- Qwik e Qwik City 1.20.4, TypeScript strict, Tailwind CSS 4, Vite 7, Wrangler 4; versioni risolte nel lockfile npm.
- `src/routes/`: routing file-based, layout, `DocumentHead` e loader SSR della ricerca.
- `src/components/`: marchio, navigazione, fotografie, inviti e modulo/risultati della disponibilità con primitive Qwik.
- `src/lib/availability.ts`: inventario, validazione e motore deterministico puro condiviso da server e browser.
- `src/data/`: navigazione, racconti editoriali e registro fotografie con crediti.
- `adapters/cloudflare-pages/`: adapter ufficiale; nessuna pagina prerenderizzata.
- `public/`: asset locali, favicon e direttive crawler.
- `tests/`: test unitari del motore e test HTTP della produzione locale, runner nativo Node.

Rotte: `/`, `/camere/`, `/esperienze/`, `/territorio/`, `/galleria/`, `/disponibilita/`, `/contatti/`. Rotte sconosciute: pagina e status HTTP 404.

## Documentazione

- [Architettura e decisioni](docs/ARCHITECTURE.md)
- [Inventario e regole del simulatore](docs/AVAILABILITY_SIMULATOR.md)
- [Build, hosting previsto e rollback](docs/DEPLOYMENT.md)
- [Worklog e verifiche effettivamente eseguite](docs/WORKLOG.md)
- [Caso di studio e limiti](docs/CASE_STUDY.md)
- [Fonti e licenze degli asset](docs/ASSETS.md)
- [Direzione del brand](docs/BRAND_DIRECTION.md)
- [Audit editoriale per pagina](docs/CONTENT_AUDIT.md)
- [Collaudo 4A: stato e procedura manuale](docs/QA_MANUAL.md)
- [Rilevanza delle dipendenze segnalate](docs/DEPENDENCY_AUDIT.md)

La demo emette `noindex, nofollow` e `robots.txt` restrittivo. Canonical omesso senza un’origine pubblica configurata: vedere DEPLOYMENT. Queste direttive non sostituiscono Cloudflare Access.

## Git e confini operativi

Milestone 1–3 sul solo `feature/mvp-foundation`, derivato da `develop` e mantenuto su richiesta. Nessun merge o rebase; push solo al branch di lavoro. `develop` integra, `preview` è staging, `master` produzione. Pubblicazione, DNS, Access, secrets, CI e billing restano riservati al proprietario. Collaudo tecnico/editoriale 4A eseguito; matrice visuale/tastiera di 4A bloccata. Nessuna fase successiva avviata.

La verifica browser mirata della milestone 3 rimane storica. In 4A Playwright non ha risposto: nessun nuovo collaudo visuale/tastiera o screenshot dichiarato. I 36 test tecnici passano; procedura manuale, evidenze e audit sono nei documenti elencati sopra. Non usare `npm audit fix --force` senza revisione di compatibilità.
