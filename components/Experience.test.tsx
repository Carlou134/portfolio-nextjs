import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Experience from "./Experience";
import { LanguageProvider } from "@/contexts/LanguageContext";

function renderExperience() {
  return render(<Experience />, { wrapper: LanguageProvider });
}

describe("Experience highlights", () => {
  it.each(["+10 módulos", "20%", "15%", "40%"])(
    "renders %s as emphasized text",
    (highlight) => {
      renderExperience();
      const strong = screen.getByText(highlight, { selector: "strong" });
      expect(strong).toHaveClass("text-text-primary");
    },
  );

  it("keeps the rest of the sentence around the highlight", () => {
    renderExperience();
    const item = screen
      .getByText("+10 módulos", { selector: "strong" })
      .closest("li");
    expect(item).toHaveTextContent(
      "Construcción de +10 módulos empresariales en producción bajo Clean Architecture y CQRS.",
    );
  });

  it("does not leak markup into the visible text", () => {
    const { container } = renderExperience();
    expect(container.textContent).not.toMatch(/<\/?strong/);
  });

  describe("in English", () => {
    beforeEach(() => {
      window.localStorage.setItem("portfolio-lang", "en");
    });

    it("emphasizes the enterprise-modules count", async () => {
      renderExperience();
      // LanguageProvider syncs from localStorage after mount, so wait for it.
      const strong = await screen.findByText("+10 enterprise modules", {
        selector: "strong",
      });
      expect(strong).toHaveClass("text-text-primary");
      expect(strong.closest("li")).toHaveTextContent(
        "Built +10 enterprise modules in production under Clean Architecture and CQRS.",
      );
    });

    it("keeps emphasizing the percentages", async () => {
      renderExperience();
      expect(
        await screen.findByText("20%", { selector: "strong" }),
      ).toBeInTheDocument();
    });
  });
});
