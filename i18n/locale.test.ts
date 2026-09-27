import { describe, it, expect } from "vitest";
import { defaultLocale, isLocale, locales } from "./locale";

describe("isLocale", () => {
  it.each(locales)("accepts %s", (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it.each(["fr", "ES", "", "es-PE", "en-US"])("rejects %s", (value) => {
    expect(isLocale(value)).toBe(false);
  });

  it("keeps the default locale in the supported list", () => {
    expect(locales).toContain(defaultLocale);
  });
});
