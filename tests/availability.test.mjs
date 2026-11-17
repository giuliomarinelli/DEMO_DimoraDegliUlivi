import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ROOM_TYPES,
  ROOM_UNITS,
  dateDay,
  calculateNights,
  validateSearch,
  nightlyRateCents,
  isUnitAvailable,
  searchAvailability,
  initialSearch,
} from "../.cache/availability-tests/availability.js";

const draft = (changes = {}) => ({
  checkIn: "2027-06-10",
  checkOut: "2027-06-13",
  guests: "2",
  rooms: "1",
  ...changes,
});

test("inventory has Ulivo, Acqua and Lino, five unique physical units and 12 total places", () => {
  assert.deepEqual(
    ROOM_TYPES.map((room) => [room.id, room.capacity, room.baseCents]),
    [
      ["ulivo", 2, 14500],
      ["acqua", 3, 17500],
      ["lino", 2, 12500],
    ],
  );
  assert.equal(ROOM_UNITS.length, 5);
  assert.equal(new Set(ROOM_UNITS.map((unit) => unit.id)).size, 5);
  assert.equal(
    ROOM_UNITS.reduce(
      (sum, unit) =>
        sum + ROOM_TYPES.find((room) => room.id === unit.type).capacity,
      0,
    ),
    12,
  );
});

test("strict civil dates reject rollover, malformed strings and times", () => {
  for (const date of [
    "",
    "2027-02-29",
    "2027-02-30",
    "2027-04-31",
    "2027-13-01",
    "2027-00-10",
    "2027-06-00",
    "2027-6-10",
    "10/06/2027",
    "2027-06-10T00:00:00Z",
    " 2027-06-10",
  ])
    assert.equal(dateDay(date), null, date);
  assert.notEqual(dateDay("2028-02-29"), null);
});

test("nights are civil UTC differences, including DST, leap days and year boundaries", () => {
  for (const [start, end, nights] of [
    ["2027-03-27", "2027-03-29", 2],
    ["2027-10-30", "2027-11-01", 2],
    ["2028-02-28", "2028-03-01", 2],
    ["2027-12-31", "2028-01-01", 1],
    ["2027-06-10", "2027-06-13", 3],
  ])
    assert.equal(calculateNights(start, end), nights);
  for (const [start, end] of [
    ["2027-06-10", "2027-06-10"],
    ["2027-06-11", "2027-06-10"],
    ["bad", "2027-06-10"],
  ])
    assert.equal(calculateNights(start, end), null);
});

test("empty and reversed dates produce field-specific errors", () => {
  assert.ok(validateSearch(draft({ checkIn: "" })).errors.checkIn);
  assert.match(
    validateSearch(draft({ checkOut: "2027-06-10" })).errors.checkOut,
    /successivo/,
  );
  assert.match(
    validateSearch(draft({ checkOut: "2027-06-09" })).errors.checkOut,
    /successivo/,
  );
});

test("fixed demo window and maximum stay are enforced", () => {
  assert.ok(
    validateSearch(draft({ checkIn: "2026-12-31", checkOut: "2027-01-02" }))
      .errors.checkIn,
  );
  assert.ok(
    validateSearch(draft({ checkIn: "2028-01-01", checkOut: "2028-01-02" }))
      .errors.checkIn,
  );
  assert.ok(
    validateSearch(draft({ checkIn: "2027-12-31", checkOut: "2028-01-02" }))
      .errors.checkOut,
  );
  assert.equal(
    validateSearch(draft({ checkIn: "2027-12-31", checkOut: "2028-01-01" }))
      .nights,
    1,
  );
  assert.equal(
    validateSearch(draft({ checkIn: "2027-06-01", checkOut: "2027-06-15" }))
      .nights,
    14,
  );
  assert.match(
    validateSearch(draft({ checkIn: "2027-06-01", checkOut: "2027-06-16" }))
      .errors.checkOut,
    /14 notti/,
  );
});

