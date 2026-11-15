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

# Milestone 3 — simulatore disponibilità camere

Data: 15 novembre 2026. Proseguimento esplicitamente richiesto su `feature/mvp-foundation`; nessun nuovo branch, worktree o subagente. Milestone 4 non avviata.

## Stato iniziale e specifiche

Letti integralmente AGENTS, MVP e documentazione esistente della foundation e della direzione boutique. Working tree inizialmente pulito, HEAD `6e7da76039e98060701f49d3b8355e34d065cffa`. `git fetch origin` e confronto con `origin/feature/mvp-foundation`: `0 0`, confermato anche prima dei commit. Nessun conflitto o lavoro locale preesistente.

Qwik/Qwik City 1.20.4, TypeScript strict, Tailwind, routing e adapter Pages conservati. AGENTS.md, docs/MVP.md, package-lock.json, configurazioni adapter e Wrangler invariati. Dipendenze già installate e nessuna nuova dipendenza: non ripetuta `npm ci`; la procedura pulita resta in README/DEPLOYMENT. Nessun database, API business, autenticazione, pagamento, prenotazione, servizio esterno o invio reale.

## Scelte e implementazione

- Motore puro `src/lib/availability.ts`, condiviso da SSR e browser. Nessuna lettura dell’orologio, casualità, rete o persistenza: medesimi input, medesimi risultati.
- Inventario coerente con le tre camere editoriali: due Ulivo da due posti / 145 €, due Acqua da tre posti / 175 €, una Lino da due posti / 125 €. Cinque unità fisiche e dodici posti complessivi, dati tutti fittizi.
- Finestra fissa 2027, partenza finale 1 gennaio 2028, soggiorni da 1 a 14 notti. Limiti espliciti nel modulo e validazione condivisa. Giorni civili UTC, check-out escluso: nessuna variazione dovuta all’ora legale.
- Occupazioni simulate di tre notti ogni ventotto giorni con offset per unità; chiusura delle notti 1–14 novembre. La stessa unità deve restare libera per l’intero soggiorno. Test dedicato al caso in cui esista una camera libera diversa ogni notte ma nessuna libera continuativamente.
- Enumerazione delle combinazioni di tipologie, anche miste, con esatto numero di camere e capienza sufficiente. Una sola offerta per combinazione equivalente, unità univoche, assegnazione degli ospiti rispettosa delle capienze. Ordinamento per totale, capienza e ID stabile.
- Importi in centesimi, sommati per notte e per camera: base +30% in luglio/agosto, poi +15 € per venerdì/sabato. Nessun supplemento ospite; extra e imposte non simulati. Interfaccia con totale soggiorno, subtotali tipologia e dettaglio notturno. Tutte le assunzioni in AVAILABILITY_SIMULATOR.
- Componente `AvailabilitySearch` con form GET, input data nativi, select ospiti/camere, errori, stato vuoto, risultati fotografici e modifica ricerca. Riutilizzati Photo e contenuti editoriali; palette, tipografia e hero precedenti conservate. Nessun asset o licenza aggiunto.
- `routeLoader$` per inizializzare dal query string sul server. Senza JavaScript il GET restituisce comunque il risultato completo. Con JavaScript, handler Qwik e primitive `useStore`/`useSignal` ricalcolano localmente; `useTask$` sincronizza i cambi di query della stessa rotta. Nessuna API aggiuntiva. Le successive modifiche client non aggiornano l’URL e sono effimere; documentato l’effetto della ricarica.
- Cambiare un parametro rimuove le precedenti offerte. Etichette, fieldset/legend, aiuti e errori associati, riepilogo con ancore, aria-invalid esplicito e stato live. L’invio avanzato porta il focus al primo errore o alla sezione esito; il pulsante Modifica torna al check-in. Dettagli HTML nativi, tabelle con caption e scope, stili di focus esistenti.
- Aggiornate Camere con capacità/quantità/base derivate dal motore, FAQ/Contatti, inviti e footer: nessun residuo messaggio di ricerca non attiva nell’applicazione.

## Test e problemi risolti

Aggiunti 17 test unitari del motore: inventario e unicità unità, date impossibili, notti con ora legale/bisestile/cambio anno, limiti, quantità, prezzi stagionali/weekend, check-out escluso, continuità dell’unità, confini della chiusura, prezzi noti, combinazioni miste e assegnazione, dodici posti, assenza risultati, determinismo/invarianti e query incomplete/duplicate. Compilazione TypeScript strict isolata in `.cache/availability-tests/`; runner Node, nessun nuovo framework di test.

