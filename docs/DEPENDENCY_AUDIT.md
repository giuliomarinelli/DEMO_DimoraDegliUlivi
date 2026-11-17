# Dipendenze segnalate — verifica milestone 4A

Data: 15 novembre 2026. Analisi del lockfile invariato su `feature/mvp-foundation`, base `bf7029f9a70332a69b850d3fd24f3f2fcdfa20b8`. Nessun aggiornamento, override, downgrade o `npm audit fix` eseguito.

## Esito e fonti locali

`npm audit --json`: **12 voci di pacchetto interessate, 8 moderate e 4 high**, zero critical. Sono cinque advisory nel report (tre per sharp, uno Zod, uno minimatch), propagati anche ai pacchetti genitori: non dodici vulnerabilità indipendenti o dodici CVE.

Evidenze versionate:

- [Report npm completo](qa/milestone-4a/npm-audit.json): range, catene, advisory e proposte automatiche.
- [Versioni native sharp effettivamente caricate](qa/milestone-4a/sharp-versions.json).
- [Risultati dei test](qa/milestone-4a/tests.tap.txt) e [risposte delle sette pagine](qa/milestone-4a/http-pages.json).

I pacchetti sono marcati dev nel lockfile, ma questo **non basta** a escludere rischio runtime: Qwik City è anch’esso una devDependency e viene incorporato nella build server. La valutazione seguente usa anche sorgenti, modalità d’impiego e output della build.

## Rilevanza delle famiglie

| Famiglia | Versioni/catena installate | Superficie effettiva osservata | Valutazione nel progetto attuale |
| --- | --- | --- | --- |
| sharp e librerie native | Qwik City 1.20.4 → vite-imagetools 9.0.3 → sharp 0.34.5 | Plugin immagini della toolchain; nessun upload, endpoint immagini o import `?jsx` nell’app | Versione realmente interessata. Rischio di tooling/asset da mantenere aperto; nessun percorso di decodifica di immagini dell’utente nelle richieste SSR |
| Zod | Qwik City 1.20.4 → zod 3.25.48 | Qwik City espone i validatori Zod, ma l’app usa un motore puro su quattro stringhe e non li invoca | Range npm interessato; nessun percorso applicativo verso validazione Zod di array/collezioni provenienti dall’utente individuato |
| minimatch | Catene TypeScript ESLint, copie 9.0.9 e 10.2.6; copia ESLint 3.1.5 separata | Elaborazione locale di glob/file durante lint e parsing, nessun uso nelle rotte | Rischio tooling/configurazione; le richieste pubbliche non forniscono pattern al parser. La copia 3.1.5 non rientra in questo advisory |

Queste sono conclusioni di **raggiungibilità sul codice attuale**, non exploit testati o certificazioni di sicurezza. Nessuno stress test distruttivo eseguito. Tutte le segnalazioni restano nel report npm e richiedono una revisione prima di pubblicare o introdurre nuove superfici di input.

### sharp: librerie native e asset

