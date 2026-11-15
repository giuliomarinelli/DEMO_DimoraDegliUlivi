import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { OliveBranch } from "../brand/brand";

export const StayInvitation = component$(() => (
  <section class="stay-invitation" aria-labelledby="stay-invitation-title">
    <div class="shell stay-invitation-inner">
      <OliveBranch class="stay-branch" />
      <div>
        <p class="eyebrow">La tua prossima parentesi toscana</p>
        <h2 id="stay-invitation-title">
          C’è un posto per la tua voglia di partire.
        </h2>
      </div>
      <div class="invitation-action">
        <Link href="/disponibilita/" class="button">
          Scopri la disponibilità <span aria-hidden="true">↗</span>
        </Link>
        <p>
          Ricerca demo in preparazione.
          <br />
          Nessuna prenotazione reale.
        </p>
      </div>
    </div>
  </section>
));