Test HTTP ampliati da 12 a 16: sette rotte editoriali con contenuti/metadati nella risposta grezza; navigazione, asset e firme immagini, ancore, crediti e FAQ; modulo con GET e date native; risultati senza script, capienze/prezzi; combinazioni miste, errori e due tipi di assenza risultati; associazioni ARIA; HTTP 404; worker e manifest senza HTML prerenderizzato. Non si tratta di mock HTTP.

Problemi durante lo sviluppo:

1. I tipi Qwik per `<option>` non accettavano i figli separati numero/testo: usata un’unica stringa per opzione. Successivo typecheck passato.
2. Primo controllo del focus nell’HTML fallito perché il matcher cercava solo `tabindex` minuscolo, mentre Qwik emette `tabIndex`. Ispezionata la sezione prodotta e reso il matcher insensibile alla capitalizzazione degli attributi HTML. Nessuna rimozione dell’asserzione sul focus programmabile.
3. Playwright MCP non ha restituito né navigazione con timeout esplicito, né una successiva richiesta di elenco schede. Chiamate interrotte; richiesto all’utente il ripristino del collegamento. Nessun riavvio del browser condiviso, uso di input nativo o intervento su altri progetti. Queste prove non sono conteggiate come superate.
4. Per ricostruire e riavviare la preview Windows, arrestati solo CLI Wrangler con percorso di questa repository/porta 8947 e binari locali identificati dal percorso assoluto. Nessun servizio di altri progetti arrestato. Preview locale arrestata a fine verifica.
5. Nel controllo finale rilevato che le esclusioni generiche `lib` dello scaffold nascondevano anche il nuovo `src/lib` a ESLint e Prettier. Ristretti i pattern alla directory di output in radice (`lib/**` in ESLint, `/lib` in Prettier); formattato il motore e ripetuti lint, typecheck, test e build con il sorgente incluso. Nessuna modifica di CI.

## Comandi ed esiti

```powershell
npm run fmt
npm run typecheck
npm run lint
npm run test.unit
npm run build
npm run preview
# In un secondo terminale, preview di produzione già attiva:
npm test
npm audit --json
git diff --check
git diff -- AGENTS.md docs/MVP.md adapters/cloudflare-pages/vite.config.ts wrangler.jsonc package-lock.json
```

Typecheck, lint e build produzione: exit code 0, lint senza errori né warning. `npm test` dopo build e riavvio Wrangler: **17 unitari + 16 HTTP = 33 passati, 0 falliti, 0 saltati**. Artefatti client (`dist/build`, `dist/assets`, manifest), server (`server/`, `dist/_worker.js`, `_routes.json`) generati; nessun HTML prerenderizzato. La nota interna “Starting Qwik City SSG” non produce pagine, come confermato dai test. Restano i warning ambiente colore e la nota adapter sui cache header, distinti da errori di compilazione. Log locale non versionato: `.cache/milestone-3-build.log`.

SSR verificato su **build di produzione nel runtime locale Cloudflare/Wrangler**, `http://127.0.0.1:8947`, non solo vite dev. Homepage e tutte le rotte interne contengono HTML significativo e metadati. GET diretto alla ricerca 10–13 giugno 2027 / due ospiti / una camera: tre soluzioni e totali 405 / 465 / 555 €. Cinque ospiti / due camere: prima combinazione 960 €. Query errate e chiusura restituiscono spiegazioni nella risposta iniziale, senza esecuzione JavaScript. `git diff --check` superato; nessuna differenza sulle specifiche o configurazioni protette.

`npm audit --json` ripetuto: 12 segnalazioni (8 moderate, 4 high), stesso conteggio delle milestone precedenti. Report locale `.cache/milestone-3-audit.json`, ignorato. Nessun aggiornamento forzato, downgrade o override; rischio residuo da riesaminare prima di una pubblicazione. Il nuovo motore non usa zod né trasformazioni di immagini utente.

## Accessibilità e limite browser — prima consegna

Verificati automaticamente sul vero HTML SSR: etichette di tutti i campi, fieldset/legend, riferimenti aria-describedby risolti, quattro errori aria-invalid per una query errata, regione live, sezione esito con tabIndex -1 e nome accessibile, tabelle con caption e scope. Stili responsive e focus visibile implementati nel tema esistente; controlli data e dettagli nativi.

