import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

// Run against `npm run preview` after `npm run build`, never a Vite SPA fallback.
const origin = process.env.SSR_TEST_ORIGIN ?? "http://127.0.0.1:8947";
const fetchLocal = (path) =>
  fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000) });
const routes = [
  ["/", "La tua parentesi"],
  ["/camere/", "Il tuo spazio, nella luce della Toscana."],
  ["/esperienze/", "La vacanza, come piace a te."],
  ["/territorio/", "Un viaggio dentro il paesaggio."],
  ["/galleria/", "Il tuo soggiorno, in immagini."],
  ["/disponibilita/", "Il tuo prossimo soggiorno comincia qui."],
  ["/contatti/", "Prima di immaginare la partenza."],
];
const titles = new Set();
const descriptions = new Set();
const localAssets = new Set();
const localLinks = new Set();
const pageHtml = new Map();
const anchors = [];

for (const [path, heading] of routes) {
  test(`production SSR: ${path} includes content and metadata in raw HTTP HTML`, async () => {
    const response = await fetchLocal(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    const raw = await response.text();
    const html = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    pageHtml.set(path, html);
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
    if (path !== "/disponibilita/")
      assert.doesNotMatch(
        html,
        /<(?:form|input|select)\b/,
        "search controls are limited to the availability simulator",
      );
    for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g))
      localLinks.add(href);
    for (const [, src] of html.matchAll(
      /(?:src|href)="(\/(?:build|assets|images)\/[^"?]+|\/favicon\.svg)"/g,
    ))
      localAssets.add(src);
    for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of srcset.split(","))
        localAssets.add(candidate.trim().split(/\s+/)[0]);
    }
    for (const [, href] of html.matchAll(
      /<a\b[^>]*href="((?:\/[^"?]*)?#[^"]+)"/g,
    ))
      anchors.push(new URL(href, new URL(path, origin)));
  });
}

test("all navigation targets resolve and local images, scripts and styles are served", async () => {
  assert.ok(localLinks.size >= routes.length);
  assert.ok(localAssets.size >= 4);
  for (const path of [...localLinks, ...localAssets]) {
    const response = await fetchLocal(path);
    assert.equal(response.status, 200, path);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(bytes.length > 0, path + " must have a nonempty body");
    if (path.endsWith(".webp")) {
      assert.match(response.headers.get("content-type"), /image\/webp/);
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
    if (path.endsWith(".jpg")) {
      assert.match(response.headers.get("content-type"), /image\/jpeg/);
      assert.equal(bytes.readUInt16BE(0), 0xffd8);
    }
  }
});

test("editorial links and gallery categories point to real server-rendered anchors", () => {
  assert.ok(anchors.length >= 10);
  for (const target of anchors) {
    const html = pageHtml.get(target.pathname);
    assert.ok(html, target.pathname);
    assert.ok(
      html.includes('id="' + decodeURIComponent(target.hash.slice(1)) + '"'),
      target.href,
    );
  }
});

test("room narratives, photo credits and FAQ content are complete without booking controls", () => {
  const rooms = pageHtml.get("/camere/");
  for (const name of ["Camera Ulivo", "Camera Acqua", "Camera Lino"])
    assert.ok(rooms.includes(name));
  const gallery = pageHtml.get("/galleria/");
  for (const author of [
    "Kalina O.",
    "Andreas Weilguny",
    "Andrea Mosti",
    "Alan Jiang",
    "Clay Banks",
    "Taylor Friehl",
    "Alessandro Guarino",
    "Andrea Kartali",
  ])
    assert.ok(gallery.includes(author), author);
  assert.match(gallery, /fotografie di una struttura esistente/);
  assert.match(pageHtml.get("/contatti/"), /<details\b/);
  assert.match(pageHtml.get("/disponibilita/"), /Simulatore attivo/);
  assert.match(pageHtml.get("/disponibilita/"), /name="checkIn"/);
});

test("availability form is server rendered with labels, native dates and GET fallback", () => {
  const html = pageHtml.get("/disponibilita/");
  assert.match(html, /<form\b[^>]*action="\/disponibilita\/"[^>]*method="get"/);
  for (const field of ["checkIn", "checkOut", "guests", "rooms"]) {
    assert.ok(html.includes('for="stay-' + field + '"'));
    assert.ok(html.includes('name="' + field + '"'));
  }
  assert.equal((html.match(/type="date"/g) ?? []).length, 2);
  assert.match(html, /role="status"/);
  assert.match(html, /nessuna prenotazione/i);
  for (const [field, value] of [
    ["guests", "2"],
    ["rooms", "1"],
  ]) {
    const select = html.match(
      new RegExp(
        '<select\\b[^>]*name="' + field + '"[^>]*>([\\s\\S]*?)<\\/select>',
      ),
    )?.[1];
    assert.ok(select, "Missing native select: " + field);
    assert.match(
      select,
      new RegExp(
        '<option\\b(?=[^>]*value="' +
          value +
          '")(?=[^>]*\\bselected(?:\\s|=|>))[^>]*>',
      ),
    );
  }
});

test("direct GET renders complete result, capacity and full-stay price without JavaScript", async () => {
  const response = await fetchLocal(
    "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1",
  );
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  assert.match(html, /3 soluzioni trovate/);
  assert.match(html, /405,00/);
  assert.match(html, /Camera Lino/);
  assert.match(html, /Capienza totale/);
  assert.match(html, /Totale indicativo/);
  assert.match(html, /Modifica la ricerca/);
});

test("SSR handles mixed-room occupancy, invalid dates and no availability distinctly", async () => {
  const mixed = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=5&rooms=2",
    )
  ).text();
  assert.match(mixed, /960,00/);
  assert.match(mixed, /5 ospiti in 2 camere/);
  assert.match(mixed, /Ospiti assegnati/);
  for (const [field, value] of [
    ["guests", "5"],
    ["rooms", "2"],
  ]) {
    const select = mixed.match(
      new RegExp(
        '<select\\b[^>]*name="' + field + '"[^>]*>([\\s\\S]*?)<\\/select>',
      ),
    )?.[1];
    assert.ok(select, "Missing query select: " + field);
    assert.match(
      select,
      new RegExp(
        '<option\\b(?=[^>]*value="' +
          value +
          '")(?=[^>]*\\bselected(?:\\s|=|>))[^>]*>',
      ),
    );
  }
  const invalid = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-09&guests=2&rooms=1",
    )
  ).text();
  assert.match(invalid, /Il check-out deve essere successivo/);
  assert.match(invalid, /aria-invalid="true"/);
  assert.match(invalid, /role="alert"/);
  assert.doesNotMatch(invalid, /class="stay-offer"/);
  const empty = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-11-05&checkOut=2027-11-08&guests=2&rooms=1",
    )
  ).text();
  assert.match(empty, /Nessuna soluzione disponibile/);
  assert.match(empty, /chiusura dimostrativa/);
  assert.doesNotMatch(empty, /class="stay-offer"/);
  const unavailable = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=5&rooms=5",
    )
  ).text();
  assert.match(unavailable, /Non ci sono camere libere per l’intero soggiorno/);
  assert.doesNotMatch(unavailable, /class="stay-offer"/);
});

