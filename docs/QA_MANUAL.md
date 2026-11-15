# Collaudo browser e riproduzione — milestone 4A

Data: 15 novembre 2026. Build Qwik City SSR di produzione su Wrangler locale, `http://127.0.0.1:8947`. Codice applicativo `bf7029f9a70332a69b850d3fd24f3f2fcdfa20b8`, base repository `387352853647351e7c90f93a6ef8a618e335c61f`. Nessun deployment.

## Esito ed evidenze

Il blocco iniziale di `browser_tabs` è storico: su richiesta del proprietario Playwright è stato richiamato e ha risposto. Completati **48 controlli di pagina/stato/viewport e 26 scenari funzionali**, distinti dai **36 test Node già superati** (17 unitari + 19 HTTP). Typecheck, lint e build erano già superati sullo stesso codice; non ripetuti per questa integrazione di soli documenti/catture.

- [Risultati browser strutturati](qa/milestone-4a/browser-results.json): misure, importi, focus, immagini, errori e casi effettivi.
- [Indice delle 52 catture JPEG](qa/milestone-4a/SCREENSHOTS.md), desktop/tablet/mobile, con [manifest SHA-256](qa/milestone-4a/screenshots-manifest.json).
- [Test HTTP/unitari](qa/milestone-4a/tests.tap.txt), [audit editoriale](CONTENT_AUDIT.md), [audit dipendenze](DEPENDENCY_AUDIT.md).

Chromium 157 su Windows, viewport CSS di altezza 900 px. Riduzione movimento durante la matrice; verificato separatamente che il comportamento di scroll passi da `smooth` ad `auto` con la preferenza. Le immagini sono state decodificate e, nel solo driver, impostate eager per le catture estese. Alcune prime catture Home avevano foto decodificate ma non dipinte: ricatturate dopo scorrimento/visualizzazione, con supplementi della hero a 768/390/320 px. Non è stato modificato il sito per un artefatto di cattura.

## Matrice eseguita

Ogni cella seguente ha superato i controlli DOM: risposta HTTP attesa, un H1, immagini caricate con testo alternativo, nessun overflow orizzontale del documento, CTA nei limiti del viewport. Esaminate le catture per gerarchia, spaziature, ritagli, leggibilità e sovrapposizioni: nessun difetto applicativo circoscritto riprodotto.

| Pagina/stato | 1440 | 768 | 390 | 320 |
| --- | --- | --- | --- | --- |
| Home | OK | OK | OK | OK |
| Camere | OK | OK | OK | OK |
| Esperienze | OK | OK | OK | OK |
| Territorio | OK | OK | OK | OK |
| Galleria | OK | OK | OK | OK |
| Contatti | OK | OK | OK | OK |
| Disponibilità iniziale | OK | OK | OK | OK |
| 404 | OK | OK | OK | OK |
| Risultati 10–13 giugno 2027, 2 ospiti/1 camera | OK | OK | OK | OK |
| Errore: check-out precedente al check-in | OK | OK | OK | OK |
| Chiusura: 5–8 novembre 2027 | OK | OK | OK | OK |
| Nessuna combinazione: 10–13 giugno, 5 ospiti/5 camere | OK | OK | OK | OK |

La cattura estesa Home a 390 px conserva un artefatto di paint in alcune immagini inferiori (panorama e uliveto), pur con decode e dimensioni naturali validi nel DOM; non prova il loro aspetto a quel viewport. La hero ha una cattura separata corretta e le stesse sezioni sono visibili a 320/768 px. Limite della cattura, senza difetto del sito accertato.

Nessuna nuova sezione o revisione generale del design. Il lungo scorrimento mobile di Home/Galleria segue i contenuti fotografici. Crediti e didascalie da 9–11 px restano un possibile affinamento di leggibilità, senza difetto WCAG accertato dal solo corpo tipografico.

## Funzionalità e tastiera

I 26 scenari nel JSON includono:

