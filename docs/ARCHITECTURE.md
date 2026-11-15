# Architettura — milestone 3

## Rendering

Qwik 1.20.4 e Qwik City 1.20.4, release stabili corrispondenti. `src/entry.ssr.tsx` usa `renderToStream`; `root.tsx` monta `QwikCityProvider`, head, body e `RouterOutlet`. Le pagine pubbliche sono renderizzate dal server a ogni richiesta, incluse le rotte interne.

L’entry `src/entry.cloudflare-pages.tsx` usa `createQwikCity` del middleware ufficiale. L’adapter `cloudflarePagesAdapter` estende la configurazione Vite di Qwik: nessun prerender o fallback SPA. Tutte le rotte sono escluse dalla generazione statica (`include: []`, `exclude: ["/*"]`), senza 404 statico né sitemap; un solo worker di build evita processi inutili. Nella versione 1.20.4, `ssg: null` impedisce anche gli hook che generano `_worker.js` e `_routes.json`, perciò non viene utilizzato. Il risultato è Pages Functions in modalità avanzata (`dist/_worker.js`), non un backend business separato.

Percorso richiesta: browser → runtime Pages → worker Qwik City → risoluzione file-based della rotta → HTML con contenuto e SEO. Gli asset statici sono serviti dal runtime Pages; i moduli Qwik consentono la ripresa delle interazioni nel browser.

`entry.dev.tsx` ed `entry.preview.tsx` sono entry di compatibilità dello scaffold Qwik: la prima è per il tooling di sviluppo, la seconda per l’anteprima Vite alternativa. Il comando `npm run dev` seleziona la modalità SSR e `npm run preview` usa Wrangler Pages, non l’entry Node di anteprima. La produzione usa soltanto l’adapter Cloudflare configurato.

## Organizzazione

```text
adapters/cloudflare-pages/vite.config.ts
src/
  components/
    availability-search/ Modulo, errori, risultati e importi della ricerca
    brand/             Marchio originale e ramo d’ulivo
    page-intro/        Impaginazione delle introduzioni interne, con Slot
    photo/             Immagini locali, dimensioni, srcset e caricamento
    stay-invitation/   Invito condiviso alla disponibilità demo
    router-head/       Metadati DocumentHead, robots e canonical opzionale
    site-header/       Navigazione desktop e menu mobile
    site-footer/       Navigazione secondaria, avviso demo e attribuzioni
  lib/availability.ts  Motore puro, inventario e regole deterministiche
  data/site.ts         Link e dichiarazione condivisa della demo
  data/editorial.ts    Concetti editoriali di camere ed esperienze
  data/photos.ts       Registro tipizzato delle foto e dei crediti
  routes/
    layout.tsx         Header, main, footer
    index.tsx          Homepage editoriale
    camere/index.tsx
    esperienze/index.tsx
    territorio/index.tsx
    galleria/index.tsx
    disponibilita/index.tsx
    contatti/index.tsx
    [...not-found]/index.tsx  Catch-all SSR con status 404
  entry.dev.tsx        Sviluppo Qwik
  entry.ssr.tsx        Rendering HTML italiano
  entry.cloudflare-pages.tsx
  global.css           Tailwind 4, tema e componenti visivi
public/                Fotografie WebP locali, favicon, robots, header statici
tests/availability.test.mjs  Regole, notti, occupazione e importi
tests/ssr.test.mjs      Contratto HTTP della build di produzione
wrangler.jsonc         Solo configurazione del runtime Pages
```

## API Qwik e navigazione

Componenti `component$`, composizione `Slot`, link `Link` e posizione reattiva `useLocation` di Qwik City. Il menu mobile usa un elemento nativo `details/summary`: funziona anche senza JavaScript. Un riferimento DOM con `useSignal` e handler `$` ne permettono la chiusura con Escape e dopo la navigazione, senza duplicare lo stato nativo `open`. Non sono presenti React, React Router o integrazioni React. `jsx: react-jsx` in tsconfig è il nome dell’emissione JSX di TypeScript; `jsxImportSource: @builder.io/qwik` indirizza il runtime a Qwik.

L’header marca la pagina corrente con `aria-current`. Il layout offre salto al contenuto, landmark semantici e focus visibile. Il menu non è modale e non intrappola il focus. Movimento ridotto rispettato tramite media query. Verifiche effettive e relativi limiti nel worklog.

## Stile e contenuti

Tailwind CSS 4 via plugin ufficiale Vite, token `@theme` e componenti `@layer` con `@apply`. Poche regole CSS specifiche gestiscono ritaglio, focus e preferenze di movimento. Palette acqua `#A7C6C6`, lino `#FAF4E7`, miele `#B9834E` e verde ulivo `#65765B`, con colori scuri di supporto per la leggibilità. Hero a tutta larghezza, serif di sistema, fotografie locali e marchio originale conservato. Direzione e contrasti documentati in BRAND_DIRECTION.

