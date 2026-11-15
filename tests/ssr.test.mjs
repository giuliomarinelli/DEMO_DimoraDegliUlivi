import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

// Run against `npm run preview` after `npm run build`, never a Vite SPA fallback.
const origin = process.env.SSR_TEST_ORIGIN ?? "http://127.0.0.1:8947";
const fetchLocal = (path) =>
  fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000) });
const routes = [
  ["/", "Il tempo, qui,"],
  ["/camere/", "Il riposo, nella sua forma più semplice."],
  ["/esperienze/", "Il lusso di avere tempo."],
  ["/territorio/", "La strada più bella è quella senza fretta."],
  ["/galleria/", "Due sguardi, un inizio."],
  ["/disponibilita/", "Il prossimo soggiorno comincia da un’idea."],
  ["/contatti/", "Una casa immaginata. Un racconto aperto."],
];
const titles = new Set();
const descriptions = new Set();
const localAssets = new Set();
const localLinks = new Set();

for (const [path, heading] of routes) {
  test(`production SSR: ${path} includes content and metadata in raw HTTP HTML`, async () => {
    const response = await fetchLocal(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    const raw = await response.text();
    const html = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.match(html, /<html[^>]*lang="it"/);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].includes(heading));
    assert.match(html, /<main[^>]*id="contenuto"/);
    assert.ok(
      html.includes("azienda, informazioni e operazioni sono simulate"),
    );
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
    const title = html.match(/<title\b[^>]*>([^<]+)<\/title>/)?.[1];
    const description = html.match(
      /<meta name="description" content="([^"]+)"/,
    )?.[1];
    assert.ok(title && description, "SEO metadata must be server rendered");
    assert.ok(!titles.has(title), "route title must be unique");
    assert.ok(
      !descriptions.has(description),
      "route description must be unique",
    );
    titles.add(title);
    descriptions.add(description);
    assert.match(raw, /q:render="ssr"/);
    assert.doesNotMatch(
      html,
      /<form\b/,
      "no search or contact submission in milestone 1",
    );
    for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g))
      localLinks.add(href);
    for (const [, src] of html.matchAll(
      /(?:src|href)="(\/(?:build|assets|images)\/[^"?]+|\/favicon\.svg)"/g,
    ))
      localAssets.add(src);
  });
}

test("all navigation targets resolve and local images, scripts and styles are served", async () => {
  assert.ok(localLinks.size >= routes.length);
  assert.ok(localAssets.size >= 4);
  for (const path of [...localLinks, ...localAssets]) {
    const response = await fetchLocal(path);
    assert.equal(response.status, 200, path);
    if (path.endsWith(".webp")) {
      assert.match(response.headers.get("content-type"), /image\/webp/);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
  }
});

test("unknown paths return a real 404 with a way home", async () => {
  const response = await fetchLocal("/un-sentiero-inesistente/");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /Torna alla dimora/);
  assert.match(html, /Pagina non trovata/);
});

test("Cloudflare output is a server worker with a client manifest, without prerendered route HTML", async () => {
  const worker = await readFile(
    new URL("../dist/_worker.js", import.meta.url),
    "utf8",
  );
  assert.ok(worker.includes("fetch"));
  const manifest = JSON.parse(
    await readFile(new URL("../dist/q-manifest.json", import.meta.url), "utf8"),
  );
  assert.ok(Object.keys(manifest.bundles).length > 0);
  for (const [path] of routes) {
    await assert.rejects(
      readFile(new URL(`../dist${path}index.html`, import.meta.url)),
      { code: "ENOENT" },
    );
  }
  await assert.rejects(readFile(new URL("../dist/404.html", import.meta.url)), {
    code: "ENOENT",
  });
});
