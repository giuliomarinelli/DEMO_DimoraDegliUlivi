# Screenshot — milestone 4A

Produzione Qwik City SSR su Wrangler locale; Chromium 157, viewport CSS di altezza 900 px. 48 catture estese più tre hero viewport e un dettaglio prezzi: 52 JPEG. Misure e input in [browser-results.json](browser-results.json), metodologia e limiti in [QA_MANUAL](../../QA_MANUAL.md). Nessun nuovo asset fotografico: immagini esistenti, fonti/licenze in [ASSETS](../../ASSETS.md).

| Pagina/stato | 1440 | 768 | 390 | 320 |
| --- | --- | --- | --- | --- |
| home | [1440](screenshots/home-1440.jpg) | [768](screenshots/home-768.jpg) | [390](screenshots/home-390.jpg) | [320](screenshots/home-320.jpg) |
| camere | [1440](screenshots/camere-1440.jpg) | [768](screenshots/camere-768.jpg) | [390](screenshots/camere-390.jpg) | [320](screenshots/camere-320.jpg) |
| esperienze | [1440](screenshots/esperienze-1440.jpg) | [768](screenshots/esperienze-768.jpg) | [390](screenshots/esperienze-390.jpg) | [320](screenshots/esperienze-320.jpg) |
| territorio | [1440](screenshots/territorio-1440.jpg) | [768](screenshots/territorio-768.jpg) | [390](screenshots/territorio-390.jpg) | [320](screenshots/territorio-320.jpg) |
| galleria | [1440](screenshots/galleria-1440.jpg) | [768](screenshots/galleria-768.jpg) | [390](screenshots/galleria-390.jpg) | [320](screenshots/galleria-320.jpg) |
| contatti | [1440](screenshots/contatti-1440.jpg) | [768](screenshots/contatti-768.jpg) | [390](screenshots/contatti-390.jpg) | [320](screenshots/contatti-320.jpg) |
| disponibilita | [1440](screenshots/disponibilita-1440.jpg) | [768](screenshots/disponibilita-768.jpg) | [390](screenshots/disponibilita-390.jpg) | [320](screenshots/disponibilita-320.jpg) |
| 404 | [1440](screenshots/404-1440.jpg) | [768](screenshots/404-768.jpg) | [390](screenshots/404-390.jpg) | [320](screenshots/404-320.jpg) |
| ricerca | [1440](screenshots/ricerca-1440.jpg) | [768](screenshots/ricerca-768.jpg) | [390](screenshots/ricerca-390.jpg) | [320](screenshots/ricerca-320.jpg) |
| errore | [1440](screenshots/errore-1440.jpg) | [768](screenshots/errore-768.jpg) | [390](screenshots/errore-390.jpg) | [320](screenshots/errore-320.jpg) |
| chiusura | [1440](screenshots/chiusura-1440.jpg) | [768](screenshots/chiusura-768.jpg) | [390](screenshots/chiusura-390.jpg) | [320](screenshots/chiusura-320.jpg) |
| nessuna-combinazione | [1440](screenshots/nessuna-combinazione-1440.jpg) | [768](screenshots/nessuna-combinazione-768.jpg) | [390](screenshots/nessuna-combinazione-390.jpg) | [320](screenshots/nessuna-combinazione-320.jpg) |

Supplementi a dimensione viewport: [hero 768](screenshots/home-768-viewport.jpg), [hero 390](screenshots/home-390-viewport.jpg), [hero 320](screenshots/home-320-viewport.jpg), [dettaglio prezzi a 320](screenshots/dettaglio-prezzi-320.jpg) con focus visibile. Quest’ultimo mostra la porzione iniziale della tabella aperta, non tutte le 14 righe nello stesso viewport. Le catture Home sono state riprese dopo caricamento e paint delle immagini; nessuna modifica applicativa.

Date degli stati: ricerca 10–13 giugno 2027, 2 ospiti/1 camera; errore 10–9 giugno; chiusura 5–8 novembre; nessuna combinazione 10–13 giugno, 5 ospiti/5 camere. Prezzi e operazioni esclusivamente simulati. Manifest di integrità: [SHA-256](screenshots-manifest.json). Le immagini estese possono essere ridimensionate dal visualizzatore: aprire l’originale per valutare il testo.

Limite noto: La cattura estesa Home a 390 px conserva un artefatto di paint in alcune immagini inferiori (panorama e uliveto), pur con decode e dimensioni naturali validi nel DOM; non prova il loro aspetto a quel viewport. La hero ha una cattura separata corretta e le stesse sezioni sono visibili a 320/768 px. Limite della cattura, senza difetto del sito accertato.
