# Dimora degli Ulivi — prima fondazione

## Problema e obiettivo

Presentare un agriturismo fittizio con un’identità riconoscibile e contenuti leggibili nella prima risposta HTTP. La funzione distintiva futura sarà una ricerca disponibilità simulata, riproducibile per identici input e senza prenotazioni reali. La milestone 1 prepara struttura e linguaggio visivo, senza anticipare quel flusso.

## Soluzione realizzata

Qwik City SSR con adapter ufficiale Cloudflare Pages. Homepage editoriale, layout condiviso e rotte introduttive per Camere, Esperienze, Territorio, Galleria, Ricerca disponibilità e Contatti. Ogni destinazione della navigazione ha una pagina esistente; la ricerca dichiara il proprio stato di preparazione.

La direzione creativa nasce dal ritmo lento della campagna toscana: colori naturali, serif di sistema, ampio spazio, fotografia ad arco, numeri di capitolo e un ramo d’ulivo originale. Nessun template visivo copiato da strutture reali, recensioni inventate, classificazioni alberghiere o promesse di servizi reali.

Il menu usa semantica HTML nativa e primitive reattive Qwik. Navigazione e contenuti sono disponibili dal server; la ripresa client migliora le interazioni. Le fotografie con licenza verificata sono locali, con attribuzione e spiegazione del loro carattere illustrativo. Nessun caricamento da piattaforme di font o foto durante la visita.

## Decisioni e compromessi

| Decisione | Motivazione e limite |
| --- | --- |
| SSR per tutte le pagine | Rispetta la specifica e rende verificabili contenuto e SEO nella risposta iniziale; richiede il runtime Pages Functions, non hosting puramente statico |
| SSG esplicitamente disabilitato | Evita che l’adapter trasformi la fondazione in un sito prerenderizzato |
| Contenuti introduttivi interni | Navigazione completa senza anticipare la milestone editoriale successiva |
| Nessun form per ora | Non promette una ricerca o un invio ancora assenti |
| Font di sistema | Niente dipendenze o richieste esterne; piccole variazioni tipografiche tra sistemi operativi sono previste |
| Test HTTP con Node | Copertura essenziale del contratto SSR senza introdurre strumenti per logiche business inesistenti |
| Noindex e canonical opzionale | Evita indicizzazione e canonical localhost; il controllo d’accesso futuro resta separato |

## Evidenza e limiti

Il worklog distingue i comandi eseguiti, i risultati e i problemi risolti. Le verifiche devono riguardare il worker prodotto dall’adapter nel runtime locale Wrangler e una richiesta diretta alle rotte, non solo il server Vite. I controlli browser sono locali: non dimostrano il comportamento di un hosting remoto o di un browser diverso da quello usato.

L’audit delle dipendenze dello scaffold segnala vulnerabilità transitive. Non sono stati applicati aggiornamenti forzati incompatibili; valutazione e impatto sono riportati nel worklog. Non esistono ancora inventario mock, calendario, filtri, risultati o prezzi. Non sono stati effettuati deployment né modifiche a servizi esterni.

## Passo successivo previsto, non avviato

Milestone 2: pagine e contenuti dimostrativi più completi, mantenendo tema, SSR e trasparenza. Milestone 3: interazione verticale della ricerca. Milestone 4: consolidamento e preparazione finale al deploy. Ogni fase richiede il proprio incarico.
