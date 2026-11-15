import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type UseCarouselOptions = {
  /** Scrolls to the next card on this interval (ms). Leave out to disable autoplay. */
  autoplayMs?: number;
  /** Space between cards in px (must match the CSS gap). */
  gap?: number;
};

/**
 * Behaviour for a horizontal scroll-snap carousel: previous/next buttons that wrap
 * around, optional autoplay, and pause/resume handlers for hover and focus.
 */
export function useCarousel<T extends HTMLElement>({ autoplayMs, gap = 24 }: UseCarouselOptions = {}) {
  const trackRef = useRef<T>(null);
  const pausedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + gap : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      const atStart = track.scrollLeft <= 8;

      if (direction === 1 && atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else if (direction === -1 && atStart) {
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: direction * step, behavior: "smooth" });
      }
    },
    [gap],
  );

  useEffect(() => {
    if (!autoplayMs || reduceMotion) return;
    const id = setInterval(() => {
      if (!pausedRef.current) scrollByCard(1);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [autoplayMs, reduceMotion, scrollByCard]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  return { trackRef, scrollByCard, pause, resume };
}