test("guest and room counts must be bounded positive integers", () => {
  for (const guests of [
    "0",
    "-1",
    "1.5",
    "1e1",
    "NaN",
    "Infinity",
    "13",
    "",
    " 2",
  ])
    assert.ok(validateSearch(draft({ guests })).errors.guests, guests);
  for (const rooms of ["0", "-1", "2.5", "6", ""])
    assert.ok(validateSearch(draft({ rooms })).errors.rooms, rooms);
  assert.match(
    validateSearch(draft({ guests: "1", rooms: "2" })).errors.guests,
    /almeno un ospite/,
  );
  assert.match(
    validateSearch(draft({ guests: "7", rooms: "2" })).errors.guests,
    /massimo 3/,
  );
});

test("night rates combine summer and Friday/Saturday adjustments in integer cents", () => {
  assert.equal(nightlyRateCents("ulivo", "2027-06-10"), 14500);
  assert.equal(nightlyRateCents("ulivo", "2027-06-11"), 16000);
  assert.equal(nightlyRateCents("ulivo", "2027-06-12"), 16000);
  assert.equal(nightlyRateCents("ulivo", "2027-07-02"), 20350);
  assert.equal(nightlyRateCents("ulivo", "2027-08-01"), 18850);
  assert.equal(nightlyRateCents("lino", "2027-07-02"), 17750);
  assert.throws(() => nightlyRateCents("ulivo", "2027-02-30"), RangeError);
});

test("check-out is excluded from both occupancy and amount", () => {
  assert.equal(isUnitAvailable("ulivo-1", "2027-01-27", "2027-01-29"), true);
  assert.equal(isUnitAvailable("ulivo-1", "2027-01-27", "2027-01-30"), false);
  const result = searchAvailability(draft({ checkOut: "2027-06-11" }));
  assert.equal(result.status, "success");
  assert.equal(
    result.offers.find((offer) => offer.lines[0].type === "lino").totalCents,
    12500,
  );
});

test("summer boundary is calculated night by night", () => {
  const result = searchAvailability(
    draft({ checkIn: "2027-06-30", checkOut: "2027-07-02" }),
  );
  assert.equal(result.status, "success");
  const ulivo = result.offers.find((offer) => offer.lines[0].type === "ulivo");
  assert.deepEqual(
    ulivo.nightlyTotals.map((night) => night.totalCents),
    [14500, 18850],
  );
  assert.equal(ulivo.totalCents, 33350);
});

test("a changing free room each night does not count as continuous availability", () => {
  assert.equal(isUnitAvailable("ulivo-1", "2027-01-24", "2027-01-31"), false);
  assert.equal(isUnitAvailable("ulivo-2", "2027-01-24", "2027-01-31"), false);
  for (let day = 24; day < 31; day++) {
    const start = `2027-01-${day}`;
    const end = `2027-01-${day + 1}`;
    assert.ok(
      ["ulivo-1", "ulivo-2"].some((id) => isUnitAvailable(id, start, end)),
    );
  }
  const result = searchAvailability(
    draft({ checkIn: "2027-01-24", checkOut: "2027-01-31" }),
  );
  assert.equal(result.status, "success");
  assert.ok(
    result.offers.every((offer) =>
      offer.lines.every((line) => line.type !== "ulivo"),
    ),
  );
  assert.equal(isUnitAvailable("unknown", "2027-06-10", "2027-06-13"), false);
});

test("closure has explicit inclusive start and exclusive end", () => {
  for (const [checkIn, checkOut] of [
    ["2027-11-01", "2027-11-02"],
    ["2027-11-14", "2027-11-15"],
    ["2027-10-31", "2027-11-02"],
  ]) {
    const result = searchAvailability(draft({ checkIn, checkOut }));
    assert.equal(result.status, "empty");
    assert.equal(result.reason, "closed");
  }
  assert.equal(
    searchAvailability(draft({ checkIn: "2027-10-31", checkOut: "2027-11-01" }))
      .status,
    "success",
  );
  assert.equal(
    searchAvailability(draft({ checkIn: "2027-11-15", checkOut: "2027-11-16" }))
      .status,
    "success",
  );
});

