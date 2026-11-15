import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Ricerca disponibilità"
      title="Il tuo prossimo soggiorno comincia qui."
      description="Hai trovato l’atmosfera che cercavi? Questo sarà il punto di partenza per esplorare le camere disponibili in una simulazione di soggiorno."
    >
      <span class="status-pill">Ricerca demo · Non ancora attiva</span>
    </PageIntro>
    <section
      class="shell availability-panel"
      aria-labelledby="availability-title"
    >
      <div class="availability-copy">
        <p class="eyebrow">Presto, un viaggio da immaginare</p>
        <h2 id="availability-title">
          La ricerca è<br />
          <em>in preparazione.</em>
        </h2>
        <p>
          Il calendario e i risultati dimostrativi non sono ancora disponibili.
          In questa fase puoi scoprire le camere, scegliere la tua atmosfera e
          trovare un’idea per il viaggio.
        </p>
        <p>
          Non viene verificata alcuna disponibilità reale e non sono possibili
          prenotazioni o pagamenti.
        </p>
        <div class="availability-links">
          <Link href="/camere/" class="button">
            Esplora le camere <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/territorio/" class="text-link">
            Idee per il viaggio <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <Photo image="acqua" eager />
    </section>
    <section class="shell availability-explainer section-space">
      <p class="eyebrow">Una demo, sempre dichiarata</p>
      <h2>
        Esplorare, <em>senza prenotare.</em>
      </h2>
      <p>
        La futura ricerca avrà soltanto uno scopo dimostrativo. Non contatterà
        hotel, non bloccherà camere e non invierà richieste. Per conoscere il
        progetto e i suoi limiti puoi consultare le{" "}
        <Link href="/contatti/#domande">domande frequenti</Link>.
      </p>
    </section>
  </>
));
export const head: DocumentHead = {
  title: "Disponibilità demo in preparazione | Dimora degli Ulivi",
  meta: [
    {
      name: "description",
      content:
        "La ricerca disponibilità simulata della Dimora degli Ulivi è in preparazione. Scopri camere e territorio: calendario e prenotazioni non sono attivi.",
    },
  ],
};
