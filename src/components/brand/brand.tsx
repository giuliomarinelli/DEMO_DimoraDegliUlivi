import { component$ } from "@builder.io/qwik";

export const OliveBranch = component$(
  ({ class: className = "" }: { class?: string }) => (
    <svg class={className} viewBox="0 0 80 100" fill="none" aria-hidden="true">
      <path
        d="M19 91C44 65 49 42 62 9M33 73L24 46M44 53L68 38M51 34L41 15"
        stroke="currentColor"
        stroke-width="1.6"
      />
      <g fill="currentColor">
        <ellipse cx="25" cy="51" rx="5" ry="14" transform="rotate(-28 25 51)" />
        <ellipse cx="37" cy="66" rx="5" ry="14" transform="rotate(50 37 66)" />
        <ellipse cx="61" cy="43" rx="5" ry="14" transform="rotate(57 61 43)" />
        <ellipse cx="44" cy="24" rx="4" ry="12" transform="rotate(-24 44 24)" />
        <ellipse cx="61" cy="16" rx="4" ry="12" transform="rotate(21 61 16)" />
        <ellipse cx="49" cy="52" rx="3" ry="5" transform="rotate(25 49 52)" />
      </g>
    </svg>
  ),
);

export const Brand = component$(() => (
  <a href="/" class="brand" aria-label="Dimora degli Ulivi — homepage">
    <OliveBranch class="h-14 w-11 shrink-0" />
    <span>
      Dimora <span class="block">degli Ulivi</span>
      <small>AGRITURISMO · TOSCANA</small>
    </span>
  </a>
));
