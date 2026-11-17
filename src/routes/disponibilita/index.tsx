import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { AvailabilitySearch } from "~/components/availability-search/availability-search";
import { initialSearch } from "~/lib/availability";

// SSR and native GET fallback use the same local pure engine as client submissions.
export const useAvailability = routeLoader$(({ url }) =>
  initialSearch(url.searchParams),
);

export default component$(() => {
  const search = useAvailability();
  return (
    <>
      <PageIntro
        eyebrow="Ricerca disponibilità"
        title="Il tuo prossimo soggiorno comincia qui."
        description="Scegli le date, immagina con chi partire e scopri le combinazioni delle nostre camere. Un piccolo viaggio nella Toscana della dimora, interamente dimostrativo."
      >
        <span class="status-pill">
          Simulatore attivo · Nessuna prenotazione reale
        </span>
      </PageIntro>
      <AvailabilitySearch initial={search.value} />
      <section class="shell availability-explainer section-space">
        <p class="eyebrow">Una demo, sempre dichiarata</p>
        <h2>
          Esplorare, <em>senza prenotare.</em>
        </h2>
        <p>
          Calendario, inventario e importi sono fittizi e riproducibili. Le
          disponibilità non cambiano con le ricerche: non contattiamo hotel, non
          blocchiamo camere e non inviamo richieste. L’assenza di risultati può
          dipendere dalle occupazioni simulate o dalla chiusura dal 1 al 14
          novembre.
        </p>
      </section>
    </>
  );
});
export const head: DocumentHead = {
  title: "Simulatore disponibilità camere | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Scegli date, ospiti e camere nel calendario demo 2027. Confronta soluzioni, capienze e importi indicativi della Dimora degli Ulivi. Nessuna prenotazione reale.",
    },
  ],
};
