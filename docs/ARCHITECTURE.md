# Architettura — milestone 1

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
    brand/             Marchio originale e ramo d’ulivo
    page-intro/        Impaginazione delle introduzioni interne, con Slot
    router-head/       Metadati DocumentHead, robots e canonical opzionale
    site-header/       Navigazione desktop e menu mobile
    site-footer/       Navigazione secondaria, avviso demo e attribuzioni
  data/site.ts         Link e dichiarazione condivisa della demo
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
tests/ssr.test.mjs      Contratto HTTP della build di produzione
wrangler.jsonc         Solo configurazione del runtime Pages
```

## API Qwik e navigazione

Componenti `component$`, composizione `Slot`, link `Link` e posizione reattiva `useLocation` di Qwik City. Il menu mobile usa un elemento nativo `details/summary`: funziona anche senza JavaScript. Un riferimento DOM con `useSignal` e handler `$` ne permettono la chiusura con Escape e dopo la navigazione, senza duplicare lo stato nativo `open`. Non sono presenti React, React Router o integrazioni React. `jsx: react-jsx` in tsconfig è il nome dell’emissione JSX di TypeScript; `jsxImportSource: @builder.io/qwik` indirizza il runtime a Qwik.

L’header marca la pagina corrente con `aria-current`. Il layout offre salto al contenuto, landmark semantici e focus visibile. Il menu non è modale e non intrappola il focus. Movimento ridotto rispettato tramite media query. Verifiche effettive e relativi limiti nel worklog.

## Stile e contenuti

Tailwind CSS 4 via plugin ufficiale Vite, token `@theme` e componenti `@layer` con `@apply`. Poche regole CSS specifiche gestiscono ritaglio, focus e preferenze di movimento. Palette avorio/oliva/terracotta, serif di sistema, fotografie locali e marchio originale. Componenti riutilizzati solo dove c’è ripetizione concreta.

Tutti i testi sono locali e identificano l’azienda come immaginaria. Nessun inventario camere, calendario, prezzo, API business, database, autenticazione, modulo di contatto, pagamento o analytics. Le pagine interne costituiscono struttura iniziale: il loro sviluppo editoriale completo resta alla milestone 2.

## SEO e ambiente

Ogni pagina esporta `DocumentHead` con titolo e descrizione distinti. Lingua HTML `it`, viewport e favicon nel server HTML. `PUBLIC_SITE_ORIGIN` è opzionale e pubblico, non un segreto: solo se configurato genera canonical dal pathname, senza query string. Senza dominio approvato il canonical è omesso. `noindex, nofollow` e `robots.txt` impediscono l’indicizzazione collaborativa; non sono controlli di accesso.

## Dipendenze e test

npm unico package manager; lockfile committato. Le librerie Qwik rimangono in devDependencies secondo lo scaffold: Vite le incorpora nell’artefatto server e nel client; l’ambiente di build deve installare anche le devDependencies. TypeScript strict include sorgenti, configurazioni e adapter. ESLint 9 applica regole TypeScript e Qwik.

Test runner nativo Node per smoke test su HTTP reale di Wrangler locale: non richiede framework unit test né simula servizi inesistenti. Controlla HTML privo degli script, contenuti, metadati, link, asset, status 404 e presenza del worker senza pagine prerenderizzate. Copertura funzionale della ricerca rimandata alla sua implementazione.

Riferimenti consultati: [adapter Qwik City](https://qwik.dev/docs/deployments/cloudflare-pages/), [Tailwind per Qwik](https://qwik.dev/docs/integrations/tailwind/), [Pages locale](https://developers.cloudflare.com/pages/functions/local-development/). Le configurazioni effettive sono quelle versionate; non usare i vecchi esempi Node delle guide come requisito del progetto.
