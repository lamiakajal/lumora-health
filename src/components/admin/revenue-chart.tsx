"use client";

import { motion } from "motion/react";
import type { RevenueBucket } from "@/lib/admin/revenue";
import { formatPrice } from "@/lib/booking/defaults";

const CHART_HEIGHT = 180;

/** Weekly visit value: solid bars are completed visits, light bars are visits still to come. */
export function RevenueChart({ data }: { data: RevenueBucket[] }) {
  const max = Math.max(1, ...data.map((bucket) => bucket.completed + bucket.upcoming));

  return (
    <figure>
      <div className="flex items-end gap-2 sm:gap-4" style={{ height: CHART_HEIGHT + 56 }}>
        {data.map((bucket, index) => {
          const total = bucket.completed + bucket.upcoming;
          const completedHeight = (bucket.completed / max) * CHART_HEIGHT;
          const upcomingHeight = (bucket.upcoming / max) * CHART_HEIGHT;
          return (
            <div key={bucket.weekStart} className="flex flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-[11px] font-semibold text-muted-foreground sm:text-xs">
                {total > 0 ? formatPrice(total).replace(".00", "") : ""}
              </span>
              <div
                className="flex w-full max-w-14 flex-col justify-end overflow-hidden rounded-t-lg"
                title={`Week of ${bucket.label}: ${formatPrice(bucket.completed)} completed, ${formatPrice(bucket.upcoming)} upcoming`}
              >
                <motion.div
                  className="w-full bg-primary/30"
                  initial={{ height: 0 }}
                  whileInView={{ height: upcomingHeight }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
                />
                <motion.div
                  className="w-full bg-primary"
                  initial={{ height: 0 }}
                  whileInView={{ height: completedHeight }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
                />
              </div>
              <span className="mt-2 text-[11px] text-muted-foreground sm:text-xs">{bucket.label}</span>
            </div>
          );
        })}
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-sm bg-primary" /> Completed visits
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-sm bg-primary/30" /> Pending and confirmed
        </span>
      </figcaption>

      <table className="sr-only">
        <caption>Visit value by week</caption>
        <thead>
          <tr>
            <th scope="col">Week of</th>
            <th scope="col">Completed</th>
            <th scope="col">Upcoming</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bucket) => (
            <tr key={bucket.weekStart}>
              <th scope="row">{bucket.label}</th>
              <td>{formatPrice(bucket.completed)}</td>
              <td>{formatPrice(bucket.upcoming)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
