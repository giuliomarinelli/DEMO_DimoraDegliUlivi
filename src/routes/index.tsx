import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Photo } from "~/components/photo/photo";
import { OliveBranch } from "~/components/brand/brand";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";
import { rooms } from "~/data/editorial";

export default component$(() => (
  <>
    <section class="hero" aria-labelledby="hero-title">
      <Photo image="paesaggio" eager class="hero-photo" />
      <div class="hero-shade" />
      <div class="hero-content shell">
        <p class="eyebrow">Dimora degli Ulivi · Toscana</p>
        <h1 id="hero-title">
          La tua parentesi
          <br />
          <em>toscana.</em>
        </h1>
        <p>
          Una casa tra gli ulivi, la luce sulle colline.
          <br />
          Il tempo di stare bene, lontano dal rumore.
        </p>
        <div class="hero-actions">
          <Link href="/disponibilita/" class="button button-linen">
            Scopri la disponibilità <span aria-hidden="true">↗</span>
          </Link>
          <a href="#la-dimora" class="hero-text-link">
            Esplora la dimora <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div class="hero-caption shell">
        <span>Ospitalità di campagna, sguardo contemporaneo</span>
        <span>Paesaggio illustrativo · Kalina O.</span>
      </div>
    </section>
    <div class="welcome-strip">
      <span>Camere da abitare</span>
      <i aria-hidden="true">✳</i>
      <span>Orizzonti da scoprire</span>
      <i aria-hidden="true">✳</i>
      <span>Tempo da ritrovare</span>
    </div>
    <section
      id="la-dimora"
      class="shell introduction section-space"
      aria-labelledby="welcome-title"
    >
      <div>
        <p class="eyebrow">Un piccolo mondo, aperto sul paesaggio</p>
        <h2 id="welcome-title">
          Arrivare.
          <br />
          Aprire le finestre.
          <br />
          <em>Sentirsi altrove.</em>
        </h2>
        <OliveBranch class="intro-branch" />
      </div>
      <div class="introduction-copy">
        <p>
          La Dimora degli Ulivi è la nostra idea di un soggiorno boutique nella
          campagna toscana: ambienti luminosi, pochi dettagli scelti con cura e
          la bellezza del paesaggio che entra in casa.
        </p>
        <p>
          Al risveglio, una colazione in giardino. Poi una strada bianca da
          seguire, un borgo da esplorare, oppure un pomeriggio a bordo piscina.
          Qui la vacanza lascia spazio a quello che ti va di fare.
        </p>
        <p class="editorial-note">
          Un’ospitalità immaginata per questa demo. Camere, servizi e soggiorni
          descritti non sono reali.
        </p>
      </div>
    </section>
    <section class="rooms-section section-space" aria-labelledby="rooms-title">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Le camere</p>
            <h2 id="rooms-title">
              Il paesaggio fuori.
              <br />
              <em>Il tuo spazio, dentro.</em>
            </h2>
          </div>
          <Link href="/camere/" class="text-link">
            Scopri tutte le camere <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div class="room-grid">
          {rooms.map((room) => (
            <article class="room-card" key={room.id}>
              <Link
                href={"/camere/#" + room.id}
                class="room-photo-link"
                aria-label={"Scopri " + room.name}
              >
                <Photo image={room.image} />
                <span class="photo-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <p class="eyebrow">{room.mood}</p>
              <h3>
                <Link href={"/camere/#" + room.id}>{room.name}</Link>
              </h3>
              <p>{room.description}</p>
            </article>
          ))}
        </div>
        <p class="editorial-note mt-8">
          Tre atmosfere dimostrative. Fotografie d’ispirazione; nessuna camera
          prenotabile.
        </p>
      </div>
    </section>
    <section
      class="shell section-space hospitality-story"
      aria-labelledby="hospitality-title"
    >
      <div class="hospitality-image">
        <Photo image="finestra" />
        <span class="image-label">Dentro e fuori, la stessa calma.</span>
      </div>
      <div class="hospitality-copy">
        <p class="eyebrow">Il piacere di soggiornare</p>
        <h2 id="hospitality-title">
          Tra un tuffo
          <br />e un nuovo
          <br />
          <em>orizzonte.</em>
        </h2>
        <p>
          Una mattina da dedicare alla scoperta, un pomeriggio da tenere libero.
          Immaginiamo una dimora da vivere anche senza uscire, tra il giardino,
          l’acqua e la luce che cambia.
        </p>
        <Link href="/esperienze/" class="text-link">
          Trova il tuo ritmo <span aria-hidden="true">↗</span>
        </Link>
        <p class="editorial-note mt-6">
          Scena illustrativa fotografata in Umbria; non raffigura una struttura
          esistente con questo nome.
        </p>
      </div>
    </section>
    <section class="landscape-feature" aria-labelledby="territory-title">
      <Photo image="orizzonti" class="landscape-image" />
      <div class="landscape-shade" />
      <div class="shell landscape-content">
        <p class="eyebrow">Fuori dalla dimora</p>
        <h2 id="territory-title">
          La Toscana,
          <br />
          <em>un giorno alla volta.</em>
        </h2>
        <p>
          Colline, cipressi e piccoli borghi.
          <br />
          Partire per una passeggiata, tornare con una storia.
        </p>
        <Link href="/territorio/" class="button button-linen">
          Esplora il territorio <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
    <section
      class="shell section-space gallery-invite"
      aria-labelledby="gallery-title"
    >
      <div>
        <p class="eyebrow">Prima del viaggio</p>
        <h2 id="gallery-title">
          Immagina di
          <br />
          <em>essere già qui.</em>
        </h2>
        <p>
          Luce sulle pareti, un libro sul comodino, il verde oltre una finestra.
          Il nostro album raccoglie le immagini da cui nasce l’atmosfera della
          dimora.
        </p>
        <Link href="/galleria/" class="text-link">
          Entra nella galleria <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div class="gallery-pair">
        <Photo image="dettaglio" />
        <Photo image="uliveto" />
      </div>
    </section>
    <StayInvitation />
  </>
));
export const head: DocumentHead = {
  title: "Dimora degli Ulivi | La tua parentesi toscana · Demo",
  meta: [
    {
      name: "description",
      content:
        "Immagina il tuo soggiorno boutique in Toscana: camere luminose, giardino, paesaggi ed esperienze. Dimora degli Ulivi è una struttura fittizia, senza prenotazioni reali.",
    },
  ],
};
