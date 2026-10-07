import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import About from "./About";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

function renderAbout(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <About />
    </NextIntlClientProvider>,
  );
}

describe("About", () => {
  it("renders the Spanish label, heading and bio", () => {
    renderAbout("es");
    expect(screen.getByText("Sobre mí")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Trabajo de punta a punta/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Desarrollo software en entornos reales/),
    ).toBeInTheDocument();
  });

  it("renders the English label, heading and bio", () => {
    renderAbout("en");
    expect(screen.getByText("About me")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /I work end to end/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I build software in real production/),
    ).toBeInTheDocument();
  });

  it("renders the three sourced metrics", () => {
    renderAbout("es");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    for (const value of ["+10", "20%", "−40%"]) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });

  it("no longer repeats the hero's photo, education or availability", () => {
    renderAbout("es");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Quinto Superior|UPC|B2|Disponible/),
    ).not.toBeInTheDocument();
  });
});
