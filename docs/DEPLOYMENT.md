# Build e hosting previsto — nessun deployment eseguito

## Prerequisiti e confini

Node.js 22.16+ nella serie 22 o Node.js 24+, npm, Git, Windows/PowerShell oppure un ambiente compatibile. In questa milestone tutto si svolge in locale: non servono account Cloudflare, login, token, secrets o servizi business. `wrangler.jsonc` non contiene account ID, bindings remoti o risorse da creare. Il nome `dimora-degli-ulivi-demo` è un identificatore locale di configurazione, non prova di un progetto Cloudflare esistente.

Nessuna configurazione DNS, Access, CI, secret o billing è stata modificata. Il deploy reale è riservato al proprietario e richiede una richiesta distinta. Non esiste uno script npm `deploy` in questa fondazione.

## Riprodurre le verifiche

Dalla radice della repository, sul branch di lavoro:

```powershell
node --version
npm --version
npm ci
npm run typecheck
npm run lint
npm run test.unit
npm run build
npm run preview
```

Non eseguire `npm ci --omit=dev`: il compilatore e il framework sono dipendenze di build. `npm run preview` esegue `wrangler pages dev ./dist --ip 127.0.0.1 --port 8947`, con runtime locale e metriche CLI disattivate nel file di configurazione. Nessun `--remote`, nessun binding remoto. La prima esecuzione può scaricare i binari necessari durante l’installazione npm.

In un secondo terminale:

```powershell
npm test
(Invoke-WebRequest http://127.0.0.1:8947/).Content
(Invoke-WebRequest http://127.0.0.1:8947/camere/).Content
```

L’HTML deve contenere l’H1, la descrizione della pagina e la dichiarazione della demo senza eseguire JavaScript. `npm test` automatizza il controllo su tutte e sette le rotte, oltre a link, asset e status 404. Una richiesta HTTP è una verifica SSR; non basta vedere la pagina dopo la navigazione client-side.

Per una porta alternativa, avviare il comando Wrangler locale con quella porta e impostare, nel terminale dei test:

```powershell
$env:SSR_TEST_ORIGIN = 'http://127.0.0.1:8790'
npm test
Remove-Item Env:SSR_TEST_ORIGIN
```

La variabile è solo una destinazione dei test, non configurazione applicativa. Arrestare il server locale con `Ctrl+C`.

## Artefatti attesi

`npm run build` esegue compilazione client, typecheck, lint e build server dell’adapter. Output in `dist/`:

- `build/`: moduli Qwik per la ripresa delle interazioni.
- `assets/`: CSS e grafo dei bundle.
- `q-manifest.json`: manifest usato dalla pipeline Qwik.
- `_worker.js`: entry server Pages Functions e moduli associati dell’adapter.
- `_routes.json`: instradamento del runtime generato dall’adapter.
- Immagini, favicon e file pubblici copiati da `public/`.

`server/` contiene i moduli importati dall’entry `_worker.js`: serve a Wrangler e non va eliminato prima della preview. `dist/`, `server/`, cache Wrangler e node_modules sono ignorati da Git. Non vengono prerenderizzate pagine: `include: []` ed `exclude: ["/*"]` escludono tutte le rotte; `emit404Pages: false` e `sitemapOutFile: null` evitano anche 404 statico e sitemap. Il catch-all è SSR con status 404. Il log dell’adapter può nominare la propria fase SSG: non deve elencare pagine generate. Non usare un semplice server statico per validare questa applicazione.

## Configurazione futura, solo a cura del proprietario

La destinazione prevista è **Cloudflare Pages**, con comando build `npm run build` e directory output `dist`. Il worker generato abilita SSR tramite Pages Functions advanced mode. Node dell’ambiente di build dovrà corrispondere a una versione ammessa dal package.json.

Flusso Git previsto: `master` produzione, `preview` staging protetto da Access, `develop` integrazione senza promozione automatica. L’attivazione di integrazioni Git potrebbe avviare deployment: non è stata eseguita. Verificare eventuali automazioni preesistenti prima di configurare la pubblicazione; il push di questa milestone riguarda solo il branch feature richiesto.

Non è configurato un dominio pubblico. Dopo approvazione del proprietario, `PUBLIC_SITE_ORIGIN` potrà contenere l’origine HTTPS reale (protocollo e hostname, senza path o credenziali) nell’ambiente di build. È una variabile pubblica, non un secret; il codice genera il canonical per ogni pathname. Finché manca, il tag non viene emesso. I metadati titolo e descrizione sono sempre presenti. Le direttive `noindex` restano attive per questa demo; Access resta un’attività separata del proprietario.

## Rollback riproducibile

