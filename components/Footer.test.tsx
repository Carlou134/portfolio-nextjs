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

const year = new Date().getFullYear();

describe("Footer", () => {
  it("renders the Spanish copyright and tagline", () => {
    renderFooter("es");
    expect(
      screen.getByText(`© ${year} Carlos Vásquez Rodriguez · Lima, Perú`),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hecho a mano · sin plantilla · dark mode por defecto"),
    ).toBeInTheDocument();
  });

  it("renders the English copyright and tagline", () => {
    renderFooter("en");
    expect(
      screen.getByText(`© ${year} Carlos Vásquez Rodriguez · Lima, Peru`),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hand-built · no template · dark mode by default"),
    ).toBeInTheDocument();
  });
});
