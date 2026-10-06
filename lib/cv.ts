import type { Locale } from "@/i18n/locale";

// A CV file path is a locale-dependent ASSET, not a translated sentence — it
// doesn't belong in messages/*.json (a translator would never touch it), so
// it lives here, keyed the same way the message catalogs are. Shared by the
// Hero CTA and the Navbar button.
export const cvFileByLocale = {
  es: "/Carlos_Vasquez_Desarrollador_Fullstack_CV.pdf",
  en: "/CV_Carlos_Vasquez_Fullstack_Developer_EN.pdf",
} as const satisfies Record<Locale, string>;
