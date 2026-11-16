export const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

/** Which status a booking may move to next. Completed and cancelled are final. */
const transitions: Record<BookingStatus, readonly BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return transitions[from].includes(to);
}

/** Statuses that hold a time slot. Cancelled and completed bookings free it. */
export const activeStatuses = ["pending", "confirmed"] as const satisfies readonly BookingStatus[];

export function isActiveStatus(status: BookingStatus): boolean {
  return (activeStatuses as readonly BookingStatus[]).includes(status);
}