- Invio vuoto, focus sul primo campo errato e contorno visibile; date uguali/invertite, durata 15 notti, più camere che ospiti.
- Tre notti: 405/465/555 €; ricerca ripetuta deterministica; 5 ospiti/2 camere con combinazioni a 960/1020 €; massimo 12 ospiti/5 camere a 765 €; ultimo check-out 1 gennaio 2028; 14 notti a 1810/2090 €.
- Chiusura e assenza di combinazioni; focus sull’esito; modifica dei parametri elimina offerte obsolete; Modifica riporta al check-in; dettagli e importi aperti con Enter, tabella di 14 notti a 320 px senza overflow del documento.
- Link d’esempio, navigazione alla rotta senza query (date vuote, 2 ospiti/1 camera), indietro/avanti. Non esiste un pulsante Reset: il riavvio avviene tramite la rotta pulita.
- Skip link visibile con Tab e destinazione `main`; menu mobile con Enter, Tab, Escape, ritorno del focus e navigazione a Camere; ancore Galleria e singola camera; cinque FAQ aperte/chiuse con Spazio/Enter.
- GET nativo senza script applicativi: CSP temporanea `script-src 'none'` solo sulle risposte intercettate dal driver, default 2/1, risultati e selezioni 5/2 conservati, container Qwik `paused`. Il primo gruppo usa attivazione DOM; l’integrazione sequenziale verifica anche **Enter reale**, query 2/1 e prezzo 405 €. Intercettazione rimossa al termine.
- Preferenza di movimento ridotto applicata allo scroll.

I valori non selezionabili nei controlli (13 ospiti, 6 camere, data inesistente, parametro duplicato) sono coperti dai test HTTP/unitari già versionati, non attribuiti a un nuovo invio interattivo.

## Distinzione fra problemi

Nessun `pageerror` applicativo o errore console inatteso nelle sequenze registrate. I 404 provocati volontariamente e i blocchi CSP della prova senza script sono attesi. I primi tentativi Enter in scheda nascosta non sono conteggiati come passati; le sequenze riuscite portano la scheda in primo piano prima/dopo l’input.

Nell’integrazione esclusiva il contesto browser isolato è stato rifiutato immediatamente con `Target.createBrowserContext: Not allowed`; la scheda ordinaria dedicata ha funzionato. Un selettore del driver cercava “Cerca disponibilità” anziché “Cerca disponibilità demo” ed è andato in timeout: corretto il selettore, Enter senza script è passato. Nessuno dei due eventi è un errore applicativo o un timeout del servizio MCP. Nessun riavvio/reset/configurazione del browser condiviso.

## Riproduzione e limiti

Dalla repository: `npm ci` se necessario, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run preview`; in un secondo terminale `npm test`. Prima del browser verificare `(Invoke-WebRequest 'http://127.0.0.1:8947/').StatusCode`. Usare una scheda dedicata, controllare origine e viewport prima di ogni sequenza; scorrere/attendere tutte le immagini prima delle catture. Non sostituire Wrangler con un server statico o con Vite dev.

Riprodurre gli input sopra dal modulo e, per il limite massimo, aprire direttamente:

```text
http://127.0.0.1:8947/disponibilita/?checkIn=2027-01-04&checkOut=2027-01-05&guests=12&rooms=5
http://127.0.0.1:8947/disponibilita/?checkIn=2027-06-01&checkOut=2027-06-16&guests=2&rooms=1
```

I rapporti sRGB dei token sono 10,24:1 inchiostro/lino, 5,95:1 testo secondario/lino, 6,17:1 inchiostro/acqua, 4,89:1 bianco/ulivo, 7,42:1 errore/lino, 7,25:1 errore/fondo errore e 5,41:1 focus/lino. I colori computati osservati sono nel JSON. Ulivo/lino (4,46:1) rimane per titoli grandi/grafica. Le foto sono state esaminate visualmente, senza misura pixel per pixel del contrasto: [criterio W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Non eseguiti: lettore di schermo reale, popup del calendario di sistema, Safari/Firefox e zoom browser reale al 200%. Le date sono riempite nei controlli nativi da Playwright. I viewport CSS non equivalgono a dispositivi fisici. Nessuna certificazione WCAG completa. Questi limiti non sono un blocco Playwright.

Terminata la verifica, chiusa soltanto la scheda dedicata e arrestati i processi della preview di questa repository, con percorso/porta verificati; nessun listener rimasto su 8947. Playwright liberato per la sessione successiva. Rollback di questa integrazione documentale mediante revert del relativo commit, senza reset/force push; procedura generale in [DEPLOYMENT.md](DEPLOYMENT.md).
