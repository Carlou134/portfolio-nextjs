"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle of the
 * viewport, or null when none is (e.g. at the very top, over the Hero).
 *
 * The -50%/-50% rootMargin shrinks the observed area to a 1px line across the
 * viewport's center, so at most one section intersects at a time — no
 * "which of the visible ones wins" bookkeeping, and no scroll listener.
 */
export function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          } else {
            // Leaving the center line without another section entering it
            // (scrolled back up into the Hero): nothing is active.
            setActiveId((current) =>
              current === entry.target.id ? null : current,
            );
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
