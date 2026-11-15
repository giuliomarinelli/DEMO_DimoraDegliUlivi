# Direzione del brand — milestone 2

Data: 15 novembre 2026. Evoluzione della foundation sul branch esistente `feature/mvp-foundation`. Questa direzione riguarda una struttura ricettiva boutique **fittizia**: foto, ambienti e servizi sono un racconto dimostrativo.

## Idea guida

**La tua parentesi toscana.** Un soggiorno da immaginare attraverso luce, ambienti e paesaggio. Il viaggio diventa il centro della comunicazione: aprire una finestra, esplorare un borgo, rientrare dopo una passeggiata, prendersi un pomeriggio libero.

La dimora deve sembrare accogliente, curata e ariosa. La voce non imita una trattoria o una bottega: niente enfasi sul mestiere, sulla tavola o sulle tradizioni familiari; nessuna storia di fondazione, recensione o classificazione inventata.

## Palette e leggibilità

| Colore | Valore | Ruolo |
| --- | --- | --- |
| Acqua | `#A7C6C6` | Fasce d’ingresso e invito al soggiorno; richiama estate e piscina |
| Lino | `#FAF4E7` | Fondo principale, continuità tra le pagine e bottoni chiari sulle fotografie |
| Miele | `#B9834E` | Accento grafico, ramo d’ulivo nell’introduzione e piccoli dettagli |
| Verde ulivo | `#65765B` | Pulsanti principali, marchio e corsivi grandi nei titoli |
| Inchiostro di supporto | `#293F3C` | Titoli, testi su acqua e navigazione |
| Testo secondario | `#52615B` | Paragrafi, note e didascalie |
| Accento scuro di supporto | `#875A32` | Focus e numeri decorativi leggibili |

Rapporti di contrasto calcolati con luminanza relativa sRGB: inchiostro/lino 10,24:1; testo secondario/lino 5,95:1; inchiostro/acqua 6,17:1; bianco/ulivo 4,89:1. Ulivo/lino è 4,46:1: riservato a titoli grandi e grafica, non al corpo piccolo. Miele rimane un accento, non il fondo di piccoli testi bianchi. Sulle foto sono presenti gradienti scuri a supporto della leggibilità, concentrati dietro il contenuto; non usare testo piccolo direttamente su zone chiare.

## Composizione

- Hero fotografica a tutta larghezza, senza colonne laterali: paesaggio, titolo ampio e due azioni con gerarchia chiara.
- Primo invito: **Scopri la disponibilità**. Secondo invito: esplorare la dimora.
- Disponibilità nell’header anche a 320 px, nel menu mobile e negli inviti a fine pagina.
- Fasce acqua, fondi lino e fotografie grandi alternano pieni e vuoti. Nessun carosello, autoplay o effetto parallax.
- Camere presentate con fotografie e testi; racconto del soggiorno con una finestra sul paesaggio; territorio con panorama ampio; galleria divisa in categorie accessibili tramite ancore native.
- Le pagine interne iniziano con titolo e introduzione, poi offrono contenuti specifici: non ripetono una hero a due colonne con fotografia.

Tipografia: serif di sistema Palatino/Georgia per titoli, sans serif di sistema per navigazione e testo. Gerarchia fluida con `clamp`; paragrafi distesi, interlinea ampia, niente font scaricati o richieste esterne. Il serif esprime ospitalità e viaggio, senza richiamare incisioni o lavorazioni artigiane.

## Fotografia

Otto fotografie distinte: paesaggio, uliveto, casa con piscina vista dall’alto, tramonto, camera verde salvia, tessuti azzurri, finestra sull’acqua e lettura al risveglio. Fonti: Unsplash e Pexels; elenco, autori, provenienze e licenze in [ASSETS.md](ASSETS.md). Crediti cliccabili anche in Galleria.

I paesaggi d’ambientazione sono toscani. Alcune foto d’interni provengono da altri luoghi: la camera di Clay Banks è negli Stati Uniti; la finestra di Alessandro Guarino è in Umbria. La galleria lo dichiara. Nessuna foto prova l’esistenza della struttura fittizia o di una camera specifica.

Immagini locali con dimensioni intrinseche, lazy loading sotto la prima schermata e priorità alta per l’immagine principale. Hero con `srcset` locale a 900 e 2200 px. Ritagli CSS con `object-fit`; nessuna pipeline remota o account fotografico necessario alla visita.

## Voce e contenuti

Accogliente e concreta: ambienti, luce, materiali, soggiorno e scoperta. Frasi semplici; evitare promesse assolute di benessere, superlativi, recensioni e urgenza commerciale.

Esempi di tono: “Una mattina da dedicare alla scoperta, un pomeriggio da tenere libero”; “Un borgo al mattino, una strada panoramica nel pomeriggio”. La Toscana è un’ambientazione narrativa: non vengono inventati indirizzi, distanze, partenze guidate o certificazioni di accessibilità fisica.

Le tre camere sono **concetti editoriali** (Ulivo, Acqua, Lino), senza quantità, capienza, tariffe o inventario. Esperienze e servizi non sono acquistabili. Contatti chiarisce la natura della demo e offre FAQ native, senza form, email o telefono fittizi.

## Confine della milestone

La destinazione `/disponibilita/` è progettata come ingresso al futuro percorso: stato “Non ancora attiva”, spiegazione e link a camere/territorio. Non include campi data, calendario, risultati, inventario o logica di prenotazione. Qwik City, SSR e adapter Cloudflare Pages restano quelli della foundation. Nessun deployment.

## Criteri di verifica visiva

Controllare Home, Camere, Esperienze, Territorio, Galleria, Contatti e Disponibilità a 1440, 768, 390 e 320 px. Verificare header/CTA, assenza di overflow, taglio delle immagini, leggibilità, ancore, menu, FAQ e focus da tastiera. Per le immagini lazy scorrere la pagina e attendere il caricamento prima di valutarle; una cattura estesa immediata può mostrare immagini ancora fuori area visibile.

Le verifiche effettivamente eseguite e i limiti sono riportati nel worklog. Questa direzione non sostituisce un audit completo di accessibilità o una verifica su browser diversi da quello provato.
