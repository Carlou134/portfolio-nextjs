import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Education from "./Education";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

function renderEducation(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Education />
    </NextIntlClientProvider>,
  );
}

describe("Education", () => {
  it("renders the three Spanish cards: degree, English and focus", () => {
    renderEducation("es");
    expect(screen.getByText("Educación y certificaciones")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    for (const name of [
      "Bachiller en Ingeniería de Sistemas de Información",
      "Inglés B2 — Avanzado",
      "Arquitectura e IA aplicada",
    ]) {
      expect(
        screen.getByRole("heading", { level: 3, name }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText(/Quinto Superior/)).toBeInTheDocument();
    expect(
      screen.getByText(/Tesis: Sistema web basado en el framework NIST/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Británico \(2022–2024\)/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "UPC" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Británico" })).toBeInTheDocument();
  });

  it("renders the English degree with the top 20% ranking", () => {
    renderEducation("en");
    expect(
      screen.getByText("Education and certifications"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "BSc in Information Systems Engineering",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Top 20% of class/)).toBeInTheDocument();
  });

  it("is reachable through its anchor", () => {
    const { container } = renderEducation("es");
    expect(container.querySelector("section#educacion")).toBeInTheDocument();
  });
});
