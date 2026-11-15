# Dimora degli Ulivi — esperienza boutique, milestone 2

## Problema e obiettivo

Presentare un agriturismo fittizio come un luogo in cui immaginare un soggiorno boutique in Toscana, con contenuti leggibili nella prima risposta HTTP. Dopo la fondazione tecnica della milestone 1, la milestone 2 sviluppa il sito editoriale e fotografico. La funzione distintiva futura sarà una ricerca disponibilità simulata; rimane fuori da questa consegna.

## Soluzione realizzata

Qwik City SSR e adapter ufficiale Cloudflare Pages conservati. Homepage immersiva, layout condiviso e contenuti completi per Camere, Esperienze, Territorio, Galleria e Contatti/FAQ. Ogni destinazione della navigazione ha una pagina esistente; la disponibilità è un ingresso visivo riconoscibile con stato non attivo e link utili, senza campi o ricerca.

La nuova direzione creativa mette al centro il viaggio: hero fotografica a tutta larghezza, colori acqua/lino/miele/ulivo, serif di sistema, sezioni ampie e immagini di ambienti, paesaggio e dettagli. Marchio originale preservato, linguaggio più concreto e orientato al soggiorno. Nessun template copiato da strutture reali, recensione inventata, classificazione alberghiera o servizio reale promesso.

Il menu usa semantica HTML nativa e primitive reattive Qwik. Navigazione e contenuti sono disponibili dal server; la ripresa client migliora le interazioni. Le fotografie con licenza verificata sono locali, con attribuzione e spiegazione del loro carattere illustrativo. Nessun caricamento da piattaforme di font o foto durante la visita.

## Decisioni e compromessi

| Decisione | Motivazione e limite |
| --- | --- |
| SSR per tutte le pagine | Rispetta la specifica e rende verificabili contenuto e SEO nella risposta iniziale; richiede il runtime Pages Functions, non hosting puramente statico |
| SSG esplicitamente disabilitato | Evita che l’adapter trasformi la fondazione in un sito prerenderizzato |
| Tre concetti editoriali di camera | Presentazioni complete senza creare inventario, tariffe o disponibilità |
| Foto illustrative con provenienza | Racconto visivo ricco senza attribuire falsamente ambienti reali alla struttura fittizia |
| Nessun form per ora | Non promette una ricerca o un invio ancora assenti |
| Font di sistema | Niente dipendenze o richieste esterne; piccole variazioni tipografiche tra sistemi operativi sono previste |
| Test HTTP con Node | Copertura essenziale del contratto SSR senza introdurre strumenti per logiche business inesistenti |
| Noindex e canonical opzionale | Evita indicizzazione e canonical localhost; il controllo d’accesso futuro resta separato |

## Evidenza e limiti

Il worklog distingue i comandi eseguiti, i risultati e i problemi risolti. I 12 test HTTP interrogano il worker prodotto dall’adapter tramite Wrangler locale: contenuti, SEO, asset, ancore, crediti, FAQ, 404 e assenza di prerender. Controlli responsive sulle sette pagine a quattro larghezze, con CTA sempre presente. I controlli browser sono locali: non dimostrano il comportamento di un hosting remoto o di un browser diverso da quello usato.

L’audit delle dipendenze dello scaffold segnala vulnerabilità transitive. Non sono stati applicati aggiornamenti forzati incompatibili; valutazione e impatto sono riportati nel worklog. Non esistono ancora inventario mock, calendario, filtri, risultati o prezzi. Non sono stati effettuati deployment né modifiche a servizi esterni.

## Passo successivo previsto, non avviato

Milestone 2 completata sul piano visivo ed editoriale. Milestone 3: interazione verticale della ricerca, da autorizzare separatamente. Milestone 4: consolidamento e preparazione finale al deploy. Nessuna delle due è avviata con questa consegna.
