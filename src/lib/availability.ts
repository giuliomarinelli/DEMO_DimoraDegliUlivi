// Entirely fictitious inventory and rules. Pure, shared by SSR and the browser.
// No clock, randomness, network, reservation state or persistence.
export const DEMO_START = "2027-01-01";
export const DEMO_LAST_CHECK_IN = "2027-12-31";
export const DEMO_END = "2028-01-01";
export const MAX_NIGHTS = 14;
export const MAX_ROOMS = 5;
export const MAX_GUESTS = 12;
const DAY_MS = 86_400_000;

export const ROOM_TYPES = [
  { id: "ulivo", capacity: 2, baseCents: 14500 },
  { id: "acqua", capacity: 3, baseCents: 17500 },
  { id: "lino", capacity: 2, baseCents: 12500 },
] as const;
export type RoomId = (typeof ROOM_TYPES)[number]["id"];
export const ROOM_UNITS: readonly {
  id: string;
  type: RoomId;
  offset: number;
}[] = [
  { id: "ulivo-1", type: "ulivo", offset: 0 },
  { id: "ulivo-2", type: "ulivo", offset: 5 },
  { id: "acqua-1", type: "acqua", offset: 10 },
  { id: "acqua-2", type: "acqua", offset: 15 },
  { id: "lino-1", type: "lino", offset: 20 },
];
export const SEARCH_FIELDS = [
  "checkIn",
  "checkOut",
  "guests",
  "rooms",
] as const;
export type SearchField = (typeof SEARCH_FIELDS)[number];
export type SearchDraft = Record<SearchField, string>;
export type SearchErrors = Partial<Record<SearchField, string>>;
export interface SearchCriteria {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}
export interface StayLine {
  type: RoomId;
  quantity: number;
  capacityPerRoom: number;
  guests: number[];
  unitIds: string[];
  totalCents: number;
}
export interface StayOffer {
  id: string;
  lines: StayLine[];
  capacity: number;
  totalCents: number;
  nightlyTotals: { date: string; totalCents: number }[];
}
export type SearchResult =
  | { status: "invalid"; errors: SearchErrors }
  | {
      status: "empty";
      criteria: SearchCriteria;
      nights: number;
      reason: "closed" | "unavailable";
    }
  | {
      status: "success";
      criteria: SearchCriteria;
      nights: number;
      offers: StayOffer[];
    };
export interface InitialSearch {
  draft: SearchDraft;
  result: SearchResult | null;
}

export function dateDay(value: string): number | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const date = new Date(value + "T00:00:00.000Z");
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date.getTime() / DAY_MS
    : null;
}

export function calculateNights(
  checkIn: string,
  checkOut: string,
): number | null {
  const start = dateDay(checkIn);
  const end = dateDay(checkOut);
  return start !== null && end !== null && end > start ? end - start : null;
}

export function validateSearch(
  draft: SearchDraft,
): { criteria: SearchCriteria; nights: number } | { errors: SearchErrors } {
  const errors: SearchErrors = {};
  const start = dateDay(draft.checkIn);
  const end = dateDay(draft.checkOut);
  if (start === null) errors.checkIn = "Scegli una data di check-in valida.";
  else if (draft.checkIn < DEMO_START || draft.checkIn > DEMO_LAST_CHECK_IN)
    errors.checkIn = "Il check-in deve essere nel calendario demo 2027.";
  if (end === null) errors.checkOut = "Scegli una data di check-out valida.";
  else if (draft.checkOut < DEMO_START || draft.checkOut > DEMO_END)
    errors.checkOut = "Il check-out deve essere entro il 1 gennaio 2028.";
  const nights = calculateNights(draft.checkIn, draft.checkOut);
  if (start !== null && end !== null && end <= start)
    errors.checkOut = "Il check-out deve essere successivo al check-in.";
  else if (nights !== null && nights > MAX_NIGHTS)
    errors.checkOut = "La simulazione ammette soggiorni da 1 a 14 notti.";
  const guests = /^[1-9]\d*$/.test(draft.guests) ? Number(draft.guests) : NaN;
  const rooms = /^[1-9]\d*$/.test(draft.rooms) ? Number(draft.rooms) : NaN;
  if (!Number.isInteger(guests) || guests > MAX_GUESTS)
    errors.guests = "Scegli un numero intero da 1 a 12 ospiti.";
  if (!Number.isInteger(rooms) || rooms > MAX_ROOMS)
    errors.rooms = "Scegli un numero intero da 1 a 5 camere.";
  if (!errors.guests && !errors.rooms) {
    if (guests < rooms)
      errors.guests = "Prevedi almeno un ospite per ogni camera richiesta.";
    else if (guests > rooms * 3)
      errors.guests =
        "Ogni camera ospita al massimo 3 persone: aumenta le camere o riduci gli ospiti.";
  }
  if (Object.keys(errors).length > 0 || nights === null) return { errors };
  return {
    criteria: {
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      guests,
      rooms,
    },
    nights,
  };
}

const isoDay = (day: number) =>
  new Date(day * DAY_MS).toISOString().slice(0, 10);
const closed = (date: string) => date >= "2027-11-01" && date < "2027-11-15";

