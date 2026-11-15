import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";

export default component$(() => (
  <PageIntro
    eyebrow="Esperienze"
    title="Il lusso di avere tempo."
    description="Camminare tra gli ulivi, riconoscere il profumo delle erbe, ritrovarsi attorno a una tavola. Immaginiamo esperienze che seguano le stagioni e lascino spazio alla curiosità."
    note="Il taccuino comincia da una passeggiata in campagna e dall’olio nuovo sul pane. Le attività sono spunti narrativi della demo: non esistono un calendario o servizi prenotabili."
  />
));
export const head: DocumentHead = {
  title: "Esperienze | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Il primo racconto delle esperienze immaginarie della dimora: ulivi, sapori e stagioni. Nessuna attività prenotabile.",
    },
  ],
};
