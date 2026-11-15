# Worklog — milestone 1: fondazione

Data: 15 novembre 2026. Incarico limitato a scaffold e identità visiva. Nessun avvio delle milestone successive, deploy o modifica a servizi esterni.

## Stato iniziale e Git

Lettura integrale di `AGENTS.md` e `docs/MVP.md`. File tracciati iniziali: soltanto le due specifiche. Erano presenti directory applicative vuote, preservate. Working tree pulito, branch `develop`, nessun branch locale o remoto `feature/mvp-foundation`.

Comandi preliminari:

```powershell
git status --short
git branch --show-current
git branch --list
git remote -v
git fetch origin
git rev-list --left-right --count develop...origin/develop
git ls-remote --heads origin feature/mvp-foundation
git switch -c feature/mvp-foundation develop
```

Il confronto dopo fetch ha restituito `0 0`. Base comune: `7db6ff93f05edfaa142eba0f5a4b7b08bb127572`. Nessun merge, rebase, worktree o subagente. `AGENTS.md` e `docs/MVP.md` invariati.

## Scaffold e dipendenze

Consultate documentazione ufficiale Qwik City (adapter, Tailwind, navigazione) e Cloudflare Pages (runtime locale), oltre alle istruzioni operative delle skill Sites, Cloudflare e Wrangler. La richiesta esplicita di lavoro locale nella repository prevale sui flussi di registrazione/pubblicazione Sites: nessun Site o progetto remoto creato.

Ambiente: Windows/PowerShell, Node 22.16.0, npm 10.9.2. Interrogate le release npm: Qwik, Qwik City e create-qwik stabili 1.20.4. Lo scaffold viene creato fuori repository, senza `git init`:

```powershell
npx --yes create-qwik@1.20.4 --help
$scaffoldDir = Join-Path $env:TEMP ('dimora-qwik-' + [guid]::NewGuid().ToString('N'))
npx --yes create-qwik@1.20.4 empty $scaffoldDir
```

Trasferiti solo `src`, `public`, package/configurazioni Qwik, TypeScript, Vite ed ESLint, gitignore e prettierignore, verificando le destinazioni. Le directory vuote preesistenti richiedevano copia del contenuto, non sostituzione dell’albero; nessuna specifica è stata sovrascritta. README generato successivamente dall’integrazione Cloudflare e poi riscritto per il progetto.

```powershell
npm install
node node_modules/@builder.io/qwik/qwik-cli.cjs add cloudflare-pages --skipConfirmation=true
node node_modules/@builder.io/qwik/qwik-cli.cjs add tailwind --skipConfirmation=true
npm install
```

L’esecuzione diretta della CLI ha selezionato pnpm per installare le integrazioni, non disponibile. I file delle integrazioni erano stati creati; installazione completata con npm e lockfile. Nessun lockfile alternativo. Wrangler aggiornato dalla versione 3 proposta dall’integrazione alla serie stabile 4. Versioni risolte: Qwik/Qwik City 1.20.4, Tailwind e plugin Vite 4.3.5, Vite 7.3.7, TypeScript 5.4.5, ESLint 9.32.0, Wrangler 4.162.0. Versioni complete nel lockfile.

Rimossi il manifest PWA generico e lo script di deployment; nessuna PWA richiesta. Snellita la configurazione Vite mantenendo plugin Qwik City, Qwik optimizer, alias TypeScript e Tailwind. TypeScript strict esteso all’adapter. Canonical emesso solo con origine pubblica configurata. Lingua italiana, metadati di pagina, noindex e robots restrittivo.

## Implementazione

- Homepage editoriale originale, palette avorio/oliva/terracotta, marchio e favicon SVG originali, fotografie WebP locali.
- Header, navigazione desktop, menu mobile nativo, footer con collegamenti e avviso completo della simulazione.
- Rotte introduttive delle sette pagine MVP, metadati distinti e catch-all SSR con status 404.
- Componenti condivisi per brand, introduzione interna, head, header e footer; dati di navigazione in `src/data`.
- Skip link, focus visibile, semantica, etichette di navigazione, testo alternativo e rispetto del movimento ridotto.
- Disponibilità: sola presentazione dello stato “in preparazione”. Nessun calendario, form, inventario, ricerca, prezzo o risultato; nessun backend business o servizio esterno.