Alla prima consegna **non era conclusa la verifica interattiva della milestone 3 nel browser**, a causa del collegamento Playwright non rispondente. Stato storico successivamente superato per i controlli mirati descritti nell’integrazione seguente; restano distinti lettore di schermo, UI nativa del calendario e audit WCAG completo. Procedura manuale riproducibile in AVAILABILITY_SIMULATOR, senza passaggi di prenotazione.

## Documentazione e consegna

Creato `docs/AVAILABILITY_SIMULATOR.md`; aggiornati README, ARCHITECTURE, DEPLOYMENT, CASE_STUDY, BRAND_DIRECTION e WORKLOG. ASSETS invariato perché fotografie e licenze non cambiano. Procedure di test, esempi, assunzioni e rollback documentati senza credenziali.

Consegna in due commit atomici sul solo `feature/mvp-foundation`: implementazione/test e documentazione. Commit implementazione/test: `1028483fc44359fdb8de5d1b369913ff06cc5541` (`feat: add deterministic room availability simulator`). La documentazione segue nel commit `docs: document availability rules and milestone 3 validation`. GPG disattivato soltanto per ciascun comando di commit. Comandi di consegna:

```powershell
git -c commit.gpgsign=false commit -m 'feat: add deterministic room availability simulator'
git -c commit.gpgsign=false commit -m 'docs: document availability rules and milestone 3 validation'
git push origin feature/mvp-foundation
git status --short
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
```

Gli SHA effettivi sono consultabili con `git log --oneline` e riportati nella consegna. Nessun merge, rebase, force push, deployment o modifica a DNS, Access, secrets, CI o billing. Milestone 4 non avviata. Il primo blocco browser è seguito dalla verifica integrativa qui sotto.

## Integrazione milestone 3 — ripresa Playwright e selezioni SSR

Sempre il 15 novembre 2026, su richiesta esplicita del proprietario di riprovare Playwright. Branch `feature/mvp-foundation`, working tree inizialmente pulito su `9b5bdefd58c5f232f0e38f691d6c5aed6576865d`. Nessun cambio di milestone.

La prima nuova richiesta di elenco schede non ha risposto dopo circa quaranta secondi ed è stata interrotta. Avviata la preview della build già prodotta con `npm run preview`; la successiva chiamata diretta `browser_navigate` ha risposto. Chromium esponeva una scheda con `document.visibilityState = hidden` e un’animazione sospesa: l’attesa Playwright del click per stabilità non terminava. Portata la scheda in primo piano con `page.bringToFront()`, senza input Windows, CDP o riavvio di browser condivisi. Creata poi una scheda dedicata quando quella iniziale è passata a un’altra rotta. Nessuna scheda o servizio di altri progetti modificato.

### Interazioni concluse

- Compilazione delle date 10–13 giugno 2027, due ospiti / una camera; invio con Enter sul pulsante. Tre soluzioni a 405 / 465 / 555 €, focus effettivo su `search-feedback`, outline visibile.
- Apertura con Enter dei dettagli camera e del dettaglio prezzi. Pulsante Modifica attivato con Enter: focus sul check-in.
- Cambio a cinque ospiti / due camere: scompaiono i vecchi risultati, stato invita a cercare nuovamente; nuovo risultato con prima combinazione a 960 €. Riprovato anche dopo la correzione delle option, tornando poi a due ospiti / una camera.
- Tab dalla select Camere al pulsante Cerca, Enter con date invertite: riepilogo di errore presente, `aria-invalid=true` e focus effettivo sul check-out.
- Date 5–8 novembre: stato di chiusura; link d’esempio sulla stessa rotta ripristina date e selezioni corrette. Cinque ospiti / cinque camere nel periodo di giugno: nessuna combinazione, distinta dall’errore di validazione.
- Form e tre risultati a 1440, 768, 390 e 320 px: nessun overflow orizzontale, campi dentro il viewport con larghezza positiva, un H1, nessuna immagine completata ma rotta. Ispezionate cattura mobile dei risultati e desktop di modulo/prima soluzione; nessuna modifica visiva necessaria. File locali ignorati in `.playwright-mcp/`.
- Nessun `pageerror` nelle sequenze normali controllate. Gli errori console CSP della prova senza script sono attesi e separati da questo esito.

