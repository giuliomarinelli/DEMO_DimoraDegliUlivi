import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";
import { photos, type PhotoKey } from "~/data/photos";

const groups: {
  id: string;
  title: string;
  description: string;
  images: PhotoKey[];
}[] = [
  {
    id: "paesaggi",
    title: "Paesaggi",
    description:
      "Colline, ulivi e architetture: la Toscana come punto di partenza.",
    images: ["paesaggio", "orizzonti", "tenuta"],
  },
  {
    id: "camere",
    title: "Camere e dettagli",
    description:
      "Colori, luce e piccoli gesti che danno forma all’idea del soggiorno.",
    images: ["ulivo", "acqua", "dettaglio"],
  },
  {
    id: "atmosfere",
    title: "Atmosfere",
    description:
      "Una finestra aperta, l’ombra degli ulivi: immagini per sognare la prossima partenza.",
    images: ["finestra", "uliveto"],
  },
];
export default component$(() => (
  <>
    <PageIntro
      eyebrow="Galleria"
      title="Il tuo soggiorno, in immagini."
      description="Un album d’ispirazione da sfogliare con calma. Paesaggi toscani, ambienti e dettagli d’ospitalità raccolgono i colori e le sensazioni da cui nasce la Dimora degli Ulivi."
    >
      <p class="editorial-note">
        Le foto ritraggono luoghi e ambienti reali diversi. Non sono fotografie
        di una struttura esistente chiamata Dimora degli Ulivi.
      </p>
    </PageIntro>
    <nav class="shell gallery-nav" aria-label="Categorie della galleria">
      <a href="#paesaggi">Paesaggi</a>
      <a href="#camere">Camere e dettagli</a>
      <a href="#atmosfere">Atmosfere</a>
    </nav>
    <div class="shell gallery-sections">
      {groups.map((group) => (
        <section
          id={group.id}
          key={group.id}
          class="gallery-group"
          aria-labelledby={group.id + "-title"}
        >
          <div class="section-heading">
            <h2 id={group.id + "-title"}>{group.title}</h2>
            <p>{group.description}</p>
          </div>
          <div class="gallery-grid">
            {group.images.map((image) => (
              <figure key={image}>
                <Photo image={image} />
                <figcaption>
                  <strong>{photos[image].title}</strong>
                  <span>{photos[image].place}</span>
                  <a
                    href={photos[image].source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {photos[image].author} / {photos[image].provider}{" "}
                    <span class="sr-only">
                      (fonte della fotografia, nuova scheda)
                    </span>
                    ↗
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
    <StayInvitation />
  </>
));
export const head: DocumentHead = {
  title: "Galleria fotografica e crediti | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Paesaggi, camere e dettagli d’ospitalità nell’album della Dimora degli Ulivi. Foto illustrative da Unsplash e Pexels, con autori e fonti consultabili.",
    },
  ],
};