Tutti i testi sono locali e identificano l’azienda come immaginaria. `editorial.ts` contiene i racconti delle tre camere e delle esperienze; gli ID camera usano il tipo `RoomId` del motore. Quantità, capienze, tariffe e occupazioni sono definite esclusivamente in `lib/availability.ts` e mostrate anche nella pagina Camere. Nessuna API business, database, autenticazione, modulo di contatto, pagamento o analytics.

`Photo` legge un registro tipizzato delle otto fotografie: sorgente locale, dimensioni, testo alternativo, autore, fonte e provenienza. La hero usa due varianti locali tramite `srcset`; l’immagine principale ha priorità alta, le altre caricamento differito. Nessuna trasformazione immagini o richiesta terza a runtime. La Galleria espone crediti e provenienze, comprese le ispirazioni di interni fuori Toscana. `StayInvitation` unifica il richiamo al simulatore attivo, con natura dimostrativa dichiarata. FAQ e categorie della galleria usano rispettivamente `details/summary` e ancore native, senza JavaScript aggiuntivo.

## SEO e ambiente

Ogni pagina esporta `DocumentHead` con titolo e descrizione distinti. Lingua HTML `it`, viewport e favicon nel server HTML. `PUBLIC_SITE_ORIGIN` è opzionale e pubblico, non un segreto: solo se configurato genera canonical dal pathname, senza query string. Senza dominio approvato il canonical è omesso. `noindex, nofollow` e `robots.txt` impediscono l’indicizzazione collaborativa; non sono controlli di accesso.

## Dipendenze e test

npm unico package manager; lockfile committato. Le librerie Qwik rimangono in devDependencies secondo lo scaffold: Vite le incorpora nell’artefatto server e nel client; l’ambiente di build deve installare anche le devDependencies. TypeScript strict include sorgenti, configurazioni e adapter. ESLint 9 applica regole TypeScript e Qwik, incluso il motore in `src/lib`: esclusioni lint/Prettier limitate alla directory di output `lib` in radice.

Test runner nativo Node, senza nuove dipendenze: 17 test unitari compilano il motore tramite `tests/tsconfig.json` in `.cache/availability-tests/`, con TypeScript strict e senza framework/browser. I 16 test HTTP interrogano Wrangler locale: HTML e metadati sulle sette rotte, asset, link, crediti, 404, worker/manifest senza prerender, modulo GET e query con risultati/errori/nessuna disponibilità. Controllano inoltre etichette, descrizioni ARIA, errori, regione live e intestazioni delle tabelle. `npm run test.unit` è autonomo; `npm run test.ssr` richiede build e preview; `npm test` esegue entrambe le suite. Nessuna dipendenza, lockfile o configurazione di hosting modificata in milestone 3. Queste verifiche non dimostrano l’esecuzione degli handler client o il focus effettivo: limiti browser nel worklog.

Riferimenti consultati: [adapter Qwik City](https://qwik.dev/docs/deployments/cloudflare-pages/), [Tailwind per Qwik](https://qwik.dev/docs/integrations/tailwind/), [Pages locale](https://developers.cloudflare.com/pages/functions/local-development/). Le configurazioni effettive sono quelle versionate; non usare i vecchi esempi Node delle guide come requisito del progetto.


## Simulatore condiviso — milestone 3

`lib/availability.ts` espone inventario locale, parser di date civili UTC, validazione, occupazione per unità fisica, combinazioni miste e prezzi in centesimi. Non legge orologio, numeri casuali, rete o storage. Cinque camere / dodici posti, finestra 2027, massimo quattordici notti. Le stesse unità devono restare libere per tutto il soggiorno. Regole esatte, assunzioni e query in [AVAILABILITY_SIMULATOR.md](AVAILABILITY_SIMULATOR.md).

Il `routeLoader$` della rotta disponibilità interpreta la query e produce lo stato iniziale. Il modulo HTML GET funziona anche senza script: la nuova richiesta viene renderizzata dal medesimo worker SSR. È inizializzazione della pagina con dati locali, non un servizio business separato o un’azione di prenotazione.

`AvailabilitySearch` usa `useStore` per i campi, `useSignal` per esito, stato modificato e riferimenti DOM, handler `$` per aggiornamenti/invio e `useTask$` per sincronizzare nuovi dati del loader durante navigazioni sulla stessa rotta. L’invio con JavaScript legge `FormData` e calcola localmente, senza chiamate API. Non aggiorna l’URL e non persiste ricerche; una ricarica ripristina la query originaria. Cambiare un campo rimuove l’esito precedente, evitando offerte relative a criteri diversi.

Errori per campo e riepilogo con ancore, `aria-invalid` esplicito, etichette/aiuti, stato live, focus al primo errore o alla sezione esito nell’invio avanzato. Dettagli camere e tabelle prezzi usano HTML nativo. La CSS responsive estende palette e spaziatura esistenti, con una/due/quattro colonne per i campi. Nessuna modifica alla hero fotografica o alle licenze.

Riferimenti aggiuntivi: [routeLoader Qwik City](https://qwik.dev/docs/route-loader/), [task Qwik](https://qwik.dev/docs/core/tasks/).