Caricato il modulo installato con Node, senza elaborare immagini: sharp **0.34.5**, libvips **8.17.3**, libheif **1.20.2**, librsvg **2.61.2**. Le versioni effettive sono quindi rilevanti, non soltanto un nome presente nel lockfile. I tre avvisi del manutentore riguardano [libvips, corretto da sharp 0.35.0](https://github.com/lovell/sharp/security/advisories/GHSA-f88m-g3jw-g9cj), [libheif, corretto da 0.35.4](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c) e [librsvg, corretto da 0.35.5](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w). Le condizioni e i sistemi interessati variano; il collaudo locale è Windows, l’eventuale ambiente di build remoto non è stato collaudato.

Nel progetto `Photo` rende URL di asset già presenti in `public/images`; non trasforma contenuti forniti dal visitatore. In `node_modules/@builder.io/qwik-city/lib/vite/index.mjs` il plugin `imagePlugin` carica vite-imagetools nella toolchain. Nessun import applicativo con direttive di trasformazione trovato. I file pubblici sono serviti come asset statici; le Pages Functions non espongono un servizio sharp. L’assenza di upload e trasformazioni runtime riduce la superficie utilizzata, senza sanare la dipendenza installata o garantire la sicurezza di futuri asset non fidati.

Wrangler/Miniflare installa anche una copia separata sharp **0.35.5**, non la 0.34.5 riportata come vulnerabile nella catena Qwik City. Non sono intercambiabili e la copia recente non corregge automaticamente quella precedente.

### Zod: non scartare la segnalazione perché si usa v3

L’advisory npm include versioni `<4.6.6`; la dipendenza effettiva 3.25.48 rientra nel range. La correzione upstream delle collezioni è descritta nella [PR Zod v4 #6652](https://github.com/colinhacks/zod/pull/6652); la [segnalazione specifica v3 #6653](https://github.com/colinhacks/zod/issues/6653) conferma che non si può considerare v3 automaticamente esclusa. L’accumulo di errori su collezioni molto grandi può consumare risorse; le condizioni dipendono dallo schema e dalla versione.

Qwik City importa Zod in `lib/index.qwik.mjs`; `zodQrl` costruisce lo schema e richiama `safeParseAsync` quando il validatore è usato. Nell’app non esistono `zod$`, `zodValidator$`, action con schema, parsing di body JSON o array validati da Zod. `routeLoader$` legge i quattro parametri query e chiama `initialSearch`/`validateSearch` locali. Non è stato individuato un percorso pubblico verso il validatore interessato. Non applicato un override Zod 4 alla dipendenza attesa Zod 3 del framework: richiederebbe verifica di compatibilità separata.

### minimatch: distinguere glob di tooling e input ospiti

L’[advisory del manutentore](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249) descrive amplificazione di glob con `optimizationLevel >= 2`; il database npm propaga il range `>=7.0.0 <11.0.1`. Le copie 9.0.9 e 10.2.6 sono nelle catene TypeScript ESLint; la copia ESLint 3.1.5 resta distinta.

Nel callsite esaminato, `@typescript-eslint/typescript-estree/dist/useProgramFromProjectService.js`, il pattern proviene dalla configurazione `allowDefaultProject` e le opzioni passate sono `{ dot: true }`, senza livello 2 esplicito. Questo non verifica ogni callsite transitivo, ma non c’è uso di minimatch nelle rotte né un collegamento tra parametri ospiti/date e glob. Resta un tema di tooling quando si valutano repository o configurazioni non fidate.

## Controlli sull’output e loro limite

La ricerca dei marker `ZodArray|ZodError|zodQrl|imagetools|VipsForeign|Minimatch` in `server/` e `dist/build/` della build corrente non ha trovato corrispondenze. È coerente con rimozione del codice non usato e separazione dal tooling, ma una ricerca testuale **non prova** l’assenza di qualunque codice rinominato o vulnerabilità. La conclusione di mancata raggiungibilità si basa soprattutto sull’assenza dei flussi applicativi descritti sopra.

Non è stato usato `npm audit --omit=dev` come prova di sicurezza del server. Il sito continua a richiedere le dipendenze di build; non va eliminato il framework dalla build per far sparire il report.

## Riproduzione senza cambiare dipendenze

Dalla radice, con node_modules installato dal lockfile:

```powershell
npm audit --json
npm explain sharp
npm explain zod
npm explain minimatch
node --input-type=module -e "import sharp from 'sharp'; console.log(JSON.stringify(sharp.versions, null, 2))"
rg -n 'zod|zodValidator|zodQrl|imagetools' src vite.config.ts node_modules/@builder.io/qwik-city/lib/index.qwik.mjs node_modules/@builder.io/qwik-city/lib/vite/index.mjs
rg -n 'minimatch|optimizationLevel' node_modules/@typescript-eslint/typescript-estree/dist --glob '*.js'
rg -l 'ZodArray|ZodError|zodQrl|imagetools|VipsForeign|Minimatch' server dist/build
```

`npm audit` restituisce normalmente exit code 1 quando trova vulnerabilità; non equivale a un errore di typecheck o build. `rg` restituisce 1 quando non trova corrispondenze. Nessun comando sopra aggiorna il lockfile. Per ripetere l’analisi della build servono prima `npm run build` e le directory generate.

## Decisione di 4A

Nessuna correzione automatica applicata. Il report propone fra l’altro Qwik City `0.0.128` e versioni precedenti di plugin/tooling: applicarle ciecamente comprometterebbe lo stack concordato. Anche una patch transitiva va verificata con framework, adapter, build e SSR.

La manutenzione compatibile delle catene resta un’attività distinta, con riesame dell’audit e delle superfici dopo ogni aggiornamento. Nessuna voce è stata dichiarata un falso positivo o rimossa dal conteggio. Questa milestone non è un’approvazione di sicurezza per un deployment.
