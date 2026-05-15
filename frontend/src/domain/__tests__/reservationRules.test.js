import test from "node:test";
import assert from "node:assert/strict";

import {
  defaultGardenTables,
  defaultIndoorTables,
  defaultOpenTerraceTables,
  reservationTimes,
} from "../reservations/tableConfig.js";
import {
  canCombineTables,
  canUseAdminTableSelection,
  getEligibleIndoorGroups,
  getEligibleOpenTerraceGroups,
  getTablesCapacity,
  isLogicalTerraceSelection,
} from "../reservations/tableRules.js";
import {
  getTodayInputValue,
  isPastTimeForDate,
  isWithinReservationBuffer,
  timeToMinutes,
} from "../reservations/dateTimeRules.js";
import {
  getUnavailableSelectedTableIds,
  getUnavailableTableIdsForSlot,
} from "../reservations/availability.js";

const byId = (tables, id) => tables.find((table) => table.id === id);

test("reservation times cover the restaurant day from 10:00 to 22:00", () => {
  assert.equal(reservationTimes.length, 13);
  assert.equal(reservationTimes[0], "10:00");
  assert.equal(reservationTimes.at(-1), "22:00");
});

test("time helpers keep the 60 minute reservation buffer exclusive", () => {
  assert.equal(timeToMinutes("19:30"), 1170);
  assert.equal(isWithinReservationBuffer("19:00", "19:59"), true);
  assert.equal(isWithinReservationBuffer("19:00", "20:00"), false);
  assert.equal(isWithinReservationBuffer("23:30", "00:00"), true);
  assert.equal(isWithinReservationBuffer("10:00 - 22:00", "19:00"), true);
  assert.equal(isWithinReservationBuffer("bad", "bad"), true);
  assert.equal(isWithinReservationBuffer("bad", "19:00"), false);
});

test("date helpers identify past times only for the selected current day", () => {
  const now = new Date("2026-05-14T15:30:00");

  assert.equal(getTodayInputValue(now), "2026-05-14");
  assert.equal(isPastTimeForDate("2026-05-14", "15:00", now), true);
  assert.equal(isPastTimeForDate("2026-05-14", "16:00", now), false);
  assert.equal(isPastTimeForDate("2026-05-15", "10:00", now), false);
});

test("capacity calculation and group eligibility support large indoor parties", () => {
  assert.equal(getTablesCapacity(defaultIndoorTables, ["20", "21", "22", "23"]), 16);
  assert.deepEqual(getEligibleIndoorGroups(16, defaultIndoorTables), [["20", "21", "22", "23"]]);
  assert.deepEqual(getEligibleIndoorGroups(13, defaultIndoorTables), [["20", "21", "22", "23"]]);
});

test("open terrace allows only groups with enough seats", () => {
  assert.deepEqual(getEligibleOpenTerraceGroups(8, defaultOpenTerraceTables), [["46", "47"]]);
  assert.deepEqual(getEligibleOpenTerraceGroups(3, defaultOpenTerraceTables), [["46", "47"], ["48", "49"]]);
  assert.deepEqual(getEligibleOpenTerraceGroups(2, defaultOpenTerraceTables), [["46", "47"], ["48", "49"]]);
});

test("garden table combinations must be logical, continuous, and cannot start from special two-seat tables", () => {
  assert.equal(
    isLogicalTerraceSelection([byId(defaultGardenTables, "42"), byId(defaultGardenTables, "43")], byId(defaultGardenTables, "44")),
    true
  );
  assert.equal(
    isLogicalTerraceSelection([byId(defaultGardenTables, "42"), byId(defaultGardenTables, "44")], byId(defaultGardenTables, "45")),
    false
  );
  assert.equal(
    canCombineTables("garden", [byId(defaultGardenTables, "34A")], byId(defaultGardenTables, "34"), 2, defaultGardenTables),
    false
  );
});

test("admin table selection accepts only configured combinations per area", () => {
  assert.equal(canUseAdminTableSelection("indoor", ["20", "21", "22", "23"]), true);
  assert.equal(canUseAdminTableSelection("indoor", ["20", "24"]), false);
  assert.equal(canUseAdminTableSelection("indoor", ["5", "6"], { requiredSeats: 13, allowPartial: false }), false);
  assert.equal(canUseAdminTableSelection("indoor", ["20"], { requiredSeats: 16, allowPartial: true }), true);
  assert.equal(canUseAdminTableSelection("indoor", ["20", "21", "22"], { requiredSeats: 16, allowPartial: false }), false);
  assert.equal(canUseAdminTableSelection("indoor", ["20", "21", "22", "23"], { requiredSeats: 16, allowPartial: false }), true);
  assert.equal(canUseAdminTableSelection("garden", ["42", "43", "44"]), true);
  assert.equal(
    canUseAdminTableSelection("garden", ["34A", "34"], { gardenSpecialIds: ["34A", "30A", "45A"] }),
    false
  );
  assert.equal(canUseAdminTableSelection("openTerrace", ["46", "47"]), true);
  assert.equal(canUseAdminTableSelection("openTerrace", ["46", "49"]), false);
});

test("availability excludes approved reservations within the buffer and ignores pending/cancelled rows", () => {
  const reservations = [
    { id: 1, status: "Approved", reservedDate: "2026-05-14", reservedTime: "19:00", tableIds: ["20", "21"] },
    { id: 2, status: "Pending", reservedDate: "2026-05-14", reservedTime: "19:00", tableIds: ["22"] },
    { id: 3, status: "Cancelled", reservedDate: "2026-05-14", reservedTime: "19:30", tableIds: ["23"] },
    { id: 4, status: "Approved", reservedDate: "2026-05-15", reservedTime: "19:00", tableIds: ["24"] },
    { id: 5, status: "Approved", reservedDate: "2026-05-14", reservedTime: "20:00", tableIds: ["25"] },
  ];

  const unavailable = getUnavailableTableIdsForSlot(reservations, "2026-05-14", "19:30");

  assert.deepEqual([...unavailable].sort(), ["20", "21", "25"]);
  assert.deepEqual(getUnavailableSelectedTableIds(["20", "22", "25"], unavailable), ["20", "25"]);
  assert.equal(getUnavailableTableIdsForSlot(reservations, "2026-05-14", "19:30", 1).has("20"), false);
});
