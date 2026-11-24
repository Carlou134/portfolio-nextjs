import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import MoreProjects from "./MoreProjects";
import { projects } from "@/content/projects";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

function renderMore(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <MoreProjects />
    </NextIntlClientProvider>,
  );
}

const tableRows = projects.filter((p) => p.placement === "table");

function rowOf(title: string) {
  return screen.getByRole("heading", { name: title }).closest("li")!;
}

describe("MoreProjects", () => {
  it("renders the section label in both locales", () => {
    renderMore("es");
    expect(screen.getByText("Más proyectos")).toBeInTheDocument();
  });

  it("lists every table project and no grid project", () => {
    renderMore("es");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      tableRows.length,
    );
    expect(
      screen.queryByRole("heading", {
        name: "Priorización de alertas SOC con Machine Learning",
      }),
    ).not.toBeInTheDocument();
  });

  it("orders rows newest first", () => {
    renderMore("es");
    const years = screen
      .getAllByText(/^\d{4} · /)
      .map((el) => Number(el.textContent!.slice(0, 4)));
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it("labels the technical test as such", () => {
    renderMore("es");
    expect(
      within(rowOf("Task Manager")).getByText("2026 · Prueba técnica"),
    ).toBeInTheDocument();
  });

  it("names each repo link after its project and side", () => {
    renderMore("es");
    expect(
      within(rowOf("Task Manager")).getByRole("link", {
        name: "Task Manager: Frontend",
      }),
    ).toHaveAttribute(
      "href",
      "https://github.com/Carlou134/TaskManagerFrontend",
    );
    expect(
      screen.getByRole("link", {
        name: "API de tareas y usuarios: Repositorio",
      }),
    ).toHaveAttribute("href", "https://github.com/Carlou134/webapi");
  });

  it("never ships placeholder text", () => {
    for (const p of tableRows) {
      expect(p.description.es).not.toMatch(/Pendiente/);
      expect(p.stack).not.toContain("Pendiente");
      expect(p.repos.length).toBeGreaterThan(0);
    }
  });

  it("renders the English copy", () => {
    renderMore("en");
    expect(screen.getByText("More projects")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Tasks and users API" }),
    ).toBeInTheDocument();
  });
});
