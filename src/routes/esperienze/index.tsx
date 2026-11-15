import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";
import { experiences } from "~/data/editorial";

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Esperienze"
      title="La vacanza, come piace a te."
      description="Ci sono giornate da riempire di scoperte e altre da lasciare aperte. Alla dimora immaginiamo entrambe: il paesaggio come punto di partenza, la libertà di scegliere come viverlo."
    >
      <p class="editorial-note">
        Idee dimostrative di soggiorno: nessuna attività acquistabile, guida
        prenotabile o servizio reale.
      </p>
    </PageIntro>
    <div class="shell experience-grid">
      {experiences.map((experience) => (
        <article id={experience.id} key={experience.id} class="experience-card">
          <Photo image={experience.image} />
          <div>
            <p class="eyebrow">{experience.moment}</p>
            <h2>{experience.name}</h2>
            <p>{experience.description}</p>
            <p class="experience-suggestion">{experience.suggestion}</p>
          </div>
        </article>
      ))}
    </div>
    <section class="aqua-band">
      <div class="shell comfort-grid">
        <div>
          <p class="eyebrow">Un giorno diverso</p>
          <h2>
            Uscire per scoprire.
            <br />
            <em>Tornare per stare bene.</em>
          </h2>
        </div>
        <div>
          <p>
            Un borgo al mattino, una strada panoramica nel pomeriggio. Puoi
            trovare un punto di partenza nel nostro taccuino del territorio e
            costruire il tuo itinerario, senza corse da una tappa all’altra.
          </p>
          <Link href="/territorio/" class="text-link">
            Apri il taccuino di viaggio <span aria-hidden="true">↗</span>
          </Link>
          <p class="editorial-note mt-6">
            Gli spunti non costituiscono itinerari guidati o indicazioni
            operative di escursionismo.
          </p>
        </div>
      </div>
    </section>
    <StayInvitation />
  </>
));
export const head: DocumentHead = {
  title: "Esperienze e idee di soggiorno | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Passeggiate tra gli ulivi, pomeriggi d’estate e tramonti sulle colline: idee per vivere una vacanza toscana. Esperienze narrative, nessun servizio prenotabile.",
    },
  ],
};
