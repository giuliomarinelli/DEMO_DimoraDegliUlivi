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
