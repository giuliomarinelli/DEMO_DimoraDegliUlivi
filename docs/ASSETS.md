# Asset e licenze

Fonti verificate il 15 novembre 2026. Tutte le immagini sono servite da `public/images/`: nessun caricamento da CDN, SDK o piattaforme fotografiche durante la visita. I link alle fonti in Galleria sono normali collegamenti consultabili su richiesta.

## Registro fotografico

| File locale | Autore / piattaforma | Fonte | Provenienza e uso |
| --- | --- | --- | --- |
| `paesaggio.webp`, `paesaggio-small.webp`, `podere.webp` | Kalina O. / Unsplash | [Fotografia originale](https://unsplash.com/photos/a-view-of-an-olive-grove-in-the-countryside-KCORaIlY5bw) | Toscana; hero e paesaggio. `podere.webp` è il file conservato dalla foundation |
| `uliveto.webp` | Andreas Weilguny / Unsplash | [Fotografia originale](https://unsplash.com/photos/ancient-olive-trees-in-a-sunlit-tuscan-field-OBHoIVnUCBQ) | Pelago, Toscana; esperienze e galleria |
| `tenuta.jpg` | Andrea Mosti / Pexels | [Fotografia originale](https://www.pexels.com/photo/rural-residence-with-a-swimming-pool-15508432/) | Crespina, Toscana; architettura vista dall’alto, Contatti e galleria |
| `orizzonti.webp` | Alan Jiang / Unsplash | [Fotografia originale](https://unsplash.com/photos/tuscan-farmhouse-on-rolling-hills-at-sunset-iW06DUcrhSY) | Toscana; panorama del territorio, tramonto ed esperienze |
| `camera-ulivo.webp` | Clay Banks / Unsplash | [Fotografia originale](https://unsplash.com/photos/a-neutral-bedroom-with-a-large-bed-and-wooden-wardrobe-Xbe5BfScmvM) | Red Hook, New York, Stati Uniti; sola ispirazione di interni |
| `camera-acqua.webp` | Taylor Friehl / Unsplash | [Fotografia originale](https://unsplash.com/photos/cozy-bedroom-with-a-rustic-table-lamp-and-blue-bed-2VgHKYOIiqU) | Ispirazione di tessuti e colori; nessuna ubicazione toscana attribuita |
| `finestra.webp` | Alessandro Guarino / Unsplash | [Fotografia originale](https://unsplash.com/photos/open-window-view-of-a-swimming-pool-and-tuscan-landscape-qdJCZrRT9Xo) | Assisi, Umbria; finestra e piscina come ispirazione d’ospitalità, non Toscana |
| `dettaglio.jpg` | Andrea Kartali / Pexels | [Fotografia originale](https://www.pexels.com/photo/book-lying-on-a-wooden-bedside-table-18145480/) | Chianciano Terme, Toscana; dettaglio di lettura e risveglio |

Nessuna fotografia ritrae una struttura esistente chiamata Dimora degli Ulivi. L’associazione con i concetti editoriali di camera non implica identità o appartenenza del luogo fotografato. Il sito dichiara la simulazione nell’avviso generale, nelle pagine e nel footer. Crediti completi, luoghi e fonti sono consultabili anche in Galleria, collegata dal footer.

## Licenze verificate

- [Unsplash License](https://unsplash.com/license): uso gratuito anche commerciale e modifica consentiti, attribuzione non obbligatoria ma mantenuta. Non consente rivendita di copie senza modifiche significative o raccolte destinate a replicare un servizio concorrente.
- [Pexels License](https://www.pexels.com/license/): uso gratuito e modifica consentiti, attribuzione non obbligatoria ma mantenuta. Non implica endorsement dell’autore o dei luoghi; non consente rivendita di copie non modificate o redistribuzione su piattaforme stock. Le immagini non sono usate come marchio.
- Sono state selezionate fotografie gratuite, non risorse Unsplash+ o a pagamento. Nessuna persona identificabile è usata a scopo promozionale.

Le condizioni vincolanti sono quelle dei testi originali delle licenze. Ricontrollarle prima di riusi diversi dal presente sito.

## Riproduzione dei download

I file Unsplash sono scaricati con `fm=webp&fit=crop&w=<larghezza>&q=<qualità>`, senza credenziali. La hero ha varianti 2200 px (qualità 85) e 900 px (qualità 82); le altre nuove foto WebP sono a 1200 px, tranne il panorama a 1800 px, qualità 82. I JPEG Pexels sono scaricati a 1920 px (tenuta) e 1000 px (dettaglio), con compressione CDN.

| File | URL di download |
| --- | --- |
| paesaggio.webp | `https://images.unsplash.com/photo-1720135495101-dd3f82cf632d?fm=webp&fit=crop&w=2200&q=85` |
| paesaggio-small.webp | `https://images.unsplash.com/photo-1720135495101-dd3f82cf632d?fm=webp&fit=crop&w=900&q=82` |
| podere.webp (foundation) | `https://images.unsplash.com/photo-1720135495101-dd3f82cf632d?fm=webp&fit=crop&w=1800&q=85` |
| uliveto.webp (foundation) | `https://images.unsplash.com/photo-1775591585525-ef61d9cc9dd9?fm=webp&fit=crop&w=1000&q=85` |
| tenuta.jpg | `https://images.pexels.com/photos/15508432/pexels-photo-15508432.jpeg?auto=compress&cs=tinysrgb&w=1920` |
| orizzonti.webp | `https://images.unsplash.com/photo-1768835304841-62ae1c41c37a?fm=webp&fit=crop&w=1800&q=82` |
| camera-ulivo.webp | `https://images.unsplash.com/photo-1758072328635-586f3c121af2?fm=webp&fit=crop&w=1200&q=82` |
| camera-acqua.webp | `https://images.unsplash.com/photo-1780672823907-07fb6661c31a?fm=webp&fit=crop&w=1200&q=82` |
| finestra.webp | `https://images.unsplash.com/photo-1775923293081-598283c494bc?fm=webp&fit=crop&w=1200&q=82` |
| dettaglio.jpg | `https://images.pexels.com/photos/18145480/pexels-photo-18145480.jpeg?auto=compress&cs=tinysrgb&w=1000` |

Esempio PowerShell dalla radice:

```powershell
Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1720135495101-dd3f82cf632d?fm=webp&fit=crop&w=900&q=82' -OutFile public/images/paesaggio-small.webp
```

Le foto sono dimensionate al download e ritagliate in CSS con `object-fit`. Non è richiesta una pipeline di trasformazione server. La firma WebP viene controllata dai test HTTP per i file in quel formato. Le foto scartate durante la selezione non fanno parte della consegna.

## Altri asset

Marchio, ramo d’ulivo SVG e favicon sono disegni originali della foundation, conservati; la favicon adotta ora ulivo e lino della nuova palette. Nessun logo altrui. Font di sistema: nessun font scaricato o incorporato, nessuna licenza di font terzi da trasferire.

Fonte editoriale per i luoghi reali: [Visit Tuscany — Val d’Orcia](https://www.visittuscany.com/it/territori/val-dorcia/), consultata il 15 novembre 2026. Testi originali sintetici, senza riproduzione della guida. Nessuna foto di Visit Tuscany è stata riutilizzata.

Milestone 4B, 16 novembre 2026: ricontrollata la stessa fonte geografica all’[URL disponibile](https://www.visittuscany.com/it/territori/Val-dOrcia/), dopo un timeout sul vecchio percorso. Conferma i tre riferimenti utilizzati: Pienza come città ideale, cipressi di San Quirico, vasca termale di Bagno Vignoni. Gli spunti di osservazione sono testi originali, non informazioni operative della guida. Nessuna nuova fonte fotografica, download o modifica delle licenze; `dettaglio.jpg` è riutilizzato anche per la lettura al coperto in Esperienze, con credito esistente.