test("search accessibility associations survive validation and server-rendered results", async () => {
  const errorHtml = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-02-30&checkOut=bad&guests=0&rooms=0",
    )
  ).text();
  for (const html of [pageHtml.get("/disponibilita/"), errorHtml]) {
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
    );
    for (const [, references] of html.matchAll(/aria-describedby="([^"]+)"/g))
      for (const id of references.split(/\s+/))
        assert.ok(ids.has(id), "Missing description: " + id);
    assert.match(html, /<fieldset>/);
    assert.match(html, /<legend\b/);
    assert.match(html, /aria-live="polite"/);
    for (const id of [
      "stay-checkIn",
      "stay-checkOut",
      "stay-guests",
      "stay-rooms",
    ])
      assert.match(html, new RegExp('<label for="' + id + '"'));
  }
  assert.equal((errorHtml.match(/aria-invalid="true"/g) ?? []).length, 4);
  const results = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1",
    )
  ).text();
  assert.match(
    results,
    /tabindex="-1"[^>]*aria-label="Esito della ricerca"|aria-label="Esito della ricerca"[^>]*tabindex="-1"/i,
  );
  assert.match(results, /<caption>/);
  assert.match(results, /scope="col"/);
  assert.match(results, /scope="row"/);
});

test("SSR accepts occupancy, duration and checkout boundaries", async () => {
  const maximum = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-01-04&checkOut=2027-01-05&guests=12&rooms=5",
    )
  ).text();
  assert.match(maximum, /12 ospiti in 5 camere, 1 notte/);
  assert.match(maximum, /765,00/);
  assert.match(maximum, /Capienza totale: fino a 12 persone/);
  assert.equal((maximum.match(/class="stay-offer"/g) ?? []).length, 1);
  const yearEnd = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-12-31&checkOut=2028-01-01&guests=1&rooms=1",
    )
  ).text();
  assert.match(yearEnd, /1 ospite in 1 camera, 1 notte/);
  assert.match(yearEnd, /1 gennaio 2028/);
  assert.doesNotMatch(yearEnd, /role="alert"/);
  const longest = await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-06-01&checkOut=2027-06-15&guests=1&rooms=1",
    )
  ).text();
  assert.match(longest, /1 ospite in 1 camera, 14 notti/);
  assert.match(longest, /(?:1\.810|1810),00/);
  assert.doesNotMatch(longest, /role="alert"/);
});

test("SSR rejects limits and duplicate parameters before producing offers", async () => {
  const cases = [
    [
      "checkIn=2027-06-10&checkOut=2027-06-13&guests=13&rooms=1",
      /da 1 a 12 ospiti/,
    ],
    [
      "checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=6",
      /da 1 a 5 camere/,
    ],
    [
      "checkIn=2027-06-10&checkOut=2027-06-13&guests=1&rooms=2",
      /almeno un ospite/,
    ],
    [
      "checkIn=2027-06-10&checkOut=2027-06-10&guests=2&rooms=1",
      /successivo al check-in/,
    ],
    [
      "checkIn=2027-06-01&checkOut=2027-06-16&guests=2&rooms=1",
      /da 1 a 14 notti/,
    ],
    [
      "checkIn=2027-12-31&checkOut=2028-01-02&guests=2&rooms=1",
      /entro il 1 gennaio 2028/,
    ],
    [
      "checkIn=2027-06-10&checkOut=2027-06-13&guests=2&guests=3&rooms=1",
      /un solo valore/,
    ],
  ];
  for (const [query, error] of cases) {
    const response = await fetchLocal("/disponibilita/?" + query);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /role="alert"/);
    assert.match(html, error);
    assert.doesNotMatch(html, /class="stay-offer"/);
  }
});

test("a fresh SSR search has blank dates and no previous results or errors", async () => {
  await (
    await fetchLocal(
      "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=5&rooms=2",
    )
  ).text();
  const html = await (await fetchLocal("/disponibilita/")).text();
  assert.match(html, /Scegli date, ospiti e camere per iniziare/);
  for (const field of ["checkIn", "checkOut"]) {
    assert.match(
      html,
      new RegExp(
        '<input\\b(?=[^>]*name="' + field + '")(?=[^>]*value="")[^>]*>',
      ),
    );
  }
  assert.doesNotMatch(html, /class="stay-offer"|role="alert"/);
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
