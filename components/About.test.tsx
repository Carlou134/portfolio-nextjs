import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import About from "./About";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// About no longer touches LanguageContext post-migration, so only
// NextIntlClientProvider is needed here (matches Hero/Projects/Stack/Experience tests).
function renderAbout(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <About />
    </NextIntlClientProvider>,
  );
}

describe("About", () => {
  it("renders the Spanish section label and bio", () => {
    renderAbout("es");
    expect(screen.getByText("Sobre mí")).toBeInTheDocument();
    expect(
      screen.getByText(/Desarrollo software desde hace \+2 años/),
    ).toBeInTheDocument();
  });

  it("renders the English section label and bio", () => {
    renderAbout("en");
    expect(screen.getByText("About me")).toBeInTheDocument();
    expect(
      screen.getByText(/I've been building software for \+2 years/),
    ).toBeInTheDocument();
  });

  it("renders the education card in Spanish", () => {
    renderAbout("es");
    expect(screen.getByText("Formación académica")).toBeInTheDocument();
    expect(screen.getByText("Ingeniería de Sistemas")).toBeInTheDocument();
    expect(screen.getByText("10mo ciclo")).toBeInTheDocument();
    expect(screen.getByText("Quinto Superior")).toBeInTheDocument();
    expect(screen.getByText("Investigación de tesis")).toBeInTheDocument();
  });

  it("renders the education card in English", () => {
    renderAbout("en");
    expect(screen.getByText("Academic background")).toBeInTheDocument();
    expect(screen.getByText("Systems Engineering")).toBeInTheDocument();
    expect(screen.getByText("10th semester")).toBeInTheDocument();
    expect(screen.getByText("Top of class")).toBeInTheDocument();
    expect(screen.getByText("Thesis research")).toBeInTheDocument();
  });

  it("renders the locale-neutral university name and thesis tags in both locales", () => {
    renderAbout("es");
    expect(
      screen.getByText("Universidad Peruana de Ciencias Aplicadas"),
    ).toBeInTheDocument();
    expect(screen.getByText("LightGBM")).toBeInTheDocument();
  });
});