Fonti fotografiche e licenze verificate prima dell’uso, con dettagli e URL in `docs/ASSETS.md`. WebP effettivo controllato anche con firma del file; immagini con dimensioni intrinseche, caricamento prioritario della hero e lazy loading delle altre. Avvisi ESLint `qwik/jsx-img` risolti con eccezione locale motivata: gli asset sono già compressi e dimensionati, non si usa la pipeline di trasformazione immagini a build.

## Problemi trovati e corretti

1. La configurazione ESLint dello scaffold ignorava tutti i `vite.config.ts`, compreso l’adapter. Rimossa quell’esclusione e inclusi sorgenti/configurazioni nel lint; primo tentativo fallito, esecuzione finale senza errori né warning.
2. `ssg: null` in Qwik City 1.20.4 saltava anche gli hook di generazione degli artefatti Pages. Verificato direttamente nel codice installato dell’adapter, quindi usato `ssg: { include: [], exclude: ["/*"], emit404Pages: false, sitemapOutFile: null, maxWorkers: 1 }`. Nessuna pagina prerenderizzata. La fase interna chiamata SSG rimane nel log, ma non genera pagine. Catch-all dinamico per 404 anziché `404.html` statico.
3. Prima porta 8788 raggiungeva un altro servizio locale. Quella prova è stata scartata; arrestata solo la preview avviata da questa sessione, scelta porta 8947 e ripetuti i test sul titolo e sui contenuti di questa applicazione. Nessun intervento sugli altri servizi.
4. Il primo smoke test non accettava l’attributo Qwik `q:head` su `<title>`. Corretto il matcher per ammettere attributi HTML, mantenendo l’asserzione sui metadati nella risposta grezza.
5. Controllo tastiera: lo stato `open` duplicato tra Qwik e `details` interferiva con la prima apertura. Eliminata la duplicazione: comportamento nativo per apertura, riferimento DOM con `useSignal` per chiusura dopo link ed Escape. Testato nuovamente sulla produzione locale.
6. Dopo navigazione client, il precedente `aria-current` poteva restare con valore `page` quando il nuovo valore era undefined. Usato il valore ARIA esplicito `false`: verificata una sola pagina corrente in ciascuna navigazione, anche dopo cambio rotta.
7. Le richieste browser di contesto isolato/CDP non sono consentite dall’ambiente. Verifica senza script eseguita invece su scheda Playwright con CSP `script-src 'none'` applicata soltanto durante il test; rimossa al termine. Nessuna CSP applicativa modificata.
8. Prima reinstallazione con `npm ci` bloccata da Windows (`EPERM` su `esbuild.exe`): alcuni processi figli Wrangler erano rimasti attivi dopo Ctrl+C nel terminale strumentato. Identificati tramite percorso eseguibile e command line di questa repository, arrestati soltanto i processi locali di preview creati dalla sessione. Nessun processo di altri progetti arrestato. La successiva `npm ci` ha completato installazione e audit dal lockfile (500 pacchetti installati, 507 verificati).

## Comandi di validazione

```powershell
npm run fmt
npm run typecheck
npm run lint
npm run build
npm run preview
# In un secondo terminale, con la preview di produzione attiva:
npm test
git diff --check
git diff -- AGENTS.md docs/MVP.md
```

Installazione `npm ci` riuscita dopo la chiusura dei processi locali descritta sopra. Dopo la reinstallazione: `npm run fmt`, `npm run typecheck`, `npm run lint` e `npm run build` completati con exit code 0; lint senza errori né warning. Build: artefatti client in `dist/build` e `dist/assets`, manifest client e moduli SSR in `server`, entry `_worker.js` e `_routes.json` in `dist`; nessun HTML prerenderizzato, nemmeno `404.html`. I warning colore della shell e la nota informativa dell’adapter sui cache header rimangono distinti dai controlli tecnici superati.

Verifica finale sulla produzione locale dopo reinstallazione e rebuild: `npm test` exit code 0, **10 test passati, 0 falliti, 0 saltati**. Tutte le sette risposte HTTP contengono contenuto e metadati distinti senza esecuzione di script; navigazione e asset rispondono 200, il catch-all restituisce 404, manifest/worker presenti e HTML prerenderizzati assenti. Timeout esplicito di 10 secondi sulle richieste per rendere evidente un runtime non raggiungibile. Controllati anche `git diff --check` e l’assenza di differenze sulle due specifiche.

## Verifica browser locale

