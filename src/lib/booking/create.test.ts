import { describe, expect, it } from "vitest";
import {
  isDuplicateKeyError,
  placeBooking,
  placeReschedule,
  SlotUnavailableError,
  type BookingRepo,
  type NewBooking,
  type RescheduleRepo,
} from "./create";
import type { AvailabilityConfig, Interval } from "./slots";

const config: AvailabilityConfig = {
  timezone: "America/Los_Angeles",
  weekly: [{ dayOfWeek: 1, start: "09:00", end: "12:00" }],
  slotMinutes: 30,
  bufferMinutes: 0,
  timeOff: [],
};

const NOW = new Date("2026-11-20T00:00:00.000Z");
const SLOT_START = new Date("2026-11-23T17:00:00.000Z"); // Monday 09:00 PST

/**
 * An in-memory stand-in for MongoDB that, like the real unique index, refuses a
 * second booking for the same doctor at the same start time.
 */
function fakeRepo(initial: Interval[] = []): BookingRepo & { saved: NewBooking[] } {
  const saved: NewBooking[] = [];
  const busy = [...initial];
  return {
    saved,
    async findBusy() {
      return [...busy];
    },
    async insert(booking) {
      const taken = saved.some((existing) => existing.start.getTime() === booking.start.getTime());
      if (taken) throw Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
      saved.push(booking);
      return { id: String(saved.length) };
    },
  };
}

const request = {
  patientId: "patient-1",
  patientName: "Test Patient",
  patientEmail: "patient@example.com",
  providerSlug: "amelia-hart",
  serviceSlug: "primary-care",
  start: SLOT_START,
  visitType: "in-person" as const,
  reason: "Check-up",
  priceCents: 12900,
};

const args = (repo: BookingRepo, booking = request) => ({
  repo,
  config,
  booking,
  now: NOW,
  durationMinutes: 30,
  minNoticeMinutes: 120,
});

