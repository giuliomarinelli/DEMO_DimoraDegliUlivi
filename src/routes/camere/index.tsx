import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";
import { rooms } from "~/data/editorial";

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Camere"
      title="Il tuo spazio, nella luce della Toscana."
      description="Tre atmosfere, una stessa idea di accoglienza. Colori naturali, tessuti leggeri e dettagli pensati per il piacere di fermarsi: scegli la camera in cui immaginare il tuo soggiorno."
    >
      <p class="editorial-note">
        Presentazioni editoriali della demo, senza inventario, tariffe o camere
        prenotabili. Le fotografie sono illustrative.
      </p>
    </PageIntro>
    <div class="shell rooms-editorial">
      {rooms.map((room, index) => (
        <article
          class={["room-detail", index % 2 === 1 && "room-detail-reverse"]}
          id={room.id}
          key={room.id}
        >
          <figure>
            <Photo image={room.image} eager={index === 0} />
            <figcaption>Atmosfera illustrativa · {room.name}</figcaption>
          </figure>
          <div class="room-detail-copy">
            <p class="eyebrow">{room.mood}</p>
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <ul class="detail-list">
              {room.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <Link href="/disponibilita/" class="text-link">
              Verso la disponibilità demo <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
    <section class="linen-band">
      <div class="shell comfort-grid">
        <div>
          <p class="eyebrow">Il soggiorno che immaginiamo</p>
          <h2>
            Curato nei dettagli.
            <br />
            <em>Libero nel ritmo.</em>
          </h2>
        </div>
        <div>
          <h3>Un risveglio in giardino</h3>
          <p>
            Una colazione all’aperto e il tempo per decidere come vivere la
            giornata.
          </p>
          <h3>Il piacere di rientrare</h3>
          <p>
            Una pausa nel verde, un angolo per leggere e un pomeriggio da
            lasciare senza impegni.
          </p>
          <p class="editorial-note">
            Servizi narrativi della struttura fittizia. Per informazioni
            sull’accessibilità o esigenze specifiche non sono disponibili
            verifiche di una struttura reale.
          </p>
        </div>
      </div>
    </section>
    <StayInvitation />
  </>
));
export const head: DocumentHead = {
  title: "Camere e atmosfere | Dimora degli Ulivi · Demo",
  meta: [
    {
      name: "description",
      content:
        "Scopri Camera Ulivo, Camera Acqua e Camera Lino: tre atmosfere luminose per un soggiorno boutique immaginario in Toscana. Foto illustrative, nessuna prenotazione.",
    },
  ],
};
