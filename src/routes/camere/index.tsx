import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";

export default component$(() => (
  <PageIntro
    eyebrow="Camere"
    title="Il riposo, nella sua forma più semplice."
    description="La luce che attraversa una tenda di lino, il legno sotto le dita, il verde oltre la finestra. Le camere della nostra dimora immaginaria nascono da queste piccole sensazioni."
    note="Stiamo dando forma agli spazi del soggiorno: materiali naturali, colori quieti e un dialogo continuo con la campagna. Le presentazioni delle singole camere arriveranno in una fase successiva."
  />
));
export const head: DocumentHead = {
  title: "Camere | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Una prima idea delle camere della Dimora degli Ulivi: luce, lino e quiete. Contenuti dimostrativi, nessun soggiorno reale.",
    },
  ],
};
