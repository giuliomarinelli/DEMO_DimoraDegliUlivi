import { component$, Slot } from "@builder.io/qwik";
import { SiteHeader } from "~/components/site-header/site-header";
import { SiteFooter } from "~/components/site-footer/site-footer";

export default component$(() => (
  <>
    <SiteHeader />
    <main id="contenuto" tabIndex={-1}>
      <Slot />
    </main>
    <SiteFooter />
  </>
));
