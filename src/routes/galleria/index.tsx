/* eslint-disable qwik/jsx-img -- Reuses the sized and compressed local WebP assets from the homepage. */
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Galleria"
      title="Due sguardi, un inizio."
      description="La campagna vista da lontano, un ulivo osservato da vicino. Le prime immagini compongono il nostro quaderno d’ispirazione, tra orizzonti e dettagli."
      note="Fotografie illustrative di luoghi reali, scelte per raccontare l’atmosfera di una struttura fittizia. Non ritraggono una Dimora degli Ulivi esistente."
    />
    <div class="shell gallery-preview">
      <figure>
        <img
          src="/images/podere.webp"
          width={1800}
          height={1200}
          loading="lazy"
          alt="Case e uliveti nel paesaggio toscano"
        />
        <figcaption>Orizzonti toscani · Kalina O. / Unsplash</figcaption>
      </figure>
      <figure>
        <img
          src="/images/uliveto.webp"
          width={1000}
          height={750}
          loading="lazy"
          alt="Ulivi secolari in un campo a Pelago, in Toscana"
        />
        <figcaption>Tra gli ulivi · Andreas Weilguny / Unsplash</figcaption>
      </figure>
    </div>
  </>
));
export const head: DocumentHead = {
  title: "Galleria | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Le prime fotografie d’ispirazione per la dimora fittizia. Paesaggi e ulivi toscani, con attribuzioni degli autori.",
    },
  ],
};