### Difetto trovato e corretto

Il test del modulo con tutti gli script applicativi bloccati ha mostrato che `value` sulla select non selezionava le option nell’HTML nativo. Il browser inviava un ospite come primo valore, sebbene lo stato iniziale fosse due; analogamente una risposta GET non conservava correttamente le quantità richieste senza ripresa Qwik.

Aggiunto `selected` esplicito alle option di ospiti e camere, derivato dallo stesso draft. Nessun cambiamento al motore, alle tariffe o alle regole. Estesi due test HTTP esistenti per verificare nell’HTML grezzo le opzioni iniziali due/uno e quelle della query cinque/due. Il numero complessivo dei test resta 33.

### GET senza script e limiti della prova

Playwright ha aggiunto temporaneamente `Content-Security-Policy: script-src 'none'` alle sole risposte della disponibilità nella scheda di test, tramite intercettazione locale; nessuna CSP applicativa modificata. Dopo rebuild, controllati valori nativi iniziali due ospiti / una camera, compilate le date e attivato il pulsante: navigazione GET reale con query corretta, tre prezzi attesi e container Qwik ancora `paused`. Secondo invio con cinque ospiti / due camere: importo 960 € e selezioni conservate nella nuova risposta.

Durante questa prova la scheda tornava nascosta e i tentativi di click/Enter non concludevano: l’attivazione finale del pulsante è stata eseguita con `button.click()` dal driver DOM, lasciando il comportamento di invio al browser. È prova del percorso HTML/GET senza JavaScript applicativo, non di un click fisico o di una tastiera nel browser nascosto. Le prove mirate da tastiera sopra sono state concluse separatamente nella scheda visibile. Intercettazione CSP rimossa e pagina ricaricata normalmente al termine.

Non è stato usato un lettore di schermo reale, non è stata validata l’interfaccia nativa del popup calendario né Safari. I test date usano input nativi riempiti da Playwright. Il controllo resta mirato alla milestone, non un audit WCAG completo o la milestone 4.

### Validazione e consegna integrativa

Dopo la correzione: `npm run fmt`, `npm run typecheck`, `npm run lint`, `npm run build` tutti con exit code 0; `npm test` sulla nuova produzione Wrangler: **17 unitari e 16 HTTP passati, zero falliti o saltati**. Confermati SSR e artefatti dell’adapter; sorgenti del motore, dipendenze e configurazioni di hosting invariati. Ripetuta nel browser la transizione due/uno → cinque/due → due/uno dopo la modifica.

Aggiornati README, ARCHITECTURE, DEPLOYMENT, CASE_STUDY, AVAILABILITY_SIMULATOR e WORKLOG per sostituire il blocco iniziale con evidenze effettive e limiti residui. La preview locale viene lasciata attiva a `http://127.0.0.1:8947` per la revisione; non è un deployment.

Commit atomico integrativo `fix: preserve native SSR selections and verify browser flow`, con `git -c commit.gpgsign=false commit`, e push esclusivamente al branch esistente. Nessun merge, rebase, modifica permanente Git, servizio esterno o passaggio alla milestone 4. SHA effettivo nel log e nella consegna.

# Milestone 4A — collaudo tecnico/editoriale e blocco browser

Data: 15 novembre 2026. Ambito richiesto: collaudo dell’intera applicazione sulla build Qwik City SSR in Wrangler locale, correzioni solo per difetti circoscritti, audit dei contenuti e dipendenze. Nessuna nuova funzionalità o revisione generale del design.

## Preliminari e ambiente

Letti AGENTS.md, docs/MVP.md, BRAND_DIRECTION e questo worklog. Working tree pulito su `feature/mvp-foundation`, HEAD iniziale `bf7029f9a70332a69b850d3fd24f3f2fcdfa20b8`. `git fetch origin` e confronto con origin: `0 0`. Nessun nuovo branch, worktree o subagente.

