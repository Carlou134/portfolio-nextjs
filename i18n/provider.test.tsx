import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, useTranslations } from "next-intl";

// This is not a real feature: it's the smoke test for commit 8 ("add
// next-intl with es/en locales"). No visible component consumes next-intl
// yet — that migration happens component by component in later commits — so
// there's nothing else to exercise this plumbing against. It proves
// NextIntlClientProvider + useTranslations resolve messages correctly, which
// every future migrated component will rely on.
const messages = {
  I18nInfra: { smokeTest: "next-intl está funcionando" },
};

function Probe() {
  const t = useTranslations("I18nInfra");
  return <p>{t("smokeTest")}</p>;
}

describe("next-intl client wiring", () => {
  it("resolves a namespaced message through the provider", () => {
    render(
      <NextIntlClientProvider locale="es" messages={messages}>
        <Probe />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText("next-intl está funcionando")).toBeInTheDocument();
  });

  it("throws when rendered without a provider", () => {
    // Guards against a future migrated component forgetting the provider
    // somewhere in its tree; next-intl fails loudly rather than rendering blank.
    expect(() => render(<Probe />)).toThrow();
  });
});
