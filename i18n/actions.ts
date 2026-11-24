"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, type Locale } from "./locale";

// Setting a cookie in a Server Action makes Next.js re-render the current
// page and its layouts on the server (docs: app/getting-started/mutating-data
// #cookies) — client component state is preserved, so this needs no
// router.refresh() and no full navigation. That is what keeps the toggle's
// existing instant-feeling UX (and the Playwright specs that assert on it)
// working with a server-resolved locale instead of client-only state.
export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
