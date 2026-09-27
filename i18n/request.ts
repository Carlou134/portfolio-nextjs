import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "./locale";

// No [locale] URL segment (deliberate: see commit 8 in the plan — a cookie
// keeps today's URLs and Spanish-only indexing untouched). Locale is read
// straight from the cookie set by the Server Action in ./actions.ts;
// requestLocale (URL-segment based, and deprecated upstream in favor of
// next/root-params) does not apply here.
export default getRequestConfig(async () => {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = stored && isLocale(stored) ? stored : defaultLocale;

  // One JSON per locale, namespaced by component inside (the standard
  // next-intl layout). Each migration commit (9-16) only adds its own
  // namespace to both files.
  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
