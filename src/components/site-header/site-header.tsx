import { component$, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { navigation } from "~/data/site";
import { Brand } from "../brand/brand";

export const SiteHeader = component$(() => {
  const location = useLocation();
  const menu = useSignal<HTMLDetailsElement>();
  return (
    <>
      <a href="#contenuto" class="skip-link">
        Vai al contenuto
      </a>
      <div class="demo-bar">
        Un luogo immaginato, un invito a rallentare.{" "}
        <span>Stai esplorando un sito demo.</span>
      </div>
      <header class="site-header shell">
        <Brand />
        <nav aria-label="Navigazione principale" class="desktop-nav">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                location.url.pathname === item.href ? "page" : "false"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/disponibilita/" class="button header-cta">
          Il tuo soggiorno <span aria-hidden="true">↗</span>
        </Link>
        <details
          class="mobile-menu"
          ref={menu}
          onKeyDown$={(event) => {
            if (event.key === "Escape" && menu.value) {
              menu.value.open = false;
              menu.value.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>
            Menu <span aria-hidden="true">☰</span>
          </summary>
          <nav aria-label="Navigazione mobile">
            {[
              ...navigation,
              { href: "/disponibilita/", label: "Il tuo soggiorno" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  location.url.pathname === item.href ? "page" : "false"
                }
                onClick$={() => {
                  if (menu.value) menu.value.open = false;
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </header>
    </>
  );
});
