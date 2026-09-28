import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import Hero from "./Hero";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// Hero (and the Terminal it renders) only need NextIntlClientProvider —
// LanguageContext is gone (removed in commit 17). Locale is a prop, not
// global state, so switching it per test is just a different render.
function renderHero(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Hero />
    </NextIntlClientProvider>,
  );
}

describe("Hero", () => {
  it("renders the Spanish headline, tagline and badge", () => {
    renderHero("es");

    expect(
      screen.getByRole("heading", { level: 1, name: /construyo software/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Carlos Vásquez · Fullstack Developer · Lima, Perú"),
    ).toBeInTheDocument();
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("renders the English headline, tagline and badge", () => {
    renderHero("en");

    expect(
      screen.getByRole("heading", { level: 1, name: /i build software/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Carlos Vásquez · Fullstack Developer · Lima, Peru"),
    ).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("points the CV download link at the Spanish PDF in es", () => {
    renderHero("es");

    expect(screen.getByRole("link", { name: "Descargar CV" })).toHaveAttribute(
      "href",
      "/Carlos_Vasquez_Desarrollador_Fullstack_CV.pdf",
    );
  });

  it("points the CV download link at the English PDF in en", () => {
    renderHero("en");

    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "href",
      "/CV_Carlos_Vasquez_Fullstack_Developer_EN.pdf",
    );
  });

  it("links to the GitHub profile", () => {
    renderHero("es");

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Carlou134",
    );
  });

  it("scrolls to the projects section when its CTA is clicked", async () => {
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    scrollIntoView.mockClear();
    document.body.insertAdjacentHTML("beforeend", '<div id="proyectos"></div>');

    const user = userEvent.setup();
    renderHero("es");
    await user.click(screen.getByRole("button", { name: "Ver proyectos" }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("renders the Terminal alongside it, translated in the same locale", () => {
    renderHero("en");
    expect(screen.getByLabelText("terminal input")).toBeInTheDocument();
    expect(screen.getByText("Type 'help' to get started.")).toBeInTheDocument();
  });
});