export function nightlyRateCents(type: RoomId, date: string): number {
  const room = ROOM_TYPES.find((room) => room.id === type);
  const day = dateDay(date);
  if (!room || day === null)
    throw new RangeError("Invalid room type or civil date");
  const month = Number(date.slice(5, 7));
  const seasonal =
    month === 7 || month === 8 ? (room.baseCents * 130) / 100 : room.baseCents;
  const weekday = new Date(day * DAY_MS).getUTCDay();
  return seasonal + (weekday === 5 || weekday === 6 ? 1500 : 0);
}

export function isUnitAvailable(
  unitId: string,
  checkIn: string,
  checkOut: string,
): boolean {
  const unit = ROOM_UNITS.find((unit) => unit.id === unitId);
  const start = dateDay(checkIn);
  const nights = calculateNights(checkIn, checkOut);
  if (
    !unit ||
    start === null ||
    nights === null ||
    nights > MAX_NIGHTS ||
    checkIn < DEMO_START ||
    checkIn > DEMO_LAST_CHECK_IN ||
    checkOut > DEMO_END
  )
    return false;
  const epoch = dateDay(DEMO_START)!;
  for (let day = start; day < start + nights; day++) {
    const cycle = (((day - epoch + unit.offset) % 28) + 28) % 28;
    if (closed(isoDay(day)) || cycle < 3) return false;
  }
  return true;
}

export function searchAvailability(draft: SearchDraft): SearchResult {
  const validated = validateSearch(draft);
  if ("errors" in validated)
    return { status: "invalid", errors: validated.errors };
  const { criteria, nights } = validated;
  const start = dateDay(criteria.checkIn)!;
  const dates = Array.from({ length: nights }, (_, index) =>
    isoDay(start + index),
  );
  if (dates.some(closed))
    return { status: "empty", criteria, nights, reason: "closed" };
  // A unit must remain free for EVERY night: nightly counts alone are insufficient.
  const available = ROOM_UNITS.filter((unit) =>
    isUnitAvailable(unit.id, criteria.checkIn, criteria.checkOut),
  );
  const offers: StayOffer[] = [];
  const build = (
    index: number,
    remaining: number,
    selected: { type: RoomId; unitIds: string[] }[],
  ) => {
    if (index < ROOM_TYPES.length) {
      const type = ROOM_TYPES[index].id;
      const units = available.filter((unit) => unit.type === type);
      for (
        let quantity = 0;
        quantity <= Math.min(remaining, units.length);
        quantity++
      ) {
        build(index + 1, remaining - quantity, [
          ...selected,
          { type, unitIds: units.slice(0, quantity).map((unit) => unit.id) },
        ]);
      }
      return;
    }
    if (remaining !== 0) return;
    const lines: StayLine[] = selected
      .filter((line) => line.unitIds.length > 0)
      .map((line) => {
        const room = ROOM_TYPES.find((room) => room.id === line.type)!;
        return {
          type: line.type,
          quantity: line.unitIds.length,
          capacityPerRoom: room.capacity,
          guests: line.unitIds.map(() => 1),
          unitIds: line.unitIds,
          totalCents:
            dates.reduce(
              (sum, date) => sum + nightlyRateCents(line.type, date),
              0,
            ) * line.unitIds.length,
        };
      });
    const capacity = lines.reduce(
      (sum, line) => sum + line.quantity * line.capacityPerRoom,
      0,
    );
    if (capacity < criteria.guests) return;
    let remainingGuests = criteria.guests - criteria.rooms;
    for (const line of lines) {
      for (let i = 0; i < line.guests.length; i++) {
        const extra = Math.min(remainingGuests, line.capacityPerRoom - 1);
        line.guests[i] += extra;
        remainingGuests -= extra;
      }
    }
    const nightlyTotals = dates.map((date) => ({
      date,
      totalCents: lines.reduce(
        (sum, line) => sum + nightlyRateCents(line.type, date) * line.quantity,
        0,
      ),
    }));
    offers.push({
      id: selected
        .map((line) => line.type + "-" + line.unitIds.length)
        .join("_"),
      lines,
      capacity,
      totalCents: nightlyTotals.reduce(
        (sum, night) => sum + night.totalCents,
        0,
      ),
      nightlyTotals,
    });
  };
  build(0, criteria.rooms, []);
  offers.sort(
    (a, b) =>
      a.totalCents - b.totalCents ||
      a.capacity - b.capacity ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  return offers.length
    ? { status: "success", criteria, nights, offers }
    : { status: "empty", criteria, nights, reason: "unavailable" };
}

export function initialSearch(params: URLSearchParams): InitialSearch {
  if (!SEARCH_FIELDS.some((field) => params.has(field)))
    return {
      draft: { checkIn: "", checkOut: "", guests: "2", rooms: "1" },
      result: null,
    };
  const draft = Object.fromEntries(
    SEARCH_FIELDS.map((field) => [field, params.get(field) ?? ""]),
  ) as SearchDraft;
  const errors: SearchErrors = {};
  for (const field of SEARCH_FIELDS)
    if (params.getAll(field).length > 1)
      errors[field] = "Ogni parametro della ricerca deve avere un solo valore.";
  return {
    draft,
    result: Object.keys(errors).length
      ? { status: "invalid", errors }
      : searchAvailability(draft),
  };
}

export const EXAMPLE_SEARCH =
  "/disponibilita/?checkIn=2027-06-10&checkOut=2027-06-13&guests=2&rooms=1";
export const EMPTY_EXAMPLE_SEARCH =
  "/disponibilita/?checkIn=2027-11-05&checkOut=2027-11-08&guests=2&rooms=1";

export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value + "T00:00:00.000Z"));
