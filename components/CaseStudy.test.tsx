import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import CaseStudy from "./CaseStudy";
import { getCaseStudy } from "@/content/case-studies";

const data = getCaseStudy("soc-ml")!;

describe("CaseStudy (preview)", () => {
  it("announces itself as a dev-only preview", () => {
    render(<CaseStudy data={data} />);
    expect(
      screen.getByText("VISTA PRELIMINAR · solo en desarrollo"),
    ).toBeInTheDocument();
  });

  it("renders the real sections in order", () => {
    render(<CaseStudy data={data} />);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "Contexto y problema",
      "Rol y decisiones clave",
      "Arquitectura",
      "Capturas",
      "Snippet curado",
      "Video walkthrough",
      "Resultados y aprendizajes",
    ]);
  });

  it("wraps every placeholder in a MOCK block", () => {
    render(<CaseStudy data={data} />);
    const mocks = screen.getAllByTestId("mock-block");
    const mockShots = data.screenshots.filter((s) => s.mock).length;
    // Mock screenshots + the video + the analyst validation.
    expect(mocks).toHaveLength(mockShots + 2);
    expect(mocks.some((m) => within(m).queryByText(/20 analistas/))).toBe(true);
  });

  it("keeps the real metrics outside the MOCK blocks", () => {
    render(<CaseStudy data={data} />);
    const recall = screen.getByText("98.9%");
    expect(recall.closest("[data-testid='mock-block']")).toBeNull();
  });
});
