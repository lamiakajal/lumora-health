"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { validateTimeOff, validateWeeklyRules, type TimeOffEntry } from "@/lib/booking/availability-rules";
import type { WeeklyRule } from "@/lib/booking/slots";
import { formatMinutes, localDateOf, minutesOfDay } from "@/lib/booking/time";
import type { EditorAvailability } from "@/lib/booking/types";
import { bufferOptions, slotLengthOptions } from "@/lib/validation/provider";

type Window = { start: string; end: string };

// Monday first, the way people read a week.
const DAYS = [
  { index: 1, label: "Monday" },
  { index: 2, label: "Tuesday" },
  { index: 3, label: "Wednesday" },
  { index: 4, label: "Thursday" },
  { index: 5, label: "Friday" },
  { index: 6, label: "Saturday" },
  { index: 0, label: "Sunday" },
] as const;

const field =
  "h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function groupByDay(rules: readonly WeeklyRule[]): Record<number, Window[]> {
  const grouped: Record<number, Window[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  for (const rule of rules) grouped[rule.dayOfWeek].push({ start: rule.start, end: rule.end });
  for (const list of Object.values(grouped)) list.sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start));
  return grouped;
}

export function AvailabilityEditor({ initial }: { initial: EditorAvailability }) {
  const router = useRouter();
  const [days, setDays] = useState<Record<number, Window[]>>(() => groupByDay(initial.weekly));
  const [slotMinutes, setSlotMinutes] = useState(initial.slotMinutes);
  const [bufferMinutes, setBufferMinutes] = useState(initial.bufferMinutes);
  const [timeOff, setTimeOff] = useState<TimeOffEntry[]>(initial.timeOff);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setWindows(day: number, next: Window[]) {
    setDays((current) => ({ ...current, [day]: next }));
  }

  function addWindow(day: number) {
    const list = days[day];
    const last = list[list.length - 1];
    const next: Window = last
      ? { start: last.end, end: formatMinutes(Math.min(minutesOfDay(last.end) + 180, 23 * 60 + 59)) }
      : { start: "09:00", end: "17:00" };
    setWindows(day, [...list, next]);
  }

  function changeWindow(day: number, index: number, key: keyof Window, value: string) {
    setWindows(day, days[day].map((item, position) => (position === index ? { ...item, [key]: value } : item)));
  }

  function changeTimeOff(index: number, key: keyof TimeOffEntry, value: string) {
    setTimeOff((current) => current.map((entry, position) => (position === index ? { ...entry, [key]: value } : entry)));
  }

  function addTimeOff() {
    const today = localDateOf(new Date(), initial.timezone);
    setTimeOff((current) => [...current, { startDate: today, endDate: today, reason: "" }]);
  }

  async function save() {
    const weekly: WeeklyRule[] = DAYS.flatMap(({ index }) =>
      days[index].map((item) => ({ dayOfWeek: index, start: item.start, end: item.end })),
    );
    const problem = validateWeeklyRules(weekly) ?? validateTimeOff(timeOff);
    if (problem) {
      setError(problem);
      toast.error("Please fix your hours", { description: problem });
      return;
    }
    setError(null);
    setSaving(true);

    try {
      const response = await fetch("/api/provider/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekly, slotMinutes, bufferMinutes, timeOff }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? "We could not save your hours.");
        toast.error("We could not save your hours", { description: body.error ?? "Please try again." });
        return;
      }
      toast.success("Your hours are saved", { description: "New bookings will follow them right away." });
      router.refresh();
    } catch {
      toast.error("We could not reach the server", { description: "Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Times are in your clinic time zone ({initial.timezone.replace("_", " ")}). Changes apply to new
        bookings; existing appointments are not moved.
      </p>

      <div className="space-y-3">
        {DAYS.map(({ index, label }) => (
          <div key={index} className="flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-start">
            <p className="w-28 shrink-0 pt-2 font-semibold">{label}</p>
            <div className="flex-1 space-y-2">
              {days[index].length === 0 && <p className="pt-2 text-sm text-muted-foreground">Closed</p>}
              {days[index].map((item, position) => (
                <div key={position} className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`start-${index}-${position}`}>
                    {label} start
                  </label>
                  <input
                    id={`start-${index}-${position}`}
                    type="time"
                    value={item.start}
                    onChange={(event) => changeWindow(index, position, "start", event.target.value)}
                    className={field}
                  />
                  <span className="text-muted-foreground">to</span>
                  <label className="sr-only" htmlFor={`end-${index}-${position}`}>
                    {label} end
                  </label>
                  <input
                    id={`end-${index}-${position}`}
                    type="time"
                    value={item.end}
                    onChange={(event) => changeWindow(index, position, "end", event.target.value)}
                    className={field}
                  />
                  <button
                    type="button"
                    onClick={() => setWindows(index, days[index].filter((_, spot) => spot !== position))}
                    aria-label={`Remove ${label} hours`}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addWindow(index)}
                className="text-sm font-bold text-primary-deep hover:underline"
              >
                + Add hours
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Visit length
          <select
            value={slotMinutes}
            onChange={(event) => setSlotMinutes(Number(event.target.value))}
            className={`${field} mt-1.5 w-full`}
          >
            {slotLengthOptions.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Break between visits
          <select
            value={bufferMinutes}
            onChange={(event) => setBufferMinutes(Number(event.target.value))}
            className={`${field} mt-1.5 w-full`}
          >
            {bufferOptions.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes === 0 ? "No break" : `${minutes} minutes`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold">Holidays and time off</h3>
        <p className="mt-1 text-sm text-muted-foreground">Whole days when you cannot be booked.</p>
        <div className="mt-4 space-y-3">
          {timeOff.length === 0 && <p className="text-sm text-muted-foreground">No time off scheduled.</p>}
          {timeOff.map((entry, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 rounded-xl border bg-background p-3">
              <input
                type="date"
                aria-label="First day off"
                value={entry.startDate}
                onChange={(event) => changeTimeOff(index, "startDate", event.target.value)}
                className={field}
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                aria-label="Last day off"
                value={entry.endDate}
                onChange={(event) => changeTimeOff(index, "endDate", event.target.value)}
                className={field}
              />
              <input
                type="text"
                aria-label="Reason"
                placeholder="Reason (optional)"
                maxLength={100}
                value={entry.reason}
                onChange={(event) => changeTimeOff(index, "reason", event.target.value)}
                className={`${field} min-w-40 flex-1`}
              />
              <button
                type="button"
                onClick={() => setTimeOff((current) => current.filter((_, spot) => spot !== index))}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-500/10 dark:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addTimeOff} className="mt-3 text-sm font-bold text-primary-deep hover:underline">
          + Add time off
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save my hours"}
      </button>
    </div>
  );
}
