import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConvergeDivider from "./ConvergeDivider";

describe("ConvergeDivider", () => {
  it("is decorative and hidden from assistive tech", () => {
    render(<ConvergeDivider />);
    const divider = screen.getByTestId("converge-divider");
    expect(divider).toHaveAttribute("aria-hidden", "true");
  });

  it("draws six strokes converging into a single node", () => {
    const { container } = render(<ConvergeDivider />);
    expect(container.querySelectorAll("svg.converge .ln")).toHaveLength(6);
    expect(container.querySelectorAll("svg.converge .node")).toHaveLength(1);
  });
});
