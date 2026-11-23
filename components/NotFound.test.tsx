import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import NotFound from "./NotFound";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

function renderNotFound(locale: "es" | "en") {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "es" ? esMessages : enMessages}
    >
      <NotFound />
    </NextIntlClientProvider>,
  );
}

describe("NotFound", () => {
  it("says what happened in a heading", () => {
    renderNotFound("es");
    expect(
      screen.getByRole("heading", { level: 1, name: "Esta página no existe." }),
    ).toBeInTheDocument();
  });

  it("offers a way back home and to the projects", () => {
    renderNotFound("es");
    expect(
      screen.getByRole("link", { name: "Volver al inicio" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Ver proyectos" })).toHaveAttribute(
      "href",
      "/#proyectos",
    );
  });

  it("renders in English", () => {
    renderNotFound("en");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "This page doesn't exist.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to home" }),
    ).toBeInTheDocument();
  });
});
