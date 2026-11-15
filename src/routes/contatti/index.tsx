import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";

export default component$(() => (
  <PageIntro
    eyebrow="Contatti"
    title="Una casa immaginata. Un racconto aperto."
    description="Dimora degli Ulivi è un progetto dimostrativo dedicato all’ospitalità di campagna. L’azienda non esiste: non sono presenti un recapito telefonico, un indirizzo visitabile o una casella di prenotazione."
    note="Puoi esplorare liberamente le pagine. Non raccogliamo richieste e non inviamo messaggi: non occorre inserire dati personali per visitare questa demo."
  />
));
export const head: DocumentHead = {
  title: "Contatti e informazioni sulla demo | Dimora degli Ulivi",
  meta: [
    {
      name: "description",
      content:
        "Informazioni sulla natura dimostrativa della Dimora degli Ulivi. Nessuna azienda reale, nessun invio di messaggi o raccolta di richieste.",
    },
  ],
};
