import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentType } from "react";
import About from "./About";
import Stack from "./Stack";
import Projects from "./Projects";
import MoreProjects from "./MoreProjects";
import Experience from "./Experience";
import Education from "./Education";
import Contact from "./Contact";
import esMessages from "@/messages/es.json";

// The page has one h1 (Hero). Every section must open at h2 so the outline
// never jumps h1 -> h3 (WCAG 1.3.1): screen-reader users navigate by headings.
const sections: [string, ComponentType][] = [
  ["About", About],
  ["Stack", Stack],
  ["Projects", Projects],
  ["MoreProjects", MoreProjects],
  ["Experience", Experience],
  ["Education", Education],
  ["Contact", Contact],
];

function headingLevels(container: HTMLElement) {
  return Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) =>
    Number(h.tagName[1]),
  );
}

describe("section headings", () => {
  it.each(sections)("%s opens with an h2", (_name, Section) => {
    render(
      <NextIntlClientProvider locale="es" messages={esMessages}>
        <Section />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(
      0,
    );
  });

  it.each(sections)("%s never skips a heading level", (_name, Section) => {
    const { container } = render(
      <NextIntlClientProvider locale="es" messages={esMessages}>
        <Section />
      </NextIntlClientProvider>,
    );
    const levels = headingLevels(container);
    expect(levels[0]).toBe(2);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });
});