Prima di qualsiasi ripristino verificare `git status --short` e salvare eventuali modifiche locali. Per annullare in seguito un commit della milestone, usare `git revert <SHA>` sul branch che lo contiene, previa richiesta del proprietario per operazioni su branch diversi da quello di lavoro. Il revert crea un nuovo commit e non riscrive la storia; non sono necessari reset, force push, merge o rebase. Eseguire di nuovo installazione, verifiche e build dopo il ripristino. Nessun rollback remoto è necessario oggi, perché non c’è stato un deploy.

Riferimenti: [Qwik City Cloudflare Pages](https://qwik.dev/docs/deployments/cloudflare-pages/), [runtime Pages locale](https://developers.cloudflare.com/pages/functions/local-development/), [Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/).

## Aggiornamento milestone 2

Comandi, adapter, runtime e confini di deployment invariati. Nessuna modifica a package.json, lockfile, configurazione Wrangler, DNS, Access, CI o secrets. La build include le nuove fotografie locali e le sette pagine editoriali; il test HTTP verifica anche crediti, ancore e srcset. Non servono servizi di prenotazione né configurazioni aggiuntive. Per la verifica visiva scorrere le pagine, attendere le immagini lazy e provare header/Disponibilità, menu e FAQ da tastiera. La milestone non introduce calendario o ricerca.

Il rollback della milestone 2 segue la procedura di revert sopra, iniziando dai commit della milestone più recenti e rispettando le modifiche successive. Gli SHA effettivi sono nel log di `feature/mvp-foundation`; non usare reset o force push. Non è previsto un rollback remoto Cloudflare perché non è stato eseguito un deployment.


## Aggiornamento milestone 3

Adapter, configurazione Wrangler e dipendenze restano invariati. Cambiano gli script di test, senza modificare il lockfile: `npm run test.unit` esegue i 17 test del motore anche senza server; `npm run test.ssr` esegue 19 controlli HTTP con la preview già attiva; `npm test` esegue entrambi. La nuova compilazione isolata dei test scrive solo nella cache ignorata da Git.

Per verificare direttamente risultati significativi nella risposta di produzione, nel secondo terminale:

```powershell
(Invoke-WebRequest 'http://127.0.0.1:8947/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1').Content
```

L’HTML contiene tre soluzioni e importi 405,00 / 465,00 / 555,00 €, oltre a titolo e descrizione; non occorre eseguire JavaScript. Il normale modulo GET produce lo stesso percorso. Nessun binding, account, login o servizio di disponibilità esterno. Inventario, chiusure e calendario sono nel codice, non in un ambiente Cloudflare: vedere AVAILABILITY_SIMULATOR.

Il rollback segue il revert già descritto, dai commit più recenti della milestone, senza riscrivere la storia. Nessuna operazione di rollback o deployment è stata eseguita. Dopo il primo blocco Playwright, verifica browser mirata del flusso, tastiera e responsive completata su richiesta; corretta anche la selezione delle option SSR nel percorso senza script. Evidenze e limiti nel worklog; procedura manuale nel documento del simulatore.


## Collaudo 4A

Configurazione Pages, adapter e lockfile invariati. Typecheck, lint, build e 36 test (17 unitari + 19 HTTP) superati sulla produzione locale. Aggiunti controlli su estremi di capienza/durata/date, query non valide o duplicate e riapertura della ricerca senza query. Evidenze versionate in `docs/qa/milestone-4a/`.

Il blocco iniziale è stato superato su richiesta del proprietario. Playwright ha completato 48 controlli pagina/stato/viewport e 26 scenari funzionali sulla produzione locale, con 52 catture. Nessun difetto applicativo nuovo riprodotto. La ripresa esclusiva ha riutilizzato la preview di proprietà della sessione dopo HTTP 200, aperto una scheda dedicata e completato il GET con Enter senza script applicativi. A fine collaudo scheda e processi locali della repository sono stati chiusi, porta 8947 liberata; nessun processo browser condiviso arrestato. Esiti e riproduzione in [QA_MANUAL.md](QA_MANUAL.md), [catture](qa/milestone-4a/SCREENSHOTS.md), limiti e cronologia in WORKLOG; dipendenze in DEPENDENCY_AUDIT.

Il collaudo non autorizza deployment o modifiche Cloudflare. Rollback dei soli test/documenti/evidenze 4A mediante revert, come sopra; nessuna modifica applicativa da ripristinare.

## Contenuti 4B

La milestone 4B modifica soltanto presentazione e testi di Camere, Esperienze, Territorio e Contatti. Dipendenze, comandi, configurazione Pages e motore invariati. Validazione con build produzione, suite locali esistenti e HTTP su Wrangler alla porta 8947; esiti nel worklog. Nessun Playwright MCP, nuovo E2E, servizio remoto o deployment. Per un rollback, revert dei commit 4B dal più recente, preservando eventuali modifiche successive, quindi eseguire gli stessi controlli locali; nessuna operazione Cloudflare necessaria.