test("known single-room example has reproducible full-stay prices", () => {
  const result = searchAvailability(draft());
  assert.equal(result.status, "success");
  assert.deepEqual(
    result.offers.map((offer) => [offer.lines[0].type, offer.totalCents]),
    [
      ["lino", 40500],
      ["ulivo", 46500],
      ["acqua", 55500],
    ],
  );
});

test("mixed types satisfy exactly two rooms and five guests, not per-room guest duplication", () => {
  const result = searchAvailability(draft({ guests: "5", rooms: "2" }));
  assert.equal(result.status, "success");
  assert.equal(result.offers[0].totalCents, 96000);
  assert.ok(result.offers.every((offer) => offer.capacity >= 5));
  for (const offer of result.offers) {
    assert.equal(
      offer.lines.reduce((sum, line) => sum + line.quantity, 0),
      2,
    );
    assert.equal(
      offer.lines.flatMap((line) => line.guests).reduce((sum, g) => sum + g, 0),
      5,
    );
    for (const line of offer.lines)
      assert.ok(line.guests.every((g) => g >= 1 && g <= line.capacityPerRoom));
  }
});

test("all five physical units can host the 12-place maximum without duplicates", () => {
  const result = searchAvailability(
    draft({
      checkIn: "2027-01-04",
      checkOut: "2027-01-05",
      guests: "12",
      rooms: "5",
    }),
  );
  assert.equal(result.status, "success");
  assert.equal(result.offers.length, 1);
  const offer = result.offers[0];
  assert.equal(offer.capacity, 12);
  assert.equal(offer.totalCents, 76500);
  assert.equal(new Set(offer.lines.flatMap((line) => line.unitIds)).size, 5);
  assert.equal(
    offer.lines.flatMap((line) => line.guests).reduce((sum, g) => sum + g, 0),
    12,
  );
});

test("valid but unavailable searches remain distinct from validation errors", () => {
  const result = searchAvailability(draft({ guests: "5", rooms: "5" }));
  assert.equal(result.status, "empty");
  assert.equal(result.reason, "unavailable");
  assert.equal(searchAvailability(draft({ guests: "13" })).status, "invalid");
});

test("searches are deterministic, do not mutate inventory and keep totals coherent", () => {
  const before = JSON.stringify(ROOM_UNITS);
  const first = searchAvailability(draft());
  assert.deepEqual(searchAvailability(draft()), first);
  assert.equal(JSON.stringify(ROOM_UNITS), before);
  for (let day = 1; day <= 28; day++) {
    const result = searchAvailability(
      draft({
        checkIn: `2027-06-${String(day).padStart(2, "0")}`,
        checkOut: `2027-06-${String(day + 1).padStart(2, "0")}`,
        guests: "4",
        rooms: "2",
      }),
    );
    if (result.status !== "success") continue;
    assert.equal(
      new Set(result.offers.map((offer) => offer.id)).size,
      result.offers.length,
    );
    result.offers.forEach((offer, index) => {
      assert.ok(Number.isInteger(offer.totalCents));
      assert.equal(
        offer.totalCents,
        offer.lines.reduce((sum, line) => sum + line.totalCents, 0),
      );
      assert.equal(
        offer.totalCents,
        offer.nightlyTotals.reduce((sum, night) => sum + night.totalCents, 0),
      );
      if (index)
        assert.ok(offer.totalCents >= result.offers[index - 1].totalCents);
      for (const line of offer.lines)
        for (const id of line.unitIds)
          assert.ok(
            isUnitAvailable(
              id,
              result.criteria.checkIn,
              result.criteria.checkOut,
            ),
          );
    });
  }
});

test("GET initialization supports idle, complete, partial and duplicate query states", () => {
  assert.equal(initialSearch(new URLSearchParams()).result, null);
  assert.equal(
    initialSearch(new URLSearchParams(draft())).result.status,
    "success",
  );
  assert.equal(
    initialSearch(new URLSearchParams("checkIn=2027-06-10")).result.status,
    "invalid",
  );
  const params = new URLSearchParams(draft());
  params.append("guests", "9");
  assert.match(initialSearch(params).result.errors.guests, /un solo valore/);
});
