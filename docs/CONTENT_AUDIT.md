# Audit dei contenuti — milestone 4A

Data: 15 novembre 2026. Base esaminata: `bf7029f9a70332a69b850d3fd24f3f2fcdfa20b8`, sul branch `feature/mvp-foundation`.

## Metodo e attendibilità

Analisi dei sorgenti editoriali, dei componenti condivisi e dell’HTML realmente restituito dalla build Qwik City SSR su Wrangler locale. Tutte le sette pagine rispondono 200 con un H1 e metadati distinti; riepilogo in [http-pages.json](qa/milestone-4a/http-pages.json). Il conteggio immagini indica elementi HTML, non prova caricamento o qualità del ritaglio.

Dopo il primo blocco storico, Playwright ha completato 48 controlli pagina/stato/viewport a 1440/768/390/320 px e 26 scenari funzionali. Le immagini sono caricate; catture esaminate per ritagli, spaziatura e leggibilità, senza nuovi difetti circoscritti. [Indice screenshot](qa/milestone-4a/SCREENSHOTS.md), risultati e limiti in [QA_MANUAL.md](QA_MANUAL.md).

Le opportunità elencate sono raccomandazioni: nessun nuovo contenuto, funzionalità o restyling è stato implementato in questa milestone. Non occorre allungare tutte le pagine; il criterio è aggiungere informazioni utili a scegliere un soggiorno dimostrativo.

## Valutazione per pagina

| Pagina | Necessità di ulteriori contenuti | Priorità | Motivo concreto |
| --- | --- | --- | --- |
| Home `/` | Facoltativa, mirata | Media | Atmosfera e inviti completi; pochi dati pratici prima di raggiungere Camere |
| Camere `/camere/` | Sì, per distinguere le tipologie | Media | Capienze e prezzi presenti, caratteristiche ancora soprattutto cromatiche |
| Esperienze `/esperienze/` | Sì | Alta | Tre brevi scene affini; poca differenza concreta tra i modi di soggiornare |
| Territorio `/territorio/` | Sì, circoscritta | Media | Tre luoghi identificati, ma descrizioni generiche e una sola fonte complessiva |
| Galleria `/galleria/` | Non necessario aggiungere prosa | Bassa | Otto immagini, categorie, provenienze e crediti già soddisfano il compito |
| Disponibilità `/disponibilita/` | Non necessario per completare il flusso | Bassa | Regole principali, dettagli, importi e stati già espliciti |
| Contatti `/contatti/` | Sì, come guida alla demo | Media | La trasparenza è completa; titolo e funzione effettiva possono creare aspettative diverse |

### Home

Presenti hero fotografica, racconto della dimora, tre camere, finestra sul paesaggio, invito alla galleria e richiamo finale alla ricerca. La pagina non è scarna: la verifica visuale conferma alternanza di immagini, racconto e azioni, con scorrimento mobile lungo ma coerente.

Opportunità: integrare in futuro una breve sintesi già coerente con il motore — cinque camere simulate, tre atmosfere, fino a dodici ospiti — vicino al rimando a Camere. Questo anticiperebbe una scelta concreta senza aggiungere altre sezioni poetiche. Evitare una seconda storia introduttiva o nuove ripetizioni di “luce”, “paesaggio” e “senza fretta”. La CTA principale “Scopri la disponibilità” è chiara e punta a una rotta funzionante; non serve moltiplicarla ulteriormente.

### Camere

Tre presentazioni con fotografie, quantità, capienza, tariffa base, dettagli e rimando alla disponibilità; sezione comfort e invito finale. Il contenuto è completo per la demo, ma Acqua e Lino descrivono soprattutto tessuti e atmosfera. Solo Ulivo menziona un letto matrimoniale; i tre posti di Acqua non hanno ancora una descrizione della composizione dei letti.

Opportunità: una scheda comparabile delle tre tipologie con configurazione dei posti e caratteristiche narrative coerenti, tutte dichiarate fittizie e approvate prima di inventare misure o dotazioni. Chiarire, se si arricchiscono i testi, cosa accomuna le camere e cosa cambia davvero. Non attribuire accessibilità fisica, metrature o servizi verificati a fotografie illustrative. I link verso la ricerca sono funzionali; un’eventuale preselezione sarebbe una nuova funzionalità e resta fuori da questo audit.

### Esperienze

Le tre scene sono “Il sentiero degli ulivi”, “Un pomeriggio d’estate” e “Aspettare l’ultima luce”. Ogni scheda ha fotografia, momento della giornata, breve descrizione e suggerimento. La fascia successiva rinvia al territorio.