Playwright MCP su Chromium, build produzione servita da Wrangler locale. Homepage controllata a 1440, 1024, 768, 390 e 320 px: nessun overflow orizzontale; immagini caricate e testo alternativo presente. Controllo su tutte e sette le pagine a 1440, 390 e 320 px: 21 combinazioni superate, un H1 e descrizione presenti, nessuna immagine completata ma rotta, nessun errore JavaScript nella serie normale di visite.

Da tastiera: skip link visibile al focus, Enter porta a `main#contenuto`; summary del menu raggiungibile, Enter apre, Tab raggiunge i link, Escape chiude e restituisce il focus al summary. Click su Camere aggiorna titolo/contenuto/pagina corrente e chiude il menu. Con tutti gli script bloccati tramite CSP nel solo test, richiesta diretta a Camere e navigazione nativa verso Home hanno conservato contenuto e titoli corretti. Gli errori console CSP in quella prova sono attesi; non sono errori del percorso normale.

Acquisite e ispezionate schermate della homepage desktop e mobile e del viewport desktop di Camere. Le catture a pagina intera di Camere sono andate in timeout: i controlli DOM/browser corrispondenti erano già superati; quelle catture non sono state considerate riuscite. Le catture locali non sono versionate. Non è un audit completo WCAG né una verifica su Safari o hosting pubblico.

Riproduzione manuale: avviare `npm run preview`, aprire Home e Camere, ridimensionare come sopra, provare Tab/Enter/Escape e disabilitare JavaScript dal browser prima di ricaricare direttamente le due rotte.

## Audit dipendenze e limiti

`npm audit --json`: 12 segnalazioni (8 moderate, 4 high), riconducibili alle catene dello scaffold Qwik City → vite-imagetools/sharp e zod, e tooling TypeScript ESLint → minimatch. Il conteggio include dipendenze padre, non 12 vulnerabilità indipendenti. L’audit propone anche downgrade molto vecchi del framework: non applicati; nessun `audit fix --force` né override di major incompatibili.

L’app non usa trasformazione di immagini fornite da utenti né validazione di input con zod: le immagini sono statiche e la ricerca non esiste ancora. Questo riduce le superfici utilizzate, ma non costituisce una certificazione di assenza di rischio; le segnalazioni restano da riesaminare prima del deploy. Warning di deprecazione delle dipendenze e warning ambiente `NO_COLOR`/`FORCE_COLOR` registrati durante installazione/build; non sono errori TypeScript o lint.

## Documentazione e consegna

Creati README, ARCHITECTURE, DEPLOYMENT, CASE_STUDY, ASSETS e questo WORKLOG. Procedure locali senza credenziali e rollback tramite revert, nessuna istruzione eseguita di provisioning o pubblicazione. Non modificati AGENTS/MVP.

Consegna in due commit atomici, implementazione/test e documentazione, esclusivamente sul branch richiesto. Commit implementazione/test: `5ecfdf812d318f858fbc43bb161cd547b5686779` (`feat: add Qwik City SSR foundation and visual identity`). La documentazione segue nel commit `docs: document foundation architecture and validation`. GPG disattivato solo per comando; push dei due commit sul solo branch di lavoro:

```powershell
git -c commit.gpgsign=false commit -m '<messaggio del commit atomico>'
git push -u origin feature/mvp-foundation
git status --short
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
```

I messaggi e gli SHA effettivi sono consultabili con `git log --oneline develop..feature/mvp-foundation` e riportati nella consegna. Restano alle fasi successive i contenuti interni completi, la ricerca simulata e il consolidamento finale. Nessun test CI remoto dichiarato, nessuna pubblicazione.

# Milestone 2 — identità boutique e contenuti editoriali

Data: 15 novembre 2026. Richiesta esplicita di proseguire sul branch esistente `feature/mvp-foundation`, senza merge, rebase o deploy. Milestone 3 non avviata.

## Verifiche iniziali e ambito

Letti integralmente AGENTS, MVP e documentazione foundation (README, ARCHITECTURE, DEPLOYMENT, CASE_STUDY, ASSETS e WORKLOG). Working tree pulito, HEAD `cad54ee3cdcdd1116c85901dcae81e8bda1990d7`. Dopo `git fetch origin`, confronto con `origin/feature/mvp-foundation`: `0 0`. Nessun cambio branch, worktree o subagente; lavoro esclusivo in questa repository.