Node 22.16.0, npm 10.9.2, Qwik/Qwik City 1.20.4, Wrangler 4.162.0. Dipendenze già presenti: nessuna reinstallazione necessaria e lockfile invariato. Letta la skill Wrangler e consultata la documentazione ufficiale [Pages locale](https://developers.cloudflare.com/pages/functions/local-development/). Nessun comando remoto, login o configurazione Cloudflare.

La preview 8947 lasciata dalla milestone precedente è stata arrestata e riavviata sulla build appena ricostruita. Su Windows identificati e arrestati solo CLI Wrangler della repository con porta 8947 e binari sotto il percorso assoluto del progetto; nessun processo di altri progetti modificato. Preview finale locale lasciata attiva per revisione a `http://127.0.0.1:8947`.

## Browser: blocco e limite della consegna

Eseguita **una sola richiesta Playwright MCP**, apertura di una nuova scheda sulla Home locale (`browser_tabs`, azione new). La chiamata non ha restituito un risultato ed è stata interrotta. Rispettata la richiesta di non insistere: nessuna serie di tentativi, nessun reset del browser condiviso, CDP, input nativo o sostituzione con servizi di screenshot.

Perciò in **questa milestone** non risultano eseguiti controlli visuali delle sette pagine ai viewport 1440/768/390/320, nuove prove reali di tastiera, focus o stati client, né screenshot desktop/mobile. Non sono dichiarati fallimenti del prodotto: il canale di verifica è bloccato. Le prove browser concluse in milestone 3 restano evidenza storica e non vengono riciclate come collaudo 4A.

Creato `docs/QA_MANUAL.md`: matrice di tutte le pagine e della 404 ai quattro viewport, controlli di overflow, immagini, tipografia, spaziatura, navigazione, zoom, tastiera e ricerca; input/risultati riproducibili; istruzioni senza JavaScript; nomi delle catture ancora da produrre. Tutte le celle visuali sono marcate da eseguire. Accettazione visuale 4A e nuove catture restano aperte.

## Verifiche tecniche e nuovi test

Typecheck e lint eseguiti separatamente: exit code 0, nessun errore o warning lint. Build produzione via `npm run build`: exit code 0; artefatti client, server, worker e routes dell’adapter generati; nessun HTML prerenderizzato. Le note ambiente colore e cache header restano distinte dagli errori tecnici. Log locali ignorati: `.cache/milestone-4a-build.log`, `milestone-4a-unit.log`, `milestone-4a-tests.log`.

Prima esecuzione sulle suite esistenti: 17 unitari + 16 HTTP passati. Aggiunti tre test HTTP mirati in `tests/ssr.test.mjs`:

1. Limiti validi: dodici ospiti/cinque camere, una notte a 765 €; un ospite/una camera con ultimo check-out 1 gennaio 2028; quattordici notti con Lino a 1810 €.
2. Limiti non validi: tredici ospiti, sei camere, più camere che ospiti, date uguali, quindici notti, partenza oltre finestra, parametro duplicato. Errori espliciti e assenza di offerte.
3. Riavvio HTTP della ricerca senza query dopo un risultato: date vuote, messaggio iniziale, nessuna offerta o errore precedente. Questo verifica la risposta SSR, non il reset dello stato client tramite navigazione. Non esiste un pulsante Reset e non ne è stato introdotto uno.

Il nuovo controllo del prezzo per quattordici notti inizialmente presumeva il separatore delle migliaia `1.810,00`; Intl del runtime emette `1810,00`. Importo e notti erano corretti. Reso il matcher compatibile con le due formattazioni, senza cambiare l’importo atteso o il prodotto. Il primo fallimento non è conteggiato come passaggio; l’esecuzione finale è separata e conservata.

Esito finale di `npm test` sulla produzione locale: **17 unitari + 19 HTTP = 36 passati, zero falliti, zero saltati**. Evidenza completa versionata: `docs/qa/milestone-4a/tests.tap.txt`. Le sette pagine rispondono 200 con un H1 e metadati distinti; query valide, errori, assenza disponibilità, selezioni SSR, link/ancore, asset e loro firme, status 404, manifest/worker e assenza di prerender verificati. Riepilogo delle richieste grezze in `http-pages.json`. Nessun mock di HTTP o test CI remoto dichiarato.

Comandi riproducibili:

```powershell
git status --short
git branch --show-current
git fetch origin
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
npm run typecheck
npm run lint
npm run test.unit
npm run build
npm run preview
# Secondo terminale con Wrangler attivo:
npm test
npm audit --json
npm explain sharp
npm explain zod
npm explain minimatch
git diff --check
git diff -- AGENTS.md docs/MVP.md src adapters wrangler.jsonc package.json package-lock.json
```

Un primo comando PowerShell di aggiornamento dei documenti è stato respinto dal parser per un apostrofo tipografico in una stringa; nessuna scrittura di quel comando eseguita. Ripetuto con patch e stringhe appropriate. Nessuna modifica permanente a shell o Git.

## Contrasto e revisione editoriale

Ricalcolati sul codice i rapporti sRGB dei token su fondi uniformi: inchiostro/lino 10,24:1, testo secondario/lino 5,95:1, inchiostro/acqua 6,17:1, bianco/ulivo 4,89:1, errore/lino 7,42:1, errore/fondo errore 7,25:1, focus/lino 5,41:1. Ulivo/lino è 4,46:1 e resta riservato a titoli grandi/grafica; secondario/acqua pieno sarebbe 3,58:1, ma il richiamo su acqua eredita inchiostro. Nessun utilizzo riproducibile da correggere individuato su questi abbinamenti per piccoli testi. Formula, riferimento W3C e limiti in QA_MANUAL. Non sono misure dei gradienti o dei pixel di foto e non certificano la leggibilità effettiva senza browser.

CONTENT_AUDIT esamina tutte le sette pagine sulla base di sorgenti e HTML attuale, con necessità, priorità, proposta e motivazione. Priorità editoriale maggiore: Esperienze, dove tre scene brevi ripetono lo stesso schema; poi differenze concrete fra le camere, specificità/fonti del Territorio e guida d’uso della demo in Contatti. Home e Galleria non richiedono riempitivi; ricerca già completa nei contenuti essenziali. Individuate ripetizioni di lessico e invito condiviso, CTA meno orientata all’azione nelle FAQ. Nessun arricchimento implementato, nessun dato reale inventato.

## Audit dipendenze: rilevanza, non solo conteggi

Ripetuto `npm audit --json`: 12 voci di pacchetto, 8 moderate e 4 high, riferite a cinque advisory propagati anche ai genitori. Report completo in `docs/qa/milestone-4a/npm-audit.json`. Consultati avvisi originali dei manutentori sharp/minimatch e PR/issue Zod, collegati in DEPENDENCY_AUDIT.

Verificato `npm explain` e caricate le versioni native effettive sharp: 0.34.5, libvips 8.17.3, libheif 1.20.2, librsvg 2.61.2; elenco versionato. Distinta la copia sharp 0.35.5 di Miniflare. La catena vulnerabile della toolchain resta installata; l’app serve foto statiche, senza upload, trasformazioni da input utente o endpoint sharp.

Zod 3.25.48 è nel range segnalato e non viene scartato perché v3. Individuato `zodQrl` nel framework, ma nessun uso di validatori Zod/action/body JSON nel codice applicativo: il motore tratta quattro stringhe locali. minimatch 9.0.9/10.2.6 è nelle catene TypeScript ESLint, separato dalla copia 3.1.5; callsite analizzato legato a configurazione di glob locale, senza livello 2 esplicito. Nessun percorso fra query della ricerca e pattern glob.

Ricerca testuale dei marker ZodArray/ZodError/zodQrl/imagetools/VipsForeign/Minimatch nell’output server/client: zero corrispondenze. È un indizio coerente con il tree shaking e la separazione del tooling, non una prova formale di sicurezza. Rilevanza, condizioni, limitazioni e procedura riproducibile documentate; tutte le segnalazioni restano aperte. Nessun audit fix, override o downgrade; non adottate le proposte automatiche incompatibili con lo stack. Nessuna autorizzazione di sicurezza al deploy implicita nei test verdi.

## Modifiche e consegna

Nessun difetto applicativo nuovo riprodotto nelle verifiche possibili: **nessuna modifica a src, design, routing, motore, inventario, adapter o configurazione hosting**. Modificati solo test e documentazione/evidenze. Preservati AGENTS.md, docs/MVP.md, package.json e lockfile.

Creati CONTENT_AUDIT, QA_MANUAL, DEPENDENCY_AUDIT e quattro file di evidenza in `docs/qa/milestone-4a/`. Aggiornati README, ARCHITECTURE, DEPLOYMENT, CASE_STUDY, AVAILABILITY_SIMULATOR e WORKLOG per stato e conteggi correnti. BRAND_DIRECTION e ASSETS invariati. Nessuno screenshot nuovo disponibile e nessun file immagine simulato.

Consegna con commit atomico dei tre nuovi test SSR e commit separato per audit/documentazione/evidenze, sul solo branch corrente. Commit test: `95a4c8ee9f394425699803bc3b24681fb16ed7ea` (`test: cover SSR search limits and fresh search state`). GPG disattivato soltanto per ciascun comando:

```powershell
git -c commit.gpgsign=false commit -m 'test: cover SSR search limits and fresh search state'
git -c commit.gpgsign=false commit -m 'docs: record milestone 4A audits and browser verification block'
git push origin feature/mvp-foundation
git status --short
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
```

SHA effettivi nel log e nella consegna. Nessun merge, rebase, force push, deploy, DNS, Access, secret, CI o billing. Il lavoro si ferma alla consegna tecnica/editoriale 4A con blocco visuale esplicito; nessuna fase successiva avviata.

# Integrazione 4A — collaudo Playwright e chiusura sequenziale

15 novembre 2026. Su richiesta del proprietario ripreso il collaudo browser: il blocco descritto sopra è storico, non lo stato attuale. Riletti AGENTS, MVP, BRAND_DIRECTION, WORKLOG e DEPLOYMENT. Branch `feature/mvp-foundation`, base `387352853647351e7c90f93a6ef8a618e335c61f`; codice applicativo servito `bf7029f9a70332a69b850d3fd24f3f2fcdfa20b8`. I commit successivi riguardavano test/documenti. Nessuna modifica estranea: i file non tracciati iniziali erano report/catture della stessa sessione.

## Runtime, scheda e verifiche effettive

Riutilizzata esclusivamente la produzione Wrangler di proprietà della sessione sulla porta 8947. Home HTTP 200 verificato prima di Playwright. Dopo l’interruzione la scheda corrente MCP non era questa applicazione: controllato URL senza navigare quella pagina, poi aperta una scheda dedicata al progetto. Origine e viewport controllati prima delle sequenze. Nessun secondo runtime, subagente o worktree.

La ripresa precedente all’ultima istruzione aveva già completato **48 combinazioni DOM e 25 scenari funzionali**, conservati nel report del driver; esportati senza ripeterli. Nell’esecuzione esclusiva completato il percorso ancora privo di prova tastiera: GET con Enter senza script applicativi. Totale **26 scenari funzionali passati**.

- 48 combinazioni: sette pagine e 404, più ricerca valida/errore/chiusura/nessuna combinazione, ciascuna a 1440/768/390/320 px, altezza 900 CSS. Status atteso, un H1, immagini decodificate con alt, CTA nei limiti e nessun overflow orizzontale del documento. Catture esaminate per gerarchia, spaziature, leggibilità e immagini, con il limite di paint a 390 descritto sotto.
- Ricerca: date vuote/uguali/invertite, durata oltre limite, più camere che ospiti, errori/focus, determinismo, importi 405/465/555 €, combinazioni 5/2 a 960/1020 €, massimo 12/5 a 765 €, ultimo check-out 1 gennaio 2028, quattordici notti a 1810/2090 €, chiusura e nessuna combinazione.
- Interazioni: modifica dei campi elimina offerte obsolete; Modifica riporta al check-in; dettagli/importi Enter, tabella quattordici notti a 320 senza overflow del documento. Link esempio, rotta senza query con date vuote e default 2/1, indietro/avanti. Skip link, menu mobile Enter/Tab/Escape e ritorno focus, ancore Galleria/camera, cinque FAQ Spazio/Enter. Non aggiunto Reset: riavvio tramite rotta pulita.
- Senza script: CSP temporanea `script-src 'none'` soltanto dal driver sulle risposte disponibilità. Prima prova con attivazione DOM e conservazione 5/2. Nell’integrazione esclusiva **Enter su submit** invia il GET, query giugno 10–13 / 2/1, prezzo 405 € presente e Qwik `paused`. Intercettazione rimossa nel finally; nessuna CSP applicativa modificata.
- Movimento ridotto: scroll da smooth ad auto, preferenza ripristinata. Colori computati coerenti con i token già calcolati. Contrasto sulle foto esaminato visualmente, senza misura pixel per pixel o certificazione WCAG.

Report in `docs/qa/milestone-4a/browser-results.json`; **52 JPEG** (48 estese, tre hero viewport e un dettaglio prezzi viewport), indice SCREENSHOTS.md e manifest SHA-256. Catture reali, nessun nuovo asset fotografico; licenze esistenti in ASSETS. I parametri non selezionabili (13 ospiti, 6 camere, date inesistenti, query duplicate) restano coperti dagli HTTP/unitari, senza attribuirli a nuovi invii client.

## Problemi del driver/browser e limiti residui

Nessun nuovo bug applicativo riprodotto, nessun pageerror inatteso nelle sequenze registrate; CSP e 404 intenzionali distinti dagli errori applicativi. Nessuna modifica a sorgenti, stile, inventario, dipendenze, lockfile o hosting.

1. Dopo il primo blocco storico di browser_tabs, browser_navigate ha risposto. Nella ripresa esclusiva il contesto isolato è stato rifiutato immediatamente con `Target.createBrowserContext: Not allowed`; la scheda ordinaria dedicata ha funzionato. Non è un timeout MCP o un difetto del sito.
2. I primi Enter in documento nascosto non sono conteggiati come passati; le sequenze riuscite portano la scheda in primo piano prima/dopo l’input. Il nuovo GET senza script ha avuto un timeout locator del driver: cercava “Cerca disponibilità” anziché “Cerca disponibilità demo”. Corretto il selettore submit, Enter è passato. Nessun tentativo ripetuto su un servizio non rispondente.
3. Alcune catture estese mostravano immagini decodificate ma non dipinte. Home 768 ricatturata scorrendo ogni immagine e nuovamente esaminata; hero 320/390/768 con supplementi corretti. **Home estesa 390 conserva un artefatto nelle foto inferiori panorama/uliveto**: il DOM le dà caricate, ma quella cattura non prova la resa dei loro pixel. Le stesse sezioni sono visibili a 320/768. Limite esplicito nell’indice, senza modificare l’app o dichiarare completo quel dettaglio visuale.
4. Non eseguiti popup calendario di sistema, lettore di schermo reale, Safari/Firefox, dispositivi fisici e zoom browser reale 200%. Date riempite nei controlli nativi da Playwright. Sono limiti del collaudo mirato, non blocchi MCP. Piccoli crediti restano possibile affinamento, senza difetto accertato dal solo font-size.

L’import dinamico fs non è supportato nel driver: esportato il JSON restituito dallo strumento. Una patch con due operazioni sullo stesso file è stata rifiutata e sostituita con un update valido. Uno script documentale con backtick non escapati è stato respinto dal parser prima delle scritture, poi sostituito con patch. Nessun fallimento del tooling conteggiato come test del prodotto superato.

## Documentazione, verifiche e rilascio delle risorse

Aggiornati README, ARCHITECTURE, AVAILABILITY_SIMULATOR, DEPLOYMENT, CASE_STUDY, CONTENT_AUDIT e QA_MANUAL per lo stato corrente. Cronologia del blocco preservata sopra. Opportunità editoriali soltanto documentate; audit dipendenze invariato, nessun aggiornamento forzato. AGENTS/MVP invariati.

Typecheck, lint, build produzione e **36 test (17 unitari + 19 HTTP)** erano già passati su questo stesso codice. Non ripetuti nella ripresa esclusiva, come richiesto: cambiano solo documenti/evidenze. Controllati integrità JSON/conteggi/manifest, link, `git diff --check` e assenza di modifiche a sorgenti/configurazioni/lockfile.

Chiusa solo la scheda dedicata, rimosse intercettazioni e ripristinata la preferenza movimento. Ctrl+C alla preview ha lasciato un figlio sulla porta: verificati PID già identificati e percorso assoluto sotto node_modules di questa repository, arrestato il CLI proprietario; figli terminati e nessun listener rimasto su 8947. Nessun processo browser o progetto esterno arrestato. **Playwright MCP liberato per la sessione successiva**; nessuna ulteriore chiamata browser dopo la chiusura.

Consegna atomica di soli documenti/evidenze, dopo confronto remoto; SHA finale nel log Git e nel resoconto:

```powershell
git diff --check
git fetch origin
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
git -c commit.gpgsign=false commit -m 'docs: complete sequential Playwright QA and capture evidence'
git push origin feature/mvp-foundation
git status --short
git rev-list --left-right --count HEAD...origin/feature/mvp-foundation
```

Nessun merge, rebase, deployment, CI, servizio Cloudflare o fase successiva. Rollback documentale mediante revert, senza riscrittura della storia.
