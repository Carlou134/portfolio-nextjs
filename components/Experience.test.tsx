import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Experience from "./Experience";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// Experience no longer touches LanguageContext post-migration, so only
// NextIntlClientProvider is needed here (matches Hero/Projects/Stack tests).
// Locale is a prop, not global state, so switching it per test is just a
// different render, not a click+wait against localStorage.
function renderExperience(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Experience />
    </NextIntlClientProvider>,
  );
}

describe("Experience highlights", () => {
  it("emphasizes the module count", () => {
    renderExperience("es");
    const strong = screen.getByText("+10 módulos", { selector: "strong" });
    expect(strong).toHaveClass("text-text-primary");
    expect(strong.closest("li")).toHaveTextContent(
      "+10 módulos en producción para Comercial, Administración, Tráfico, Operaciones y RR. HH.",
    );
  });

  it("does not leak markup into the visible text", () => {
    const { container } = renderExperience("es");
    expect(container.textContent).not.toMatch(/<\/?strong/);
  });

  it("emphasizes the module count in English", () => {
    renderExperience("en");
    expect(
      screen.getByText("+10 modules", { selector: "strong" }),
    ).toBeInTheDocument();
  });

  // Unmeasured percentages were removed on purpose; keep them out.
  it("ships no unmeasured percentages", () => {
    for (const locale of ["es", "en"] as const) {
      const { container, unmount } = renderExperience(locale);
      expect(container.textContent).not.toMatch(/\d+\s?%/);
      unmount();
    }
  });

  it("renders the current badge only for the ongoing role", () => {
    renderExperience("es");
    expect(screen.getByText("Actual")).toBeInTheDocument();
    expect(screen.getAllByText("Actual")).toHaveLength(1);
  });

  it("renders the current badge translated in English", () => {
    renderExperience("en");
    expect(screen.getByText("Current")).toBeInTheDocument();
  });
});
