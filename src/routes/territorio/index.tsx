import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Territorio"
      title="Un viaggio dentro il paesaggio."
      description="Colline che si rincorrono, cipressi lungo le strade, borghi dove fermarsi senza fretta. Il nostro immaginario parte dalla Toscana e trova nella Val d’Orcia un invito a esplorare."
    >
      <p class="editorial-note">
        La dimora non ha una posizione reale. Questi sono luoghi d’ispirazione:
        non indichiamo distanze o tragitti dalla struttura fittizia.
      </p>
    </PageIntro>
    <figure class="shell territory-panorama">
      <Photo image="orizzonti" eager />
      <figcaption>
        Una Toscana di luce e orizzonti · Alan Jiang / Unsplash
      </figcaption>
    </figure>
    <section class="shell section-space" aria-labelledby="places-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Il taccuino del territorio</p>
          <h2 id="places-title">
            Tre soste,
            <br />
            <em>tante prospettive.</em>
          </h2>
        </div>
        <p>
          Spunti per conoscere la Val d’Orcia.
          <br />
          Da vivere con i propri tempi.
        </p>
      </div>
      <div class="places-grid">
        <article>
          <span class="place-number">01</span>
          <h3>Pienza</h3>
          <p>
            Il piacere di passeggiare tra piazze e vicoli, poi cercare uno
            scorcio aperto sulla campagna. Una sosta da dedicare allo sguardo,
            tra architettura e paesaggio.
          </p>
          <span class="eyebrow">Borghi e prospettive</span>
        </article>
        <article>
          <span class="place-number">02</span>
          <h3>San Quirico d’Orcia</h3>
          <p>
            Un borgo da attraversare a piedi e un territorio segnato dai
            cipressi. L’idea è alternare una passeggiata tra le vie a una pausa
            davanti alle colline.
          </p>
          <span class="eyebrow">Cipressi e strade di campagna</span>
        </article>
        <article>
          <span class="place-number">03</span>
          <h3>Bagno Vignoni</h3>
          <p>
            La grande vasca termale al centro del borgo regala una prospettiva
            insolita. Una tappa da osservare e raccontare, prima di continuare
            il proprio viaggio.
          </p>
          <span class="eyebrow">Acqua e storia</span>
        </article>
      </div>
      <p class="source-note">
        Per conoscere i luoghi reali:{" "}
        <a
          href="https://www.visittuscany.com/it/territori/val-dorcia/"
          target="_blank"
          rel="noreferrer"
        >
          Val d’Orcia sul sito ufficiale Visit Tuscany{" "}
          <span class="sr-only">(si apre in una nuova scheda)</span>↗
        </a>
        . Le fotografie di questa demo sono illustrative e non documentano tutte
        le tappe descritte.
      </p>
    </section>
    <section class="aqua-band">
      <div class="shell comfort-grid">
        <div>
          <p class="eyebrow">Il paesaggio cambia, il piacere resta</p>
          <h2>
            La Toscana,
            <br />
            <em>nelle sue stagioni.</em>
          </h2>
        </div>
        <div class="season-grid">
          <div>
            <h3>Primavera</h3>
            <p>
              Verde nuovo, giornate che si allungano e voglia di stare
              all’aperto.
            </p>
          </div>
          <div>
            <h3>Estate</h3>
            <p>
              Partenze al mattino, una pausa nelle ore calde e la luce fino a
              sera.
            </p>
          </div>
          <div>
            <h3>Autunno</h3>
            <p>
              Colori caldi e passeggiate da accompagnare con uno strato in più.
            </p>
          </div>
          <div>
            <h3>Inverno</h3>
            <p>
              Orizzonti quieti, un borgo da esplorare e il piacere di rientrare.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="shell section-space text-center">
      <p class="eyebrow">Il viaggio comincia anche dagli occhi</p>
      <h2 class="mt-4 mb-8">
        Porta con te <em>un’immagine.</em>
      </h2>
      <Link href="/galleria/#paesaggi" class="text-link">
        Esplora i paesaggi della galleria <span aria-hidden="true">↗</span>
      </Link>
    </section>
    <StayInvitation />
  </>
));
export const head: DocumentHead = {
  title: "Territorio e Val d’Orcia | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Pienza, San Quirico d’Orcia e Bagno Vignoni: un taccuino d’ispirazione per esplorare la Toscana. Nessuna ubicazione o distanza attribuita alla dimora fittizia.",
    },
  ],
};
