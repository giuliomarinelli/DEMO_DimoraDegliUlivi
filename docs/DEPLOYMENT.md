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
