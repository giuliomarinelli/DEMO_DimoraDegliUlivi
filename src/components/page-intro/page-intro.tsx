import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
}

export const PageIntro = component$<PageIntroProps>(
  ({ eyebrow, title, description, note }) => (
    <section class="shell inner-page">
      <div class="breadcrumb">
        <Link href="/">La dimora</Link>
        <span aria-hidden="true">/</span>
        <span>{eyebrow}</span>
      </div>
      <div class="intro-grid">
        <div>
          <p class="eyebrow">{eyebrow}</p>
          <h1 class="page-title">{title}</h1>
          <p class="page-description">{description}</p>
          <Slot />
        </div>
        <aside class="intro-aside">
          <span class="eyebrow">Il taccuino della dimora</span>
          <div class="rule" />
          <p>{note}</p>
          <p class="mt-8 text-sm leading-6">
            Questa è una prima presentazione. Luogo, ospitalità e attività
            descritti sono immaginari.
          </p>
          <Link href="/" class="text-link mt-8">
            Torna alla dimora <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </section>
  ),
);