describe("placeBooking", () => {
  it("books an open slot and stores the end time and time zone", async () => {
    const repo = fakeRepo();
    const result = await placeBooking(args(repo));
    expect(result.start.toISOString()).toBe("2026-11-23T17:00:00.000Z");
    expect(result.end.toISOString()).toBe("2026-11-23T17:30:00.000Z");
    expect(repo.saved[0].timezone).toBe("America/Los_Angeles");
  });

  it("rejects a time that is not on the doctor's schedule", async () => {
    const repo = fakeRepo();
    const sunday = { ...request, start: new Date("2026-11-22T17:00:00.000Z") };
    await expect(placeBooking(args(repo, sunday))).rejects.toBeInstanceOf(SlotUnavailableError);
    expect(repo.saved).toHaveLength(0);
  });

  it("rejects a time that does not line up with a slot", async () => {
    const repo = fakeRepo();
    const odd = { ...request, start: new Date("2026-11-23T17:10:00.000Z") };
    await expect(placeBooking(args(repo, odd))).rejects.toBeInstanceOf(SlotUnavailableError);
  });

  it("rejects a slot that is already booked", async () => {
    const repo = fakeRepo([{ start: SLOT_START, end: new Date(SLOT_START.getTime() + 30 * 60_000) }]);
    await expect(placeBooking(args(repo))).rejects.toBeInstanceOf(SlotUnavailableError);
  });

  it("rejects a date too far in the future", async () => {
    const repo = fakeRepo();
    const farFuture = { ...request, start: new Date("2027-03-01T17:00:00.000Z") };
    await expect(placeBooking(args(repo, farFuture))).rejects.toBeInstanceOf(SlotUnavailableError);
  });

  it("lets only one of two simultaneous patients have the slot", async () => {
    const repo = fakeRepo();
    const results = await Promise.allSettled([
      placeBooking(args(repo, { ...request, patientId: "patient-1" })),
      placeBooking(args(repo, { ...request, patientId: "patient-2" })),
    ]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(SlotUnavailableError);
    expect(repo.saved).toHaveLength(1);
  });

  it("passes unexpected database errors through", async () => {
    const repo: BookingRepo = {
      findBusy: async () => [],
      insert: async () => {
        throw new Error("connection lost");
      },
    };
    await expect(placeBooking(args(repo))).rejects.toThrow("connection lost");
  });
});

describe("isDuplicateKeyError", () => {
  it("recognises MongoDB's duplicate key code", () => {
    expect(isDuplicateKeyError({ code: 11000 })).toBe(true);
    expect(isDuplicateKeyError({ code: 1 })).toBe(false);
    expect(isDuplicateKeyError(null)).toBe(false);
    expect(isDuplicateKeyError("boom")).toBe(false);
  });
});


describe("placeReschedule", () => {
  const current = {
    start: new Date("2026-11-23T17:00:00.000Z"),
    end: new Date("2026-11-23T17:30:00.000Z"),
  };
  const target = new Date("2026-11-23T18:00:00.000Z"); // Monday 10:00 PST

  function rescheduleRepo(busy: Interval[] = [], moved = true): RescheduleRepo & { moves: Date[] } {
    const moves: Date[] = [];
    return {
      moves,
      findBusy: async () => [current, ...busy], // the booking's own slot is always in the busy list
      async move(start) {
        moves.push(start);
        return moved;
      },
    };
  }

  const reschedule = (repo: RescheduleRepo, newStart = target) =>
    placeReschedule({ repo, config, current, newStart, now: NOW, durationMinutes: 30, minNoticeMinutes: 120 });

  it("moves a booking to another open slot", async () => {
    const repo = rescheduleRepo();
    const slot = await reschedule(repo);
    expect(slot.start.toISOString()).toBe("2026-11-23T18:00:00.000Z");
    expect(slot.end.toISOString()).toBe("2026-11-23T18:30:00.000Z");
    expect(repo.moves).toHaveLength(1);
  });

  it("does not let a booking collide with itself when moving to an overlapping time", async () => {
    // A 60 minute visit at 09:00-10:00 moves to 09:30-10:30. Those overlap, but the only
    // thing in the way is the booking's own old time, which must be ignored.
    const own = { start: current.start, end: new Date(current.start.getTime() + 60 * 60_000) };
    const repo: RescheduleRepo = { findBusy: async () => [own], move: async () => true };
    const slot = await placeReschedule({
      repo,
      config,
      current: own,
      newStart: new Date("2026-11-23T17:30:00.000Z"),
      now: NOW,
      durationMinutes: 60,
      minNoticeMinutes: 120,
    });
    expect(slot.start.toISOString()).toBe("2026-11-23T17:30:00.000Z");
    expect(slot.end.toISOString()).toBe("2026-11-23T18:30:00.000Z");
  });

  it("rejects a slot someone else already has", async () => {
    const repo = rescheduleRepo([{ start: target, end: new Date(target.getTime() + 30 * 60_000) }]);
    await expect(reschedule(repo)).rejects.toBeInstanceOf(SlotUnavailableError);
    expect(repo.moves).toHaveLength(0);
  });

  it("rejects a time outside the doctor's hours", async () => {
    await expect(reschedule(rescheduleRepo(), new Date("2026-11-24T17:00:00.000Z"))).rejects.toBeInstanceOf(
      SlotUnavailableError,
    );
  });

  it("turns a duplicate key error from the database into a friendly one", async () => {
    const repo: RescheduleRepo = {
      findBusy: async () => [current],
      move: async () => {
        throw Object.assign(new Error("E11000"), { code: 11000 });
      },
    };
    await expect(reschedule(repo)).rejects.toBeInstanceOf(SlotUnavailableError);
  });

  it("reports a booking that was cancelled while being moved", async () => {
    await expect(reschedule(rescheduleRepo([], false))).rejects.toThrow("no longer be changed");
  });
});
