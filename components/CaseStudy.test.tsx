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
    // Mock screenshots + the video.
    expect(mocks).toHaveLength(mockShots + 1);
    expect(mocks.some((m) => within(m).queryByText(/video walkthrough/))).toBe(
      true,
    );
  });

  it("keeps the real metrics and the validation outside the MOCK blocks", () => {
    render(<CaseStudy data={data} />);
    const recall = screen.getByText("98.9%");
    expect(recall.closest("[data-testid='mock-block']")).toBeNull();
    const validation = screen.getByText(/12 analistas N1, N2 y N3/);
    expect(validation.closest("[data-testid='mock-block']")).toBeNull();
  });
});
