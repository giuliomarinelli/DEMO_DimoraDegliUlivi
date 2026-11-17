import { component$ } from "@builder.io/qwik";
import {
  Link,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";

export const onGet: RequestHandler = ({ status }) => {
  status(404);
};

export default component$(() => (
  <section class="shell inner-page">
    <p class="eyebrow">404 · Un sentiero da ritrovare</p>
    <h1 class="page-title">
      Questa pagina
      <br />
      non è qui.
    </h1>
    <p class="page-description">
      Il percorso che hai seguito non esiste. Riparti dalla dimora per
      continuare a esplorare.
    </p>
    <Link href="/" class="button mt-8">
      Torna alla dimora <span aria-hidden="true">↗</span>
    </Link>
  </section>
));
export const head: DocumentHead = {
  title: "Pagina non trovata | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Il percorso richiesto non esiste. Torna alla homepage della Dimora degli Ulivi, progetto dimostrativo.",
    },
  ],
};
