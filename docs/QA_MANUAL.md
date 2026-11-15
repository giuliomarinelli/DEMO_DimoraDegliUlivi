# Collaudo manuale riproducibile — milestone 4A

Data: 15 novembre 2026. Applicazione: Qwik City SSR, build di produzione nel runtime locale Cloudflare Pages/Wrangler. Nessun servizio Cloudflare remoto richiesto.

## Stato delle verifiche

| Area | Evidenza di questa sessione | Stato |
| --- | --- | --- |
| TypeScript, lint, build client/server | Comandi completati con exit code 0, dettaglio nel worklog | Superati |
| Motore disponibilità | 17 test unitari, date/notti/capienze/importi | Superati |
| HTTP della produzione SSR | 19 test, sette pagine, query, errori, riapertura ricerca, asset, metadati, 404 e artefatti | Superati |
| Contenuti e struttura | Sorgenti e HTML attuale, [audit editoriale](CONTENT_AUDIT.md) | Esaminati |
| Contrasto di colori uniformi | Calcolo sRGB sui token dichiarati sotto | Esaminato sul codice |
| Viewport, overflow, ritagli, spaziatura, focus e tastiera reali | Una richiesta Playwright senza risposta, interrotta | Bloccati, da eseguire |
| Screenshot desktop/mobile di 4A | Nessuna cattura prodotta | Bloccati |

Il browser non è stato richiamato ripetutamente dopo il blocco. Non sono stati usati browser CLI, input Windows, CDP, servizi di screenshot o altre sessioni/progetti. I controlli della milestone 3 nel worklog non sono nuovi test di 4A. Nessuna schermata precedente viene presentata come nuova evidenza.

## Avvio e verifica tecnica

Dalla radice della repository:

```powershell
node --version
npm --version
# Solo se le dipendenze non sono già presenti:
npm ci
npm run typecheck
npm run lint
npm run test.unit
npm run build
npm run preview
```

Lasciare aperto il terminale della preview, poi in un secondo terminale nella stessa directory:

```powershell
npm test
(Invoke-WebRequest 'http://127.0.0.1:8947/').Content
(Invoke-WebRequest 'http://127.0.0.1:8947/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1').Content
```

Titolo, descrizione, H1, stato e risultati devono essere nel corpo HTTP iniziale, anche prima di eseguire script. `dist/_worker.js`, `_routes.json`, manifest e moduli `server/` devono essere presenti; non deve esserci un `index.html` prerenderizzato per ciascuna rotta. Non sostituire Wrangler con un server statico o con vite dev. Installazione con npm e lockfile; nessun login, binding remoto o deployment.

## Matrice visuale da completare

Usare un browser con larghezza viewport CSS indicata, altezza iniziale consigliata 900 px e zoom 100%. Controllare poi anche zoom 200% e preferenza di movimento ridotto. Tutte le celle seguenti sono **da eseguire**, non risultati superati.

| Pagina/stato | 1440 px | 768 px | 390 px | 320 px |
| --- | --- | --- | --- | --- |
| Home `/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| Camere `/camere/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| Esperienze `/esperienze/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| Territorio `/territorio/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| Galleria `/galleria/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| Contatti `/contatti/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| Disponibilità: iniziale, errori, risultati, stato vuoto | Da eseguire | Da eseguire | Da eseguire | Da eseguire |
| 404 `/un-sentiero-inesistente/` | Da eseguire | Da eseguire | Da eseguire | Da eseguire |

Per ogni cella:

1. Ricaricare direttamente la rotta, verificare titolo e un H1, poi percorrere tutta la pagina. Controllare header, footer, menu, CTA e collegamenti a rotte/ancore.
2. Verificare assenza di scorrimento orizzontale dell’intera pagina, sovrapposizioni o testo troncato. Nella ricerca aprire anche il dettaglio prezzi: lo scorrimento eventualmente necessario deve rimanere nella tabella, non nel documento.
3. Scorrere fino a tutte le immagini e attenderne il caricamento; distinguere lazy loading da asset rotti. Esaminare ritagli, proporzioni, foto di interni e paesaggi; nessuna foto deve implicare che la struttura esista realmente.
4. Valutare gerarchia H1/H2/H3, lunghezza delle righe e spaziatura tra sezioni, schede e CTA. Prestare attenzione a crediti/didascalie da 9–11 px e ai testi sulle fotografie: sono punti da verificare, non difetti visuali accertati in 4A.
5. Con Tab e Shift+Tab verificare focus sempre visibile e ordine logico. Le azioni non devono richiedere il mouse. Il cambio di viewport non deve nascondere l’accesso alla disponibilità.
6. Registrare pagina, larghezza/altezza, browser/versione, azione, atteso, osservato e screenshot. Una cella va marcata superata solo dopo il controllo reale.

Screenshot rappresentativi da produrre al ripristino del browser: Home desktop e mobile; Camere desktop e mobile; ricerca con modulo e prima soluzione a 1440/390 px; errore e assenza risultati a 320 px. Nomi suggeriti: `home-1440.png`, `home-390.png`, `camere-1440.png`, `camere-390.png`, `ricerca-1440.png`, `ricerca-390.png`, `errore-320.png`, `nessun-risultato-320.png`. Questi file **non esistono nella consegna 4A**. Prima di una cattura estesa caricare tutte le immagini tramite scorrimento.

## Tastiera e navigazione

- Da una ricarica Home: Tab deve rendere visibile “Vai al contenuto”; Enter deve portare a `main#contenuto`.
- A 390/320 px raggiungere Menu con Tab, aprire con Enter, attraversare tutti i link, chiudere con Escape e verificare ritorno del focus al summary. Seguire Camere e verificare contenuto, titolo, pagina corrente e chiusura del menu.
- Provare le tre ancore della Galleria e i link Home → singola camera. Aprire/chiudere ogni FAQ con Enter/Spazio e verificare testo e focus.
- Nel modulo le etichette devono portare ai controlli giusti. Le date native possono avere più segmenti raggiungibili con Tab: non presumere un numero fisso di pressioni per ogni browser.
- Dopo ricerca valida verificare focus sulla sezione esito; dopo errore sul primo campo errato. Aprire caratteristiche e importi con Enter; usare Modifica e verificare il focus sul check-in.
- Provare anche avanti/indietro del browser dopo link d’esempio e navigazione fra pagine. Le modifiche locali con JavaScript non aggiornano l’URL: ricaricare ripristina la query iniziale, comportamento documentato della demo.

## Casi funzionali riproducibili

Le righe della colonna HTTP sono coperte da test reali sulla produzione locale. Tutti i corrispondenti invii/interventi nel browser e il focus sono da verificare in 4A. Gli importi sono totali indicativi di dati fittizi.

| Input o azione | Atteso | Copertura HTTP/unitaria di 4A |
| --- | --- | --- |
| 10–13 giugno 2027, 2 ospiti / 1 camera | 3 notti; Lino 405 €, Ulivo 465 €, Acqua 555 € | Superata |
| Stesse date, 5 ospiti / 2 camere | Combinazioni miste, prima a 960 €, assegnazione coerente | Superata |
| 4–5 gennaio 2027, 12 ospiti / 5 camere | Una soluzione, dodici posti, 765 € | Superata |
| 31 dicembre 2027–1 gennaio 2028, 1 ospite / 1 camera | Una notte, ultimo check-out ammesso | Superata |
| 1–15 giugno 2027, 1 ospite / 1 camera | 14 notti, Lino da 1.810 €, nessun errore durata | Superata |
| 1–16 giugno | Errore oltre quattordici notti, nessuna offerta | Superata |
| Check-in uguale/successivo al check-out, date mancanti/inesistenti | Errori sui campi, niente risultati | Superata |
| 5–8 novembre 2027 | Nessuna soluzione: chiusura dimostrativa | Superata |
| 10–13 giugno, 5 ospiti / 5 camere | Parametri validi, nessuna combinazione disponibile | Superata |
| 13 ospiti; 6 camere; 1 ospite / 2 camere; checkout 2 gennaio 2028 | Errori specifici, nessuna offerta | Superata tramite query, unit test dei limiti |
| Parametro `guests` ripetuto nella query | Errore “un solo valore” | Superata |
| Modificare un campo dopo un risultato | Le vecchie offerte scompaiono; serve una nuova ricerca | Da eseguire nel browser |
| Modifica la ricerca | Focus al check-in, dati conservati | Da eseguire nel browser |
| Aprire `/disponibilita/` senza query dopo un risultato | Date vuote, default 2 ospiti / 1 camera, niente risultati/errori precedenti | Superata HTTP; navigazione client da eseguire |

