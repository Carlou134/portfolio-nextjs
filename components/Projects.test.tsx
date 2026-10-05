import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import Projects from "./Projects";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// Projects no longer touches LanguageContext post-migration, so only
// NextIntlClientProvider is needed here (matches Hero.test.tsx's pattern).
function renderProjects(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Projects />
    </NextIntlClientProvider>,
  );
}

describe("Projects", () => {
  it("renders the Spanish section label", () => {
    renderProjects("es");
    expect(screen.getByText("Lo que he construido")).toBeInTheDocument();
  });

  it("renders the English section label", () => {
    renderProjects("en");
    expect(screen.getByText("What I've built")).toBeInTheDocument();
  });

  it("renders the featured project's title and badge in Spanish", () => {
    renderProjects("es");
    expect(
      screen.getByRole("heading", {
        name: "Clasificación de alertas con Random Forest",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI & ML")).toBeInTheDocument();
  });

  it("renders the featured project's title in English", () => {
    renderProjects("en");
    expect(
      screen.getByRole("heading", {
        name: "Alert classification with Random Forest",
      }),
    ).toBeInTheDocument();
  });

  it("renders the featured project's metrics", () => {
    renderProjects("es");
    expect(screen.getByText("82.91%")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
    expect(screen.getByText("83.16%")).toBeInTheDocument();
    expect(screen.getByText("F1-Macro")).toBeInTheDocument();
  });

  it("renders the featured project's footer in the active locale", () => {
    renderProjects("es");
    expect(
      screen.getByText(
        "Tesis de grado · UPC · ~33,000 alertas reales de SOC (Lima Metropolitana)",
      ),
    ).toBeInTheDocument();
  });

  it("links to the featured project's GitHub repository", () => {
    renderProjects("es");
    expect(screen.getAllByRole("link", { name: "GitHub" })[0]).toHaveAttribute(
      "href",
      "https://github.com/Carlou134/soc-alert-prioritization-ml",
    );
  });

  it("styles badges with the theme classes their color maps to", () => {
    renderProjects("es");
    expect(screen.getByText("Backend", { selector: "span" })).toHaveClass(
      "badge-accent",
    );
    expect(
      screen.getByText("Backend · Legacy", { selector: "span" }),
    ).toHaveClass("badge-amber");
  });

  it("renders all six projects", () => {
    renderProjects("es");
    expect(
      screen.getByRole("heading", { name: "API REST con Clean Architecture" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sistema de gestión de órdenes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Ecosistema de gestión empresarial",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Interfaz con estado moderno e integración de IA",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Análisis y modernización de sistema legacy",
      }),
    ).toBeInTheDocument();
  });
});
