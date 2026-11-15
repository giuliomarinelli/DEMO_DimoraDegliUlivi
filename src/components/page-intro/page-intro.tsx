import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const PageIntro = component$<{
  eyebrow: string;
  title: string;
  description: string;
}>(({ eyebrow, title, description }) => (
  <section class="shell page-intro">
    <nav class="breadcrumb" aria-label="Percorso">
      <Link href="/">La dimora</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{eyebrow}</span>
    </nav>
    <div class="page-intro-grid">
      <div>
        <p class="eyebrow">{eyebrow}</p>
        <h1 class="page-title">{title}</h1>
      </div>
      <div class="intro-description">
        <p>{description}</p>
        <Slot />
      </div>
    </div>
  </section>
));
