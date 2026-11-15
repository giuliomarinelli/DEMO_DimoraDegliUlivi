import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Brand } from "../brand/brand";
import { demoNotice, navigation } from "~/data/site";

export const SiteFooter = component$(() => (
  <footer class="site-footer">
    <div class="shell footer-top">
      <div>
        <Brand />
        <p class="mt-5 max-w-xs text-sm leading-7">
          Una casa tra gli ulivi.
          <br />
          Uno spazio per ritrovare il proprio tempo.
        </p>
      </div>
      <nav aria-label="Esplora la dimora" class="footer-nav">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/disponibilita/">Disponibilità · in preparazione</Link>
      </nav>
      <div class="max-w-sm">
        <p class="eyebrow">Una nota di trasparenza</p>
        <p class="mt-4 text-sm leading-7">{demoNotice}</p>
      </div>
    </div>
    <div class="shell footer-bottom">
      <span>© 2026 Dimora degli Ulivi · Progetto demo</span>
      <span>
        Immagini illustrative: Kalina O. e Andreas Weilguny / Unsplash
      </span>
    </div>
  </footer>
));
