/* eslint-disable qwik/jsx-img -- Local WebP assets are already compressed, sized and intentionally served without the image transformation pipeline. */
import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { OliveBranch } from "~/components/brand/brand";

export default component$(() => (
  <>
    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="small-line" /> Ospitalità di campagna, in Toscana
        </p>
        <h1 id="hero-title">
          Il tempo, qui,
          <br />
          ha un <em>altro</em>
          <br />
          passo.
        </h1>
        <p class="hero-description">
          Tra il verde degli ulivi e la luce delle colline, una dimora da
          abitare con calma. E il piacere semplice di sentirsi a casa.
        </p>
        <Link href="/camere/" class="button">
          Entra nella dimora <span aria-hidden="true">↗</span>
        </Link>
        <p class="hero-footnote">Terra, silenzio e piccole cose fatte bene.</p>
      </div>
      <figure class="hero-figure">
        <img
          class="hero-image"
          src="/images/podere.webp"
          width={1800}
          height={1200}
          alt="Case di campagna tra ulivi e colline toscane, immagine d’ispirazione per la dimora fittizia"
          fetchPriority="high"
        />
        <div class="hero-seal" aria-hidden="true">
          <OliveBranch class="h-12 w-10" />
          <span>
            RADICI IN TERRA
            <br />
            SGUARDO LENTO
          </span>
        </div>
        <figcaption>
          <span>01 / Appunti di campagna</span>
          <span>Un paesaggio da immaginare, insieme.</span>
        </figcaption>
      </figure>
    </section>
    <div class="shell qualities" aria-label="Lo spirito della dimora">
      <p>
        <span aria-hidden="true">01</span> Il ritmo delle stagioni
      </p>
      <p>
        <span aria-hidden="true">02</span> L’intimità di una casa
      </p>
      <p>
        <span aria-hidden="true">03</span> La bellezza dell’essenziale
      </p>
    </div>
    <section class="shell story" aria-labelledby="story-title">
      <figure class="story-image">
        <img
          src="/images/uliveto.webp"
          width={1000}
          height={750}
          loading="lazy"
          alt="Un uliveto toscano nella luce del mattino"
        />
        <figcaption>Il nostro punto di partenza: la terra.</figcaption>
      </figure>
      <div class="story-copy">
        <p class="eyebrow">Benvenuti alla Dimora degli Ulivi</p>
        <h2 id="story-title">
          Ci sono luoghi
          <br />
          che invitano a <em>restare.</em>
        </h2>
        <p>
          Abbiamo immaginato una casa di campagna dove aprire le finestre sul
          verde, fare colazione senza guardare l’orologio e lasciare che sia la
          giornata a scegliere la strada.
        </p>
        <p>
          Una Toscana raccolta e quotidiana: il pane sulla tavola, i sentieri
          tra gli ulivi, un libro lasciato a metà. Da qui comincia il racconto
          della nostra dimora.
        </p>
        <Link href="/territorio/" class="text-link">
          Intorno a noi <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
    <section class="discover" aria-labelledby="discover-title">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Il piacere delle cose semplici</p>
            <h2 id="discover-title">A ciascuno, il suo ritmo.</h2>
          </div>
          <p>
            Tre modi per entrare
            <br />
            nel mondo della dimora.
          </p>
        </div>
        <div class="discovery-grid">
          {[
            {
              number: "01",
              title: "Abitare la quiete",
              text: "Lino, toni naturali e luce del mattino. L’idea di un riposo che sa di casa.",
              href: "/camere/",
              label: "Le camere",
            },
            {
              number: "02",
              title: "Coltivare il tempo",
              text: "Una passeggiata nell’uliveto, i sapori della terra, il racconto di una stagione.",
              href: "/esperienze/",
              label: "Le esperienze",
            },
            {
              number: "03",
              title: "Seguire la bellezza",
              text: "Strade bianche, piccoli borghi e orizzonti aperti. La campagna come compagna di viaggio.",
              href: "/territorio/",
              label: "Il territorio",
            },
          ].map((item) => (
            <article key={item.number} class="discovery-item">
              <span class="chapter-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link href={item.href} class="text-link">
                {item.label}
                <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section class="shell closing">
      <OliveBranch class="h-20 w-16" />
      <p class="eyebrow">Una finestra sulla dimora</p>
      <h2>
        Prima di partire,
        <br />
        <em>lasciati ispirare.</em>
      </h2>
      <Link href="/galleria/" class="button button-outline">
        Sfoglia le prime immagini <span aria-hidden="true">↗</span>
      </Link>
      <p class="mt-6 text-sm">
        Una storia immaginaria, raccontata con trasparenza.
      </p>
    </section>
  </>
));

export const head: DocumentHead = {
  title: "Dimora degli Ulivi | Un altro passo, in Toscana · Demo",
  meta: [
    {
      name: "description",
      content:
        "Una dimora immaginaria tra gli ulivi della Toscana. Scopri lo spirito della casa, le camere e le esperienze di questo agriturismo dimostrativo.",
    },
  ],
};