È la pagina con maggior margine di arricchimento: una breve sequenza narrativa mattino/pomeriggio/sera, con un’alternativa tranquilla al coperto e una distinzione fra attività immaginate alla dimora e luoghi reali da scoprire. Servirebbe a dare concretezza alle scene, non a creare un calendario acquistabile. Le tre righe “Il momento da cercare” seguono lo stesso schema: una futura revisione può renderle più specifiche, evitando altre formule su luce e lentezza. Non aggiungere percorsi escursionistici operativi, guide, disponibilità o orari inventati.

### Territorio

Panorama, tre soste nominate — Pienza, San Quirico d’Orcia, Bagno Vignoni —, quattro stagioni e rimandi a Visit Tuscany/Galleria. L’assenza di distanze dalla struttura è corretta perché la dimora non ha ubicazione reale.

Opportunità: aggiungere a ogni sosta un elemento culturale o paesaggistico distintivo verificato e il relativo approfondimento ufficiale, anziché tre inviti simili a passeggiare. Le quattro stagioni sono oggi una frase ciascuna: si possono collegare a un diverso modo di osservare i luoghi, senza promettere condizioni meteo o aperture. Non aggiungere mappe, tempi di percorrenza dalla dimora, prezzi o itinerari pratici non verificati. La CTA “Esplora i paesaggi della galleria” mantiene un nesso concreto con la pagina.

### Galleria

Tre categorie ad ancore native, otto fotografie con titolo, provenienza e autore/fonte. Distingue correttamente le ispirazioni fuori Toscana. Non richiede un’introduzione più lunga né un testo sotto ogni immagine per riempire spazio.

Opportunità facoltativa: associare alcune didascalie a una caratteristica già raccontata nelle camere o nelle esperienze. Aggiungere nuove fotografie solo per colmare un soggetto preciso e con licenze documentate, non per ripetere lo stesso paesaggio. L’assenza di una lightbox non è una carenza editoriale e non ne viene proposta l’implementazione qui. Ritagli e scorrimento mobile sono stati esaminati: immagini integre, crediti presenti e nessun overflow. I piccoli crediti possono essere un affinamento futuro di leggibilità.

### Disponibilità

Modulo con finestra 2027, limiti, esempi, avviso di simulazione; risultati con capienza, distribuzione ospiti, foto e caratteristiche, totale soggiorno e dettaglio per notte. Stati senza camere e chiusura spiegati. Nessuna pagina vuota nel percorso HTTP provato.

Non occorrono nuove sezioni prima del modulo: renderebbero più lungo l’accesso all’interazione. Possibile affinamento futuro dei soli testi: spiegare brevemente che le soluzioni possono combinare più tipologie e che una modifica richiede una nuova ricerca; il secondo punto è già annunciato durante l’interazione. Le etichette numeriche “Soluzione 1/2” distinguono le schede reali controllate anche su mobile; foto, totale e azione mantengono una gerarchia riconoscibile. Il tasto Modifica non azzera: riporta ai campi. Non esiste un pulsante Reset; il ritorno alla rotta senza query riparte dallo stato iniziale. Aggiungere un controllo sarebbe una modifica funzionale e non viene fatto in 4A.

### Contatti

Racconto di trasparenza, fotografia, cinque FAQ native, invito alle camere e alla ricerca. L’assenza di telefono, email, indirizzo e modulo è intenzionale, non un difetto da correggere con dati finti.

Opportunità: una breve guida “Come provare la demo”, con rinvio a ricerca, esempi e crediti, così la pagina offre un’azione utile oltre alle negazioni. In un futuro intervento editoriale si può chiarire meglio già nell’introduzione che è una pagina di informazioni/FAQ. La CTA nella FAQ “Stato della disponibilità demo” è meno orientata all’azione rispetto a “Prova il simulatore”; è un candidato di microcopy, non un collegamento rotto. Nessuna sostituzione automatica o nuovo canale di contatto.

## Ripetizioni e priorità trasversali

L’invito al soggiorno è un componente condiviso presente in sei pagine; il ritorno alla disponibilità è voluto. Homepage, Camere, Esperienze e Territorio ripetono anche immagini e lessico (“luce”, “paesaggio”, “tempo”, “senza fretta”). In una revisione successiva concentrare l’atmosfera sulla Home, le differenze pratiche su Camere, le scene concrete su Esperienze e le specificità geografiche su Territorio.

Mantenere la dichiarazione di simulazione in ogni pagina; eventuali riduzioni di ripetitività non devono far credere all’esistenza di azienda, servizi o prenotazioni reali. Non aggiungere recensioni, stelle, certificazioni, indirizzi o testimonianze inventate. Il collaudo visuale/tastiera mirato è completato; resta distinta la revisione compatibile delle dipendenze: vedere [DEPENDENCY_AUDIT.md](DEPENDENCY_AUDIT.md).