```powershell
git status --short
git branch --show-current
git fetch origin
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
```

Preservati Qwik City, SSR, routing, adapter Cloudflare Pages, dipendenze, lockfile e configurazioni di hosting. Non modificati AGENTS.md o docs/MVP.md. Nessun backend aggiuntivo, servizio di prenotazione, form di invio o autenticazione.

## Direzione e implementazione

- Palette richiesta acqua `#A7C6C6`, lino `#FAF4E7`, miele `#B9834E`, ulivo `#65765B`; colori scuri di supporto per i testi. Marchio originale conservato e favicon adattata alla palette.
- Hero fotografica a tutta larghezza; invito al soggiorno, camere, finestra sul paesaggio, territorio e album. Impaginazione più orientata al viaggio e agli ambienti, con ampio spazio e carattere luminoso.
- CTA Disponibilità nell’header anche a 320 px, nella hero, nelle presentazioni delle camere e negli inviti di fine pagina. Nessuna finta interazione con date o ricerca.
- Camere complete sul piano editoriale: Ulivo, Acqua e Lino. Non sono un inventario: mancano quantità, capienza, tariffe, regole di disponibilità e azioni di prenotazione.
- Esperienze: passeggiata tra gli ulivi, pomeriggio d’estate, tramonto. Idee narrative, senza guida prenotabile o calendario.
- Territorio: taccuino di Pienza, San Quirico d’Orcia e Bagno Vignoni, stagioni e rimando alla fonte ufficiale Visit Tuscany. Nessuna posizione, distanza o tragitto attribuito alla struttura fittizia.
- Galleria con otto fotografie distinte, categorie ad ancore native, autori, fonti e provenienze; i riferimenti fuori Toscana sono dichiarati.
- Contatti trasformata in pagina informativa completa con cinque FAQ native `details/summary`. Nessun recapito inventato, mappa, raccolta dati o invio.
- Disponibilità: pagina progettata con stato “Non ancora attiva”, spiegazione, fotografia e percorsi verso camere, territorio e FAQ. Calendario, inventario e ricerca restano assenti.

Riutilizzo concreto: `Photo` centralizza dimensioni, testo alternativo, priorità, srcset e caricamento; `StayInvitation` unifica l’invito alla disponibilità; `PageIntro` conserva breadcrumb, titolo, introduzione e Slot. `photos.ts` è il registro tipizzato delle foto; `editorial.ts` contiene esclusivamente il racconto delle camere e delle esperienze.

## Fotografie, fonti e riproduzione

Verificate pagine originali gratuite e licenze Unsplash/Pexels, scaricate immagini locali e ispezionate le candidate. Scartate immagini troppo scure, una foto in bianco e nero e una camera non coerente. Solo gli asset selezionati sono nella consegna. URL, autori, licenze, provenienze, parametri e comando riproducibile in ASSETS; crediti anche in Galleria.

Hero con varianti 2200 e 900 px; nuovi WebP per camere/panorama e JPEG per tenuta/dettaglio. Dimensioni WebP verificate anche leggendo gli header binari con Node e senza modificare i file: 2200×1467, 900×600, camere 1200×800 e 1200×1800, panorama 1800×1200, finestra 1200×1800. Nessun CDN immagini o font esterno richiesto a runtime. Il file podere della foundation è conservato; la hero usa nuove varianti della stessa fotografia.

Fonte geografica consultata: https://www.visittuscany.com/it/territori/val-dorcia/ . Testi originali sintetici; nessuna immagine di Visit Tuscany riutilizzata. Le foto di Clay Banks (Stati Uniti) e Alessandro Guarino (Umbria) sono ispirazioni di interni/ospitalità, non prove di una struttura toscana esistente.

Contrasti calcolati con luminanza relativa sRGB e documentati in BRAND_DIRECTION: inchiostro/lino 10,24:1, corpo/lino 5,95:1, inchiostro/acqua 6,17:1, bianco/ulivo 4,89:1. Il colore ulivo su lino è riservato a titoli grandi e grafica; miele non viene usato per piccoli testi bianchi.

## Verifiche tecniche

```powershell
npm run fmt
npm run typecheck
npm run lint
npm run build
npm run preview
# Secondo terminale, produzione locale già avviata:
npm test
git diff --check
git diff -- AGENTS.md docs/MVP.md
```