Non c’è un pulsante Reset nel prodotto e non viene aggiunto per il collaudo. Il riavvio si prova con la rotta senza query; Modifica ha un’altra funzione. Per gli input non selezionabili nei controlli nativi (es. tredici ospiti o 30 febbraio), usare una query diretta nella barra indirizzi. Non alterare inventario o codice per creare gli errori.

Esempi da aprire direttamente:

```text
http://127.0.0.1:8947/disponibilita/?checkIn=2027-01-04&checkOut=2027-01-05&guests=12&rooms=5
http://127.0.0.1:8947/disponibilita/?checkIn=2027-06-01&checkOut=2027-06-16&guests=2&rooms=1
http://127.0.0.1:8947/disponibilita/?checkIn=2027-02-30&checkOut=2027-03-02&guests=2&rooms=1
```

Disabilitare poi JavaScript dalle impostazioni del browser, ricaricare la ricerca senza query e inviare date valide. La select iniziale deve mostrare due ospiti; dopo un GET cinque ospiti/due camere questi valori devono restare selezionati. Devono apparire risultati/errori/metadati, senza ripresa Qwik. Riabilitare JavaScript al termine. Questa prova manuale non è stata eseguita in 4A; i test HTTP verificano le risposte e gli attributi `selected`.

## Contrasto: verifica sul codice, non sui pixel

Rapporti ricalcolati con luminanza relativa sRGB e `(Lchiaro + 0,05)/(Lscuro + 0,05)`. Sono token e fondi uniformi dichiarati in `src/global.css`; non misure ottenute dal browser o dalle fotografie.

| Coppia | Rapporto |
| --- | --- |
| Inchiostro `#293F3C` / lino `#FAF4E7` | 10,24:1 |
| Testo secondario `#52615B` / lino | 5,95:1 |
| Inchiostro / acqua `#A7C6C6` | 6,17:1 |
| Bianco / ulivo `#65765B` | 4,89:1 |
| Ulivo / lino | 4,46:1 |
| Errore `#8A3327` / lino | 7,42:1 |
| Errore / fondo errore `#FBF0E9` | 7,25:1 |
| Focus `#875A32` / lino | 5,41:1 |

Ulivo/lino va mantenuto per titoli grandi e grafica; testo secondario/acqua pieno sarebbe solo 3,58:1 e non va introdotto per piccoli testi. Il richiamo condiviso su acqua eredita attualmente il colore inchiostro. La verifica CSS non ha individuato un impiego da correggere di quei due abbinamenti per piccolo testo. Soglie e casi particolari: [WCAG 2.2, contrasto minimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Restano da controllare compositing, gradienti, testi sulle foto, stati interattivi e zoom nel browser; nessuna conformità WCAG completa dichiarata.

## Ripresa e rollback

Al ripristino del browser eseguire la matrice senza cambiare stack o usare servizi di prenotazione. Annotare esiti effettivi e nuovi difetti riproducibili; gli arricchimenti di CONTENT_AUDIT non sono automaticamente autorizzati all’implementazione.

Questa consegna non modifica il sito: solo test e documentazione/evidenze. Il rollback eventuale consiste nel revert dei commit 4A, senza reset o force push, rispettando il branch di lavoro e le modifiche successive. Procedure generali in [DEPLOYMENT.md](DEPLOYMENT.md). La preview resta locale; nessun provisioning, login o pubblicazione.
