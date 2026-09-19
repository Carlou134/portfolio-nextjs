import { describe, it, expect } from "vitest";
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

  it("highlights the English variant when the language is en", async () => {
    window.localStorage.setItem("portfolio-lang", "en");
    renderExperience();
    // LanguageProvider syncs from localStorage after mount, so wait for it.
    expect(
      await screen.findByText("Built +10 enterprise modules", {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("20%", { selector: "strong" })).toBeInTheDocument();
  });
});
