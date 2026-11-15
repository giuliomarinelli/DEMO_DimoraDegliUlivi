import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { rooms as editorialRooms } from "~/data/editorial";
import { Photo } from "~/components/photo/photo";
import {
  DEMO_START,
  DEMO_LAST_CHECK_IN,
  DEMO_END,
  MAX_GUESTS,
  MAX_ROOMS,
  EXAMPLE_SEARCH,
  EMPTY_EXAMPLE_SEARCH,
  SEARCH_FIELDS,
  formatDate,
  formatMoney,
  searchAvailability,
  type InitialSearch,
  type SearchField,
  type SearchResult,
} from "~/lib/availability";

const labels: Record<SearchField, string> = {
  checkIn: "Check-in",
  checkOut: "Check-out",
  guests: "Ospiti",
  rooms: "Camere",
};

export const AvailabilitySearch = component$<{ initial: InitialSearch }>(
  (props) => {
    const draft = useStore({ ...props.initial.draft });
    const result = useSignal<SearchResult | null>(props.initial.result);
    const edited = useSignal(false);
    const feedback = useSignal<HTMLElement>();
    const formRef = useSignal<HTMLFormElement>();
    // Also synchronize when a Qwik City example link changes this route's query.
    useTask$(({ track }) => {
      const initial = track(() => props.initial);
      Object.assign(draft, initial.draft);
      result.value = initial.result;
      edited.value = false;
    });
    const update = $((field: SearchField, value: string) => {
      draft[field] = value;
      result.value = null;
      edited.value = true;
    });
    const submit = $((_: SubmitEvent, form: HTMLFormElement) => {
      const fields = new FormData(form);
      const submitted = Object.fromEntries(
        SEARCH_FIELDS.map((field) => [field, String(fields.get(field) ?? "")]),
      ) as typeof draft;
      Object.assign(draft, submitted);
      const next = searchAvailability(submitted);
      result.value = next;
      edited.value = false;
      if (next.status === "invalid") {
        const field = SEARCH_FIELDS.find((field) => next.errors[field]);
        if (field)
          (form.elements.namedItem(field) as HTMLElement | null)?.focus();
      } else {
        feedback.value?.focus();
      }
    });
    const errors =
      result.value?.status === "invalid" ? result.value.errors : {};
    const message =
      result.value?.status === "invalid"
        ? "Controlla i campi indicati prima di cercare."
        : result.value?.status === "empty"
          ? "Nessuna soluzione disponibile per questa ricerca dimostrativa."
          : result.value?.status === "success"
            ? `${result.value.offers.length} ${result.value.offers.length === 1 ? "soluzione trovata" : "soluzioni trovate"} per ${result.value.criteria.guests} ${result.value.criteria.guests === 1 ? "ospite" : "ospiti"} in ${result.value.criteria.rooms} ${result.value.criteria.rooms === 1 ? "camera" : "camere"}, ${result.value.nights} ${result.value.nights === 1 ? "notte" : "notti"}.`
            : edited.value
              ? "Parametri modificati. Avvia una nuova ricerca per vedere le soluzioni aggiornate."
              : "Scegli date, ospiti e camere per iniziare la simulazione.";

    return (
      <div class="shell stay-search">
        <section class="search-panel" aria-labelledby="search-title">
          <div class="search-heading">
            <div>
              <p class="eyebrow">Ricerca dimostrativa · Calendario 2027</p>
              <h2 id="search-title">
                Trova la tua <em>parentesi.</em>
              </h2>
            </div>
            <p>
              Da 1 a 14 notti · Fino a 12 ospiti e 5 camere.
              <br />
              Solo dati fittizi, nessuna prenotazione.
            </p>
          </div>
          <form
            ref={formRef}
            action="/disponibilita/"
            method="get"
            noValidate
            preventdefault:submit
            onSubmit$={submit}
          >
            <fieldset>
              <legend class="sr-only">
                Date e composizione del soggiorno simulato
              </legend>
              <div class="search-fields">
                <div class="search-field">
                  <label for="stay-checkIn">Check-in</label>
                  <input
                    id="stay-checkIn"
                    name="checkIn"
                    type="date"
                    value={draft.checkIn}
                    min={DEMO_START}
                    max={DEMO_LAST_CHECK_IN}
                    required
                    aria-invalid={errors.checkIn ? "true" : "false"}
                    aria-describedby={
                      "search-calendar-help" +
                      (errors.checkIn ? " stay-checkIn-error" : "")
                    }
                    onInput$={(_, input) => update("checkIn", input.value)}
                  />
                  {errors.checkIn && (
                    <p id="stay-checkIn-error" class="field-error">
                      {errors.checkIn}
                    </p>
                  )}
                </div>
                <div class="search-field">
                  <label for="stay-checkOut">Check-out</label>
                  <input
                    id="stay-checkOut"
                    name="checkOut"
                    type="date"
                    value={draft.checkOut}
                    min={draft.checkIn || DEMO_START}
                    max={DEMO_END}
                    required
                    aria-invalid={errors.checkOut ? "true" : "false"}
                    aria-describedby={
                      "search-calendar-help" +
                      (errors.checkOut ? " stay-checkOut-error" : "")
                    }
                    onInput$={(_, input) => update("checkOut", input.value)}
                  />
                  {errors.checkOut && (
                    <p id="stay-checkOut-error" class="field-error">
                      {errors.checkOut}
                    </p>
                  )}
                </div>
                <div class="search-field">
                  <label for="stay-guests">Ospiti</label>
                  <select
                    id="stay-guests"
                    name="guests"
                    value={draft.guests}
                    required
                    aria-invalid={errors.guests ? "true" : "false"}
                    aria-describedby={
                      "search-occupancy-help" +
                      (errors.guests ? " stay-guests-error" : "")
                    }
                    onChange$={(_, select) => update("guests", select.value)}
                  >
                    {Array.from({ length: MAX_GUESTS }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {`${i + 1} ${i === 0 ? "ospite" : "ospiti"}`}
                      </option>
                    ))}
                  </select>
                  {errors.guests && (
                    <p id="stay-guests-error" class="field-error">
                      {errors.guests}
                    </p>
                  )}
                </div>
                <div class="search-field">
                  <label for="stay-rooms">Camere</label>
                  <select
                    id="stay-rooms"
                    name="rooms"
                    value={draft.rooms}
                    required
                    aria-invalid={errors.rooms ? "true" : "false"}
                    aria-describedby={
                      "search-occupancy-help" +
                      (errors.rooms ? " stay-rooms-error" : "")
                    }
                    onChange$={(_, select) => update("rooms", select.value)}
                  >
                    {Array.from({ length: MAX_ROOMS }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {`${i + 1} ${i === 0 ? "camera" : "camere"}`}
                      </option>
                    ))}
                  </select>
                  {errors.rooms && (
                    <p id="stay-rooms-error" class="field-error">
                      {errors.rooms}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>
            <div class="search-help">
              <p id="search-calendar-help">
                Check-in nel 2027; ultima partenza 1 gennaio 2028. Il check-out
                deve essere successivo al check-in.
              </p>
              <p id="search-occupancy-help">
                Ospiti totali, bambini inclusi. Almeno un ospite per camera;
                capienza massima variabile da 2 a 3 persone.
              </p>
            </div>
            <div class="search-actions">
              <button class="button" type="submit">
                Cerca disponibilità demo <span aria-hidden="true">↗</span>
              </button>
              <Link href={EXAMPLE_SEARCH} class="text-link">
                Prova un esempio <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </form>
          <p class="editorial-note mt-5">
            Disponibilità e prezzi indicativi sono simulati. La ricerca non
            blocca camere e non invia richieste.
          </p>
        </section>
        <section
          ref={feedback}
          id="search-feedback"
          class="search-feedback"
          tabIndex={-1}
          aria-label="Esito della ricerca"
        >
          <p
            class="search-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {message}
          </p>
          {result.value?.status === "invalid" && (
            <div class="search-error-summary" role="alert">
              <h3>Rivedi la tua ricerca</h3>
              <ul>
                {SEARCH_FIELDS.filter((field) => errors[field]).map((field) => (
                  <li key={field}>
                    <a href={"#stay-" + field}>
                      {labels[field]}: {errors[field]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.value && result.value.status !== "invalid" && (
            <div class="search-summary">
              <p>
                Dal <strong>{formatDate(result.value.criteria.checkIn)}</strong>{" "}
                al <strong>{formatDate(result.value.criteria.checkOut)}</strong>
              </p>
              <p>
                {result.value.criteria.guests}{" "}
                {result.value.criteria.guests === 1 ? "ospite" : "ospiti"} ·{" "}
                {result.value.criteria.rooms}{" "}
                {result.value.criteria.rooms === 1 ? "camera" : "camere"} ·{" "}
                {result.value.nights}{" "}
                {result.value.nights === 1 ? "notte" : "notti"}
              </p>
              <button
                type="button"
                class="text-link"
                onClick$={() =>
                  formRef.value
                    ?.querySelector<HTMLInputElement>("input")
                    ?.focus()
                }
              >
                Modifica la ricerca <span aria-hidden="true">↑</span>
              </button>
            </div>
          )}
          {result.value?.status === "empty" && (
            <div class="empty-stay">
              <p class="eyebrow">Un’altra data, una nuova possibilità</p>
              <h2>
                Nessuna soluzione,
                <br />
                <em>per queste date.</em>
              </h2>
              <p>
                {result.value.reason === "closed"
                  ? "Il periodo comprende la chiusura dimostrativa dal 1 al 14 novembre 2027."
                  : "Non ci sono camere libere per l’intero soggiorno, o una combinazione che accolga tutti gli ospiti nel numero di camere richiesto."}
              </p>
              <p>
                Prova altre date, riduci gli ospiti o modifica il numero di
                camere. Non è una disponibilità alberghiera reale.
              </p>
              <Link href={EXAMPLE_SEARCH} class="button">
                Esplora un soggiorno d’esempio{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
          {result.value?.status === "success" && (
            <div class="stay-offers">
              {result.value.offers.map((offer, index) => (
                <article
                  class="stay-offer"
                  key={offer.id}
                  aria-labelledby={"offer-" + offer.id}
                >
                  <div class="offer-heading">
                    <div>
                      <p class="eyebrow">
                        {index === 0
                          ? "La proposta più conveniente della ricerca"
                          : "Un’altra combinazione per il tuo soggiorno"}
                      </p>
                      <h2 id={"offer-" + offer.id}>Soluzione {index + 1}</h2>
                      <p>Capienza totale: fino a {offer.capacity} persone</p>
                    </div>
                    <div class="offer-price">
                      <strong>{formatMoney(offer.totalCents)}</strong>
                      <span>
                        Totale indicativo · tutte le camere · intero soggiorno
                      </span>
                    </div>
                  </div>
                  <div class="offer-rooms">
                    {offer.lines.map((line) => {
                      const room = editorialRooms.find(
                        (room) => room.id === line.type,
                      )!;
                      return (
                        <div class="offer-room" key={line.type}>
                          <Photo image={room.image} />
                          <div>
                            <p class="eyebrow">
                              {line.quantity}{" "}
                              {line.quantity === 1 ? "camera" : "camere"} · Fino
                              a {line.capacityPerRoom} persone per camera
                            </p>
                            <h3>{room.name}</h3>
                            <p>{room.description}</p>
                            <p class="room-allocation">
                              Ospiti assegnati: {line.guests.join(" + ")} ·
                              Totale tipologia: {formatMoney(line.totalCents)}
                            </p>
                            <details>
                              <summary>Dettagli di {room.name}</summary>
                              <ul>
                                {room.details.map((detail) => (
                                  <li key={detail}>{detail}</li>
                                ))}
                              </ul>
                              <Link
                                href={"/camere/#" + room.id}
                                class="text-link"
                              >
                                Conosci l’atmosfera{" "}
                                <span aria-hidden="true">↗</span>
                              </Link>
                            </details>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <details class="price-breakdown">
                    <summary>
                      Come è calcolato l’importo della soluzione {index + 1}
                    </summary>
                    <p>
                      Tariffa per camera: base giornaliera, +30% in luglio e
                      agosto, +15 € nelle notti di venerdì e sabato. Nessun
                      supplemento per ospite; extra e imposte non simulati.
                    </p>
                    <div class="table-scroll">
                      <table>
                        <caption>
                          Importi indicativi per notte, tutte le camere della
                          soluzione {index + 1}
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">Notte del</th>
                            <th scope="col">Importo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offer.nightlyTotals.map((night) => (
                            <tr key={night.date}>
                              <th scope="row">{formatDate(night.date)}</th>
                              <td>{formatMoney(night.totalCents)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th scope="row">Totale soggiorno</th>
                            <td>{formatMoney(offer.totalCents)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </details>
                  <p class="editorial-note">
                    Soluzione dimostrativa, non prenotabile. Nessun addebito o
                    blocco camera.
                  </p>
                </article>
              ))}
            </div>
          )}
          {!result.value && (
            <div class="search-idle">
              <p>
                La tua ricerca partirà da camere Ulivo, Acqua e Lino, con
                disponibilità simulata per ogni notte del soggiorno.
              </p>
              <Link href={EMPTY_EXAMPLE_SEARCH} class="text-link">
                Esplora anche un caso senza disponibilità{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  },
);
