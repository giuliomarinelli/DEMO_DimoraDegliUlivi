import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Contatti"
      title="Prima di immaginare la partenza."
      description="Una piccola guida alla visita e le risposte alle domande sulla demo. Puoi esplorare le camere, provare la ricerca e conoscere le fonti delle fotografie: la struttura e il soggiorno raccontati sono fittizi."
    >
      <a href="#domande" class="text-link">
        Leggi le domande frequenti <span aria-hidden="true">↓</span>
      </a>
    </PageIntro>
    <section class="shell contact-story">
      <Photo image="tenuta" eager />
      <div>
        <p class="eyebrow">Una nota, prima del viaggio</p>
        <h2>
          Ospitalità immaginata.
          <br />
          <em>Informazioni trasparenti.</em>
        </h2>
        <p>
          Dimora degli Ulivi non è un’azienda ricettiva attiva. Non esistono un
          indirizzo da raggiungere, un recapito telefonico o una casella per le
          prenotazioni.
        </p>
        <p>
          Per questo non trovi una mappa o un modulo di contatto. Puoi conoscere
          gli ambienti immaginati, esplorare gli spunti di viaggio e provare la
          ricerca dimostrativa, senza inserire dati personali.
        </p>
        <Link href="/camere/" class="text-link">
          Conosci le camere <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
    <section class="shell py-12 md:py-16" aria-labelledby="demo-guide-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Da dove partire</p>
          <h2 id="demo-guide-title">
            Come esplorare <em>la demo.</em>
          </h2>
        </div>
        <p>Tre passi, senza account, dati personali o richieste da inviare.</p>
      </div>
      <ol class="grid gap-8 md:grid-cols-3">
        <li class="border-olive/25 min-w-0 border-t pt-6">
          <p class="eyebrow">01 · Immagina il soggiorno</p>
          <h3 class="mt-4 mb-4 text-2xl">Trova la tua atmosfera</h3>
          <p class="text-muted mb-4 text-sm leading-8">
            Confronta caratteri e capienze di Ulivo, Acqua e Lino. Poi lasciati
            accompagnare dalle scene di soggiorno raccontate in Esperienze.
          </p>
          <Link href="/camere/#room-comparison-title" class="text-link">
            Confronta le camere <span aria-hidden="true">↗</span>
          </Link>
        </li>
        <li class="border-olive/25 min-w-0 border-t pt-6">
          <p class="eyebrow">02 · Metti alla prova la ricerca</p>
          <h3 class="mt-4 mb-4 text-2xl">Prova un soggiorno demo</h3>
          <p class="text-muted mb-4 text-sm leading-8">
            Scegli date, ospiti e camere. Puoi partire dall’esempio già presente
            nel simulatore, leggere il dettaglio degli importi e modificare la
            ricerca: non prenoti e non blocchi nulla.
          </p>
          <Link href="/disponibilita/" class="text-link">
            Prova il simulatore <span aria-hidden="true">↗</span>
          </Link>
        </li>
        <li class="border-olive/25 min-w-0 border-t pt-6">
          <p class="eyebrow">03 · Conosci le ispirazioni</p>
          <h3 class="mt-4 mb-4 text-2xl">Guarda oltre le fotografie</h3>
          <p class="text-muted mb-4 text-sm leading-8">
            In Galleria trovi autori, provenienze e fonti: le immagini arrivano
            da luoghi diversi e non ritraggono una struttura chiamata Dimora
            degli Ulivi.
          </p>
          <Link href="/galleria/" class="text-link">
            Esplora foto e crediti <span aria-hidden="true">↗</span>
          </Link>
        </li>
      </ol>
    </section>
    <section
      id="domande"
      class="shell faq-section section-space"
      aria-labelledby="faq-title"
    >
      <div>
        <p class="eyebrow">Per orientarsi</p>
        <h2 id="faq-title">
          Le tue domande,
          <br />
          <em>con semplicità.</em>
        </h2>
      </div>
      <div class="faq-list">
        <details>
          <summary>Posso prenotare un soggiorno?</summary>
          <p>
            No. Il sito è una demo e non effettua prenotazioni, pagamenti o
            richieste a una struttura. Puoi confrontare disponibilità e importi
            esclusivamente simulati, senza bloccare camere.
          </p>
          <Link href="/disponibilita/" class="text-link">
            Prova il simulatore <span aria-hidden="true">↗</span>
          </Link>
        </details>
        <details>
          <summary>Dove si trova la dimora?</summary>
          <p>
            Non ha un indirizzo reale. La Toscana è l’ambientazione narrativa
            del progetto; i luoghi del territorio sono proposte d’ispirazione,
            senza distanze o collegamenti dalla struttura.
          </p>
        </details>
        <details>
          <summary>Le camere e i servizi sono reali?</summary>
          <p>
            No. Camere, giardino, piscina e colazione fanno parte del racconto
            dimostrativo. Le foto sono illustrative e provengono da luoghi
            diversi; autori e fonti sono indicati in Galleria.
          </p>
        </details>
        <details>
          <summary>Posso chiedere informazioni sull’accessibilità?</summary>
          <p>
            Non esistendo una struttura reale, non possiamo confermare misure,
            percorsi o dotazioni delle camere. Il sito è progettato per la
            navigazione da tastiera; questo non implica l’accessibilità fisica
            dei luoghi fotografati.
          </p>
        </details>
        <details>
          <summary>Vengono inviati messaggi o raccolte richieste?</summary>
          <p>
            No. Non sono presenti moduli di contatto, newsletter o collegamenti
            di invio. Per esplorare questa demo non occorrono un account o dati
            personali.
          </p>
        </details>
      </div>
    </section>
    <StayInvitation />
  </>
));
export const head: DocumentHead = {
  title: "Contatti e domande frequenti | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Tutte le informazioni sulla demo: struttura fittizia, servizi immaginati, fotografie illustrative e simulatore disponibilità. Nessun invio di richieste o prenotazione.",
    },
  ],
};
