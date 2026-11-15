import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";

export default component$(() => (
  <PageIntro
    eyebrow="Ricerca disponibilità"
    title="Il prossimo soggiorno comincia da un’idea."
    description="Per ora, lasciati accompagnare tra le pagine della dimora. La ricerca simulata delle camere è in preparazione e non è ancora disponibile."
    note="In una fase successiva potrai esplorare date e disponibilità dimostrative. Non saranno effettuate prenotazioni, richieste a una struttura o pagamenti reali."
  >
    <Link href="/camere/" class="button mt-8">
      Scopri l’idea delle camere <span aria-hidden="true">↗</span>
    </Link>
  </PageIntro>
));
export const head: DocumentHead = {
  title: "Disponibilità in preparazione | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "La ricerca simulata delle camere è in preparazione. Esplora la dimora fittizia: nessuna prenotazione o pagamento reale.",
    },
  ],
};
