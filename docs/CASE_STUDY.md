# Caso di studio — Dimora degli Ulivi

## Problema e risultato

Dimostrare un sito hospitality caldo e fotografico, con contenuti e SEO nella prima risposta HTTP e un percorso completo di ricerca camere. Dopo foundation e direzione boutique, la milestone 3 aggiunge un simulatore deterministico: check-in/check-out, ospiti e camere, combinazioni di tre tipologie, capienza, importi e stati di errore o indisponibilità.

La ricerca confronta un inventario fittizio di cinque unità e dodici posti nel calendario 2027. Verifica che ciascuna unità resti libera per tutto il soggiorno, anziché sommare disponibilità notturne incompatibili. Le soluzioni possono combinare tipologie diverse e il totale copre tutte le camere e tutte le notti. Nessuna prenotazione, pagamento o blocco inventario.

## Esperienza realizzata

Qwik City SSR e adapter ufficiale Cloudflare Pages conservati. Homepage immersiva, palette acqua/lino/miele/ulivo, camere, esperienze, territorio, album con crediti e FAQ. Fotografie illustrative locali con licenza e provenienza documentate; nessun font o servizio fotografico richiesto durante la visita.

Il modulo usa date e select native, aiuti contestuali, errori collegati ai campi e stato annunciabile. I risultati includono foto, distribuzione ospiti, caratteristiche e dettaglio dei prezzi. Modificare un campo elimina le offerte precedenti: non vengono lasciati risultati associati a criteri diversi. “Modifica la ricerca” torna al primo campo.

Il motore puro è condiviso fra browser e loader SSR. Con JavaScript si ricalcola localmente; il modulo GET consente lo stesso confronto anche senza eseguire script. Le query dimostrative sono riproducibili nella risposta HTTP iniziale, con metadati.

## Decisioni e compromessi

| Decisione | Motivazione e limite |
| --- | --- |
| Qwik City SSR e SSG disabilitato | Contenuto e risultati GET verificabili nella risposta; serve il runtime Pages Functions |
| Inventario nel codice, nessun servizio business | Riproducibilità e assenza di persistenza o operazioni reali |
| Calendario fisso 2027 e massimo 14 notti | Indipendenza dall’orologio e combinazioni contenute; non è un sistema aggiornato di disponibilità |
| Unità fisiche e combinazioni miste | Evita cambi camera impliciti e duplicazioni di capienza; non permette preferenze individuali di assegnazione |
| Centesimi e calcolo notte per notte | Importi coerenti su weekend e cambio stagione; extra e imposte non simulati |
| Stato client effimero | Nessun archivio o dato personale; le modifiche avanzate non vengono salvate nell’URL |
| HTML nativo e primitive Qwik | Dettagli, errori e modulo leggibili dal server; interazioni da verificare anche nel browser |
| Test runner Node esistente | Test del dominio e HTTP senza aggiungere dipendenze |
| Noindex e canonical opzionale | Evita indicizzazione e canonical localhost; Access futuro resta separato |

## Evidenze e limiti

17 test unitari verificano date, notti, prezzi, occupazione continua, capienze e determinismo. 16 test HTTP interrogano il worker prodotto dall’adapter tramite Wrangler locale: sette rotte, query complete/errate/vuote, metadati, associazioni ARIA, asset, 404 e assenza di HTML prerenderizzato. Typecheck, lint e build sono verificati separatamente; risultati e problemi nel [worklog](WORKLOG.md).

Ripresa la verifica con Playwright MCP su richiesta del proprietario: provati ricerca client, modifica, dettagli/importi da tastiera, focus su esito ed errore, date invertite, chiusura, nessuna combinazione e sincronizzazione della query. Modulo e risultati controllati a 1440, 768, 390 e 320 px senza overflow; schermate desktop/mobile ispezionate. La prova con script bloccati ha individuato e fatto correggere le opzioni selezionate nell’HTML SSR: ora valori iniziali e query sono conservati anche nel GET nativo. Il blocco browser iniziale è superato per questi controlli; restano fuori un audit WCAG completo, un lettore di schermo reale e browser diversi da Chromium. Evidenze, modalità e limiti nel worklog.

Le dipendenze dello scaffold hanno segnalazioni transitive già documentate; nessun aggiornamento forzato o nuovo pacchetto. Nessun deployment, integrazione alberghiera, invio o modifica a servizi esterni. Regole, esempi e riproduzione in [AVAILABILITY_SIMULATOR.md](AVAILABILITY_SIMULATOR.md).

## Confine della consegna

Milestone 3 implementata e verifica browser mirata conclusa. Milestone 4, consolidamento e preparazione finale al deploy, non avviata. Nessuna pubblicazione.
