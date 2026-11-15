import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";

export default component$(() => (
  <PageIntro
    eyebrow="Territorio"
    title="La strada più bella è quella senza fretta."
    description="Le colline toscane sono l’ispirazione di questo progetto: filari d’ulivi, borghi raccolti e strade bianche da percorrere piano. Un paesaggio che diventa parte del soggiorno, anche quando ci si ferma."
    note="La Dimora degli Ulivi non ha una posizione geografica reale. Le immagini raccontano la Toscana e offrono un’atmosfera di riferimento; itinerari e luoghi della demo verranno sviluppati più avanti."
  />
));
export const head: DocumentHead = {
  title: "Territorio | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Colline, ulivi e strade bianche: l’ispirazione toscana della Dimora degli Ulivi. Struttura fittizia, senza indirizzo reale.",
    },
  ],
};
