import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PageIntro } from "~/components/page-intro/page-intro";
import { Photo } from "~/components/photo/photo";
import { StayInvitation } from "~/components/stay-invitation/stay-invitation";
import { rooms } from "~/data/editorial";
import { ROOM_TYPES, ROOM_UNITS, formatMoney } from "~/lib/availability";

// Read the same catalog as the simulator; no editorial copy of capacity or stock.
const roomCatalog = rooms.map((room) => ({
  ...room,
  ...ROOM_TYPES.find((type) => type.id === room.id)!,
  quantity: ROOM_UNITS.filter((unit) => unit.type === room.id).length,
}));

export default component$(() => (
  <>
    <PageIntro
      eyebrow="Camere"
      title="Il tuo spazio, nella luce della Toscana."
      description="Tre atmosfere, una stessa idea di accoglienza. Colori naturali, tessuti leggeri e dettagli pensati per il piacere di fermarsi: scegli la camera in cui immaginare il tuo soggiorno."
    >
      <p class="editorial-note">
        Ambienti illustrativi con inventario e tariffe esclusivamente simulati.
        Puoi confrontare le disponibilità demo, senza prenotare.
      </p>
    </PageIntro>
    <section
      class="shell pb-12 md:pb-16"
      aria-labelledby="room-comparison-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">Scegli da dove cominciare</p>
          <h2 id="room-comparison-title">
            Tre atmosfere, <em>tre modi di fermarsi.</em>
          </h2>
        </div>
        <p>
          Un angolo per leggere, la possibilità di soggiornare fino in tre o
          piccoli rituali del risveglio. Ecco cosa distingue le nostre tre
          atmosfere.
        </p>
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        {roomCatalog.map((room) => (
          <article
            class="border-olive/25 min-w-0 border bg-white/40 p-6"
            key={room.id}
          >
            <h3 class="mb-6 text-3xl">
              <a
                href={"#" + room.id}
                class="decoration-olive/40 underline underline-offset-8"
              >
                {room.name}
              </a>
            </h3>
            <dl class="grid gap-5 text-sm leading-7">
              <div>
                <dt class="text-muted text-xs">Capienza per camera</dt>
                <dd class="font-bold">Fino a {room.capacity} ospiti</dd>
              </div>
              <div>
                <dt class="text-muted text-xs">Nel catalogo simulato</dt>
                <dd>
                  {room.quantity} {room.quantity === 1 ? "camera" : "camere"}
                </dd>
              </div>
              <div>
                <dt class="text-muted text-xs">Colori e materiali</dt>
                <dd>{room.details[0]}</dd>
              </div>
              <div>
                <dt class="text-muted text-xs">Il carattere dell’ambiente</dt>
                <dd>{room.details.slice(1).join(". ")}.</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p class="editorial-note mt-6">
        Le capienze descrivono il catalogo demo, non la disposizione dei letti.
        Le foto suggeriscono colori e atmosfere: non attestano metrature,
        dotazioni o accessibilità fisica. La disponibilità dipende dalle date
        scelte nel simulatore.
      </p>
    </section>
    <div class="shell rooms-editorial">
      {roomCatalog.map((room, index) => (
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
            <p class="room-allocation mt-4">
              Fino a {room.capacity} ospiti · {room.quantity}{" "}
              {room.quantity === 1 ? "camera simulata" : "camere simulate"} ·
              Base {formatMoney(room.baseCents)} per camera/notte
            </p>
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
