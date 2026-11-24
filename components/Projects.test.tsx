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
        name: "API de tareas y usuarios",
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
    expect(within(card).getByText("−40.5%")).toBeInTheDocument();
    expect(
      within(card).getByText("Tiempo de revisión (12 analistas)"),
    ).toBeInTheDocument();
  });

  it("labels a technical test as such, not as a client project", () => {
    renderProjects("es");
    for (const title of [
      "Integración TMS-OMS en tiempo real",
      "Gestión de órdenes de compra",
    ]) {
      const card = screen
        .getByRole("heading", { name: title })
        .closest("article")!;
      expect(
        within(card).getByText("2026 · Prueba técnica"),
      ).toBeInTheDocument();
    }
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

  it("never renders a demo button without a real URL", () => {
    renderProjects("es");
    expect(
      screen.queryByRole("link", { name: /Demo en vivo/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the video button only on the project that has a video", () => {
    renderProjects("es");
    const videos = screen.getAllByRole("link", { name: /Video demo/ });
    expect(videos).toHaveLength(1);
    expect(videos[0]).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=XbaL3qdgyqY",
    );
    expect(videos[0].closest("article")!.querySelector("h3")).toHaveTextContent(
      "Priorización de alertas SOC con Machine Learning",
    );
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

  it("shows one pending notice per grid project with something pending", () => {
    renderProjects("es");
    const withPending = projects.filter(
      (p) => p.placement === "grid" && (p.pending?.length ?? 0) > 0,
    ).length;
    expect(screen.queryAllByTestId("pending-notice")).toHaveLength(withPending);
  });

  it("draws no pending notice on a card with nothing pending", () => {
    renderProjects("es");
    const card = screen
      .getByRole("heading", { name: "Integración TMS-OMS en tiempo real" })
      .closest("article")!;
    expect(
      within(card).queryByTestId("pending-notice"),
    ).not.toBeInTheDocument();
  });

  it("links the thesis card to its published case study", () => {
    renderProjects("es");
    const card = screen
      .getByRole("heading", {
        name: "Priorización de alertas SOC con Machine Learning",
      })
      .closest("article")!;
    expect(
      within(card).getByRole("link", { name: /Ver case study/ }),
    ).toHaveAttribute("href", "/case-study/soc-ml");
  });
});