Dipendenze già presenti dalla foundation e input npm invariati: nessuna installazione o modifica al lockfile necessaria in questa milestone. Primo typecheck: rilevato `srcSet` non valido per i tipi Qwik; corretto in `srcset`. Rimosso inoltre un eslint-disable risultato non necessario sul componente Photo. Typecheck e prima build completati; successivo lint senza errori né warning.

Ampliati i test HTTP della foundation a 12: sette rotte con contenuti/SEO nell’HTML grezzo, asset e varianti srcset, tutte le ancore interne, narrazioni delle camere, autori della galleria, FAQ, stato ricerca assente, HTTP 404 e worker/manifest senza HTML prerenderizzati. Sulla produzione locale Wrangler `http://127.0.0.1:8947`: **12 passati, 0 falliti, 0 saltati**. Nessun mock di rete o test CI remoto dichiarato.

Controllo finale dopo formattazione: typecheck, lint e build produzione con exit code 0; lint senza errori né warning. Ricostruito il worker e riavviato Wrangler locale: 12 test HTTP nuovamente passati, 0 falliti, 0 saltati. Il controllo degli asset legge ora interamente le risposte, verifica corpo non vuoto e firma/formato sia WebP sia JPEG. Client, server, `_worker.js` e `_routes.json` presenti, nessuna pagina prerenderizzata; configurazione dell’adapter invariata. `git diff --check` riuscito e nessuna differenza su specifiche, dipendenze, lockfile o configurazioni di hosting. Log locale della build in `.cache/milestone-2-build.log` (non versionato).

## Browser: evidenze e limiti

Playwright MCP, Chromium, worker produzione locale. Conclusa una serie di 28 visite: tutte le sette pagine a 1440, 768, 390 e 320 px. Per ciascuna: nessun overflow orizzontale, un solo H1, CTA header visibile e nessuna immagine completata con errore. Questo controllo distingue immagini ancora lazy da immagini rotte.

Acquisite e ispezionate Home desktop estesa e viewport mobile. Fotografie principali e camere verificate anche nel DOM dopo scorrimento. Alcune catture estese mostrano immagini ancora fuori dall’area di caricamento o pittura: non sono state usate come prova di caricamento completo di tutte le foto. Gli asset referenziati e i loro formati sono stati verificati via HTTP.

Sequenze browser aggiuntive per scorrimento completo, tastiera e FAQ si sono bloccate e sono state interrotte: non conteggiate come test superati. Anche un tentativo successivo con azioni mirate e chiusura della sola scheda creata per questa milestone non ha restituito un risultato entro l’attesa. Non sono stati riavviati browser condivisi né toccati altri progetti. Menu e focus della foundation sono conservati; FAQ e ancore sono native. Resta una verifica manuale completa da tastiera della milestone 2, distinta dal controllo già concluso sui viewport. Nessuna equivalenza con Safari o audit WCAG completo.

Riproduzione manuale: avviare preview; usare Tab/Enter per skip link, menu e FAQ; Escape per chiudere il menu; seguire Disponibilità e gli inviti alle camere; scorrere e attendere le foto; aprire categorie/crediti della galleria. Verificare anche ricariche dirette alle rotte e preferenza di movimento ridotto.

## Documentazione e rischi residui

Creato BRAND_DIRECTION.md; aggiornati README, ARCHITECTURE, DEPLOYMENT, CASE_STUDY, ASSETS e questo worklog. Nessuna credenziale nei documenti. Procedure e rollback della foundation restano applicabili.

`npm audit --json` ripetuto: 12 segnalazioni (8 moderate, 4 high), come nella foundation. Nessun aggiornamento forzato, override o downgrade. Rischio da riesaminare prima del deploy. Nessun nuovo pacchetto introdotto; i warning ambiente colore e la nota adapter sui cache header sono distinti da errori di compilazione.

Consegna con commit atomici per sito/test e documentazione, sul solo branch esistente. Commit sito/test e licenze: `965a4ac46388b91a9b4533bb28bed1ee8deb33e0` (`feat: create immersive boutique identity and editorial pages`). La documentazione segue nel commit `docs: record boutique brand direction and milestone 2 validation`. Comandi:

```powershell
git -c commit.gpgsign=false commit -m '<messaggio atomico>'
git push origin feature/mvp-foundation
git status --short
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
```

Nessun merge, rebase, force push, deploy o modifica a DNS, Access, secrets, CI o billing. Passo successivo previsto: milestone 3, soltanto con incarico distinto.
