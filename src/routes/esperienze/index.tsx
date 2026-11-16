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
      description="Un dettaglio da disegnare al mattino, un capitolo da leggere nel pomeriggio, poche righe da scrivere la sera. Tre scene immaginate per dare un ritmo personale al soggiorno, senza programmi da prenotare."
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
    <section class="linen-band" aria-labelledby="indoor-title">
      <div class="shell grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <figure>
          <Photo image="dettaglio" class="aspect-[5/4] w-full" />
          <figcaption>
            Un libro come punto di partenza · Andrea Kartali / Pexels
          </figcaption>
        </figure>
        <div>
          <p class="eyebrow">Se preferisci restare al coperto</p>
          <h2 id="indoor-title" class="mt-4 mb-6">
            Una pagina aperta. <em>Il resto può aspettare.</em>
          </h2>
          <p class="text-muted text-sm leading-8">
            Immagina di tornare in camera con il tuo libro, scegliere un
            racconto breve e leggerlo fino in fondo. Accanto, sul tuo taccuino,
            puoi raccogliere il nome di un luogo che vorresti conoscere: Pienza,
            San Quirico d’Orcia o Bagno Vignoni. È un altro modo di preparare il
            viaggio, anche quando non hai voglia di uscire.
          </p>
          <p class="editorial-note mt-5">
            Una proposta da vivere con ciò che porti con te, non un laboratorio,
            una biblioteca o un servizio della struttura.
          </p>
        </div>
      </div>
    </section>
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
        "Osservare gli ulivi, leggere nel pomeriggio e scrivere un ricordo la sera, con un’alternativa al coperto. Scene di soggiorno immaginate, nessun servizio prenotabile.",
    },
  ],
};
