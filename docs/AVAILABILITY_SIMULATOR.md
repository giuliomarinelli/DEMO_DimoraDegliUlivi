# Simulatore disponibilità — milestone 3

Tutto l’inventario, le occupazioni e gli importi sono **fittizi**. Non vengono prenotate o bloccate camere, raccolti dati personali, effettuati pagamenti o contattati servizi alberghieri. Le fotografie restano illustrative, con provenienza e licenze in [ASSETS.md](ASSETS.md).

## Inventario locale

Fonte numerica unica: `src/lib/availability.ts`. I nomi, le fotografie e le descrizioni continuano a provenire da `src/data/editorial.ts`, collegati tramite ID tipizzati.

| Tipologia | Unità fisiche simulate | Capienza per camera | Base per camera/notte |
| --- | --- | --- | --- |
| Ulivo | ulivo-1, ulivo-2 | 2 ospiti | 145,00 € |
| Acqua | acqua-1, acqua-2 | 3 ospiti | 175,00 € |
| Lino | lino-1 | 2 ospiti | 125,00 € |

Totale: cinque camere e dodici posti. Gli ospiti sono persone totali, bambini inclusi: nessuna distinzione tariffaria per età, letto aggiuntivo o supplemento individuale. Ogni camera richiesta deve accogliere almeno una persona.

## Date e validazione

- Calendario fisso: check-in dal **1 gennaio al 31 dicembre 2027**, ultimo check-out **1 gennaio 2028**. Questa finestra è intenzionalmente indipendente dall’orologio del dispositivo: la demo è riproducibile anche in futuro e non si aggiorna automaticamente.
- Da una a quattordici notti; check-out strettamente successivo al check-in.
- Da uno a dodici ospiti e da una a cinque camere. Ospiti almeno pari alle camere e non superiori a tre volte le camere; la successiva ricerca verifica la capienza effettiva delle tipologie libere.
- Formato interno `YYYY-MM-DD`, validato tramite espressione regolare e round-trip ISO UTC: date inesistenti come il 30 febbraio sono rifiutate, senza rollover.
- Le notti sono la differenza fra giorni civili UTC: nessuna dipendenza da ora legale o fuso orario. Il check-out è escluso sia dall’occupazione sia dagli importi.
- Query incomplete o con parametri conosciuti ripetuti producono errori espliciti. Parametri estranei alla ricerca vengono ignorati.

## Disponibilità deterministica

La struttura è chiusa nelle notti dal **1 al 14 novembre 2027** inclusi; riapre il 15. È possibile partire il 1 novembre dopo un soggiorno che non comprenda notti di chiusura.

Ogni unità ha tre notti occupate ogni ciclo di ventotto giorni. Posto `d` uguale al numero di giorni dal 1 gennaio 2027, un’unità è occupata quando `(d + offset) modulo 28 < 3`.

| Unità | Offset |
| --- | --- |
| ulivo-1 | 0 |
| ulivo-2 | 5 |
| acqua-1 | 10 |
| acqua-2 | 15 |
| lino-1 | 20 |

La **stessa unità fisica** deve essere libera per tutte le notti: non basta che ogni notte esista una camera libera diversa. Non sono previsti cambi camera durante il soggiorno.

Il motore enumera le combinazioni di quantità per tipologia che soddisfano esattamente il numero di camere richiesto e una capienza almeno pari agli ospiti. Non duplica offerte equivalenti per unità dello stesso tipo: sceglie le prime unità libere nell’ordine dell’inventario. Assegna una persona per camera e distribuisce le restanti fino alla capienza nell’ordine Ulivo, Acqua, Lino. Questa è una distribuzione dimostrativa, non una preferenza prenotabile.

Ordinamento: importo crescente, poi capienza crescente, poi ID stabile della combinazione. Nessun caso casuale, timer, contatore di prenotazioni o decremento dell’inventario: ricerche identiche danno risultati identici.

## Importi

Per ogni notte e ogni camera:

```text
tariffa = base × (1,30 in luglio/agosto, altrimenti 1) + supplemento weekend
supplemento weekend = 15,00 € nelle notti di venerdì e sabato, altrimenti 0
totale soggiorno = somma delle tariffe di tutte le camere e tutte le notti
```

