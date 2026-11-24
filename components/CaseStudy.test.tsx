import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import CaseStudy from "./CaseStudy";
import { getCaseStudy, type CaseStudy as Data } from "@/content/case-studies";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

const es = getCaseStudy("soc-ml", "es")!;
const en = getCaseStudy("soc-ml", "en")!;

function renderCase(
  locale: "es" | "en",
  data: Data = locale === "es" ? es : en,
) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "es" ? esMessages : enMessages}
    >
      <CaseStudy data={data} />
    </NextIntlClientProvider>,
  );
}

describe("CaseStudy", () => {
  it("ships without preview banner or MOCK blocks", () => {
    renderCase("es");
    expect(screen.queryByText(/VISTA PRELIMINAR/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MOCK/)).not.toBeInTheDocument();
  });

  it("renders the sections in order", () => {
    renderCase("es");
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "Contexto y problema",
      "Rol y decisiones clave",
      "Arquitectura",
      "Capturas",
      "Snippet curado",
      "Video demo",
      "Resultados y aprendizajes",
    ]);
  });

  it("renders the English page in English, content and UI", () => {
    renderCase("en");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "SOC alert prioritization with Machine Learning",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to projects/ }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "Context and problem",
      "Role and key decisions",
      "Architecture",
      "Screenshots",
      "Curated snippet",
      "Video demo",
      "Results and learnings",
    ]);
    expect(screen.getByText(/12 N1, N2 and N3 analysts/)).toBeInTheDocument();
  });

  it("names each screenshot link after its caption", () => {
    renderCase("en");
    expect(
      screen.getByRole("link", {
        name: /^Alert queue sorted by priority.*\(open full size\)$/,
      }),
    ).toHaveAttribute("href", "/cola-alertas.png");
  });

  it("embeds the demo video without tracking cookies, lazily", () => {
    renderCase("es");
    const player = screen.getByTitle(/^Video demo:/);
    expect(player).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/XbaL3qdgyqY",
    );
    expect(player).toHaveAttribute("loading", "lazy");
  });

  it("skips the video section when there is no video", () => {
    renderCase("es", { ...es, video: undefined });
    expect(
      screen.queryByRole("heading", { name: "Video demo" }),
    ).not.toBeInTheDocument();
  });
});

describe("case study content", () => {
  // Both locales must tell the same story: same structure, same numbers.
  it("keeps the English version structurally in sync with the Spanish one", () => {
    expect(en.slug).toBe(es.slug);
    expect(en.projectId).toBe(es.projectId);
    expect(en.decisions).toHaveLength(es.decisions.length);
    expect(en.flow.map((c) => c.boxes.length)).toEqual(
      es.flow.map((c) => c.boxes.length),
    );
    expect(en.screenshots.map((s) => s.src)).toEqual(
      es.screenshots.map((s) => s.src),
    );
    expect(en.results.map((r) => r.value)).toEqual(
      es.results.map((r) => r.value),
    );
    expect(en.video?.youtubeId).toBe(es.video?.youtubeId);
    expect(en.learnings).toHaveLength(es.learnings.length);
  });

  it("falls back to Spanish when no locale is given", () => {
    expect(getCaseStudy("soc-ml")).toBe(es);
  });

  it("returns nothing for an unknown slug", () => {
    expect(getCaseStudy("nope", "en")).toBeUndefined();
  });
});
