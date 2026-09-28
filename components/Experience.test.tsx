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
  it.each(["+10 módulos", "20%", "15%", "40%"])(
    "renders %s as emphasized text",
    (highlight) => {
      renderExperience("es");
      const strong = screen.getByText(highlight, { selector: "strong" });
      expect(strong).toHaveClass("text-text-primary");
    },
  );

  it("keeps the rest of the sentence around the highlight", () => {
    renderExperience("es");
    const item = screen
      .getByText("+10 módulos", { selector: "strong" })
      .closest("li");
    expect(item).toHaveTextContent(
      "Construcción de +10 módulos empresariales en producción bajo Clean Architecture y CQRS.",
    );
  });

  it("does not leak markup into the visible text", () => {
    const { container } = renderExperience("es");
    expect(container.textContent).not.toMatch(/<\/?strong/);
  });

  describe("in English", () => {
    it("emphasizes the enterprise-modules count", () => {
      renderExperience("en");
      const strong = screen.getByText("+10 enterprise modules", {
        selector: "strong",
      });
      expect(strong).toHaveClass("text-text-primary");
      expect(strong.closest("li")).toHaveTextContent(
        "Built +10 enterprise modules in production under Clean Architecture and CQRS.",
      );
    });

    it("keeps emphasizing the percentages", () => {
      renderExperience("en");
      expect(
        screen.getByText("20%", { selector: "strong" }),
      ).toBeInTheDocument();
    });
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