Il supplemento weekend si aggiunge dopo la maggiorazione estiva. Tutti i calcoli usano centesimi interi; le basi scelte producono centesimi interi anche con il 30%. Non si moltiplica il prezzo per il numero di ospiti. Extra, imposte e condizioni commerciali non sono simulati: l’importo non è un preventivo reale. L’interfaccia espone totale soggiorno, subtotali per tipologia e dettaglio per notte.

## Flusso Qwik e SSR

`/disponibilita/` contiene un vero modulo HTML GET. Il `routeLoader$` di Qwik City inizializza il modulo e calcola un’eventuale query usando il motore puro condiviso. Anche senza JavaScript, inviare il modulo restituisce HTML con errori, stato vuoto o risultati e metadati.

Con JavaScript, gli handler Qwik leggono il modulo, calcolano localmente e aggiornano `useStore`/`useSignal`; non viene invocata alcuna API business. `useTask$` sincronizza lo stato quando un link Qwik City cambia la query della stessa rotta. Le modifiche successive sono locali alla pagina e **non aggiornano l’URL**: ricaricare ripristina la query iniziale, oppure il modulo vuoto se non c’era query. Non è una funzione di salvataggio delle ricerche.

Modificare un campo rimuove i risultati precedenti e invita a cercare di nuovo. Il pulsante “Modifica la ricerca” riporta al primo campo. Date native, select, fieldset/legend, etichette, descrizioni, riepilogo degli errori con link, `aria-invalid` e regione di stato live rendono espliciti i passaggi. In invio avanzato il focus passa al primo campo errato o alla sezione esito; dettagli e importi usano `details/summary` nativi e tabelle con caption/intestazioni.

I controlli automatici delle associazioni ARIA nell’HTML non sostituiscono una prova con tastiera e lettore di schermo. Limiti effettivi nel [worklog](WORKLOG.md).

## Esempi riproducibili

Avviare la build locale come descritto in [DEPLOYMENT.md](DEPLOYMENT.md), poi aggiungere questi path a `http://127.0.0.1:8947`:

| Query sulla rotta `/disponibilita/` | Esito atteso |
| --- | --- |
| `?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1` | Tre notti: Lino 405 €, Ulivo 465 €, Acqua 555 € |
| `?checkIn=2027-06-10&checkOut=2027-06-13&guests=5&rooms=2` | Combinazioni con almeno cinque posti; la prima è Acqua + Lino, 960 € |
| `?checkIn=2027-01-04&checkOut=2027-01-05&guests=12&rooms=5` | Tutte le cinque unità, dodici posti, una notte, 765 € |
| `?checkIn=2027-11-05&checkOut=2027-11-08&guests=2&rooms=1` | Nessun risultato: chiusura dimostrativa |
| `?checkIn=2027-06-10&checkOut=2027-06-13&guests=5&rooms=5` | Parametri validi, nessuna combinazione disponibile |
| `?checkIn=2027-06-10&checkOut=2027-06-09&guests=2&rooms=1` | Errore sul check-out, nessuna offerta |

## Test e riproduzione manuale

`npm run test.unit` compila solo il motore con TypeScript strict in `.cache/availability-tests/` e usa il test runner nativo Node: 17 test per inventario, date civili, confini, occupazioni continue, chiusura, capienze, centesimi, stagioni, weekend, determinismo e query. Non richiede server o pacchetti nuovi.

`npm run test.ssr` richiede la preview di produzione Wrangler già attiva: 16 test su HTTP reale, compresi risultati e errori via GET senza eseguire JavaScript, associazioni di accessibilità, pagine editoriali, asset e artefatti. `npm test` esegue entrambe le suite.

Verifica manuale prevista: con Tab/Enter raggiungere il modulo, inserire 10–13 giugno 2027 / due ospiti / una camera e cercare; verificare focus sull’esito e tre prezzi; aprire dettagli/importi con Enter; usare “Modifica”, cambiare ospiti/camere e cercare; provare date invertite e novembre; ripetere a 320, 390, 768 e 1440 px. Disabilitare poi JavaScript e inviare il modulo per verificare il percorso GET. Non considerare questi passaggi eseguiti in assenza di evidenza browser nel worklog.

Riferimenti: [routeLoader Qwik City](https://qwik.dev/docs/route-loader/), [task Qwik](https://qwik.dev/docs/core/tasks/). Nessuna modifica all’adapter o alla configurazione Cloudflare è richiesta dal simulatore.
