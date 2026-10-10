import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import Projects from "./Projects";
import { projects } from "@/content/projects";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

function renderProjects(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Projects />
    </NextIntlClientProvider>,
  );
}

const gridCount = projects.filter((p) => p.placement === "grid").length;

describe("Projects", () => {
  it("renders the section label in both locales", () => {
    renderProjects("es");
    expect(screen.getByText("Lo que he construido")).toBeInTheDocument();
  });

  it("shows only grid projects; table ones wait for 'More projects'", () => {
    renderProjects("es");
    expect(screen.getAllByRole("article")).toHaveLength(gridCount);
    expect(
      screen.queryByRole("heading", {
        name: "API REST con Clean Architecture",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the thesis with its status, kind and real metrics", () => {
    renderProjects("es");
    const card = screen
      .getByRole("heading", {
        name: "Priorización de alertas SOC con Machine Learning",
      })
      .closest("article")!;
    expect(within(card).getByText("Completado")).toBeInTheDocument();
    expect(within(card).getByText("2026 · Tesis")).toBeInTheDocument();
    expect(within(card).getByText("98.9%")).toBeInTheDocument();
    expect(within(card).getByText("Recall en maliciosos")).toBeInTheDocument();
    expect(within(card).getByText("119")).toBeInTheDocument();
  });

  it("labels a technical test as such, not as a client project", () => {
    renderProjects("es");
    expect(screen.getByText("2026 · Prueba técnica")).toBeInTheDocument();
  });

  it("links to the thesis repository", () => {
    renderProjects("es");
    const card = screen
      .getByRole("heading", {
        name: "Priorización de alertas SOC con Machine Learning",
      })
      .closest("article")!;
    expect(
      within(card).getByRole("link", { name: /Repositorio/ }),
    ).toHaveAttribute(
      "href",
      "https://github.com/Carlou134/soc-alert-prioritization-ml",
    );
  });

  it("never renders a demo or video button without a real URL", () => {
    renderProjects("es");
    expect(
      screen.queryByRole("link", { name: /Demo en vivo/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Video walkthrough/ }),
    ).not.toBeInTheDocument();
  });

  it("filters by category and announces the count", async () => {
    const user = userEvent.setup();
    renderProjects("es");
    await user.click(screen.getByRole("button", { name: "Frontend" }));

    expect(screen.getByRole("button", { name: "Frontend" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const front = projects.filter(
      (p) => p.placement === "grid" && p.categories.includes("front"),
    );
    expect(screen.getAllByRole("article")).toHaveLength(front.length);
    expect(
      screen.getByText(
        `${front.length} de ${gridCount} proyectos · filtro activo: Frontend`,
      ),
    ).toBeInTheDocument();
  });

  it("renders the English labels", () => {
    renderProjects("en");
    expect(
      screen.getByRole("heading", {
        name: "SOC alert prioritization with Machine Learning",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("2026 · Thesis")).toBeInTheDocument();
  });

  it("shows pending-content notices outside production", () => {
    renderProjects("es");
    expect(screen.getAllByTestId("pending-notice").length).toBeGreaterThan(0);
  });
});
