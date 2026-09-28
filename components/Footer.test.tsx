import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import Footer from "./Footer";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// Footer no longer touches LanguageContext post-migration, so only
// NextIntlClientProvider is needed here (matches Hero/Projects/Stack tests).
function renderFooter(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Footer />
    </NextIntlClientProvider>,
  );
}

describe("Footer", () => {
  it("renders the Spanish location and built-with strings", () => {
    renderFooter("es");
    expect(
      screen.getByText(new RegExp("cfvasquez · Lima, Perú")),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Construido con Next.js + Tailwind + Framer Motion"),
    ).toBeInTheDocument();
  });

  it("renders the English location and built-with strings", () => {
    renderFooter("en");
    expect(
      screen.getByText(new RegExp("cfvasquez · Lima, Peru")),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Built with Next.js + Tailwind + Framer Motion"),
    ).toBeInTheDocument();
  });

  it("appends the current year next to the location", () => {
    renderFooter("es");
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
