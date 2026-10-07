import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import Hero from "./Hero";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// Hero only needs NextIntlClientProvider — LanguageContext is gone (removed
// in commit 17). Locale is a prop, not global state, so switching it per test
// is just a different render.
function renderHero(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Hero />
    </NextIntlClientProvider>,
  );
}

// Some lines split their text across spans (the availability line puts the
// timezone in a muted span), so plain getByText — which only reads an
// element's own text nodes — can't see them. Match the paragraph's full text.
const paragraph = (text: string) =>
  screen.getByText(
    (_, element) => element?.tagName === "P" && element.textContent === text,
  );

describe("Hero", () => {
  it("renders the Spanish kicker, headline and meta line", () => {
    renderHero("es");

    expect(paragraph("Full Stack Developer · Lima, Perú")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Construyo sistemas C#/.NET y Next.js que llegan a producción y se mantienen ahí.",
      }),
    ).toBeInTheDocument();
    expect(
      paragraph("Disponible para propuestas · UTC−5 · inglés B2"),
    ).toBeInTheDocument();
  });

  it("renders the English kicker, headline and meta line", () => {
    renderHero("en");

    expect(paragraph("Full Stack Developer · Lima, Peru")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build C#/.NET and Next.js systems that reach production and stay there.",
      }),
    ).toBeInTheDocument();
    expect(
      paragraph("Open to offers · UTC−5 · English B2"),
    ).toBeInTheDocument();
  });

  it("shows the name above the kicker", () => {
    renderHero("es");
    expect(screen.getByText("Carlos Vásquez")).toBeInTheDocument();
  });

  it("renders the profile photo with a translated alt text", () => {
    renderHero("en");
    expect(
      screen.getByRole("img", { name: "Profile photo of Carlos Vásquez" }),
    ).toBeInTheDocument();
  });

  it("renders the photo as the hero's only image", () => {
    renderHero("es");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("links the projects CTA to the projects section", () => {
    renderHero("es");
    // The arrow is aria-hidden, so it's not part of the accessible name.
    expect(screen.getByRole("link", { name: "Ver proyectos" })).toHaveAttribute(
      "href",
      "#proyectos",
    );
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

  it("renders the static perfil.sh terminal, translated", () => {
    renderHero("en");

    const terminal = screen.getByRole("figure", { name: "perfil.sh" });
    expect(terminal).toHaveTextContent(
      "Thesis (UPC) · alert detection with machine learning",
    );
    expect(terminal).toHaveTextContent("cat thesis.txt");
    expect(terminal).toHaveTextContent("98.9% recall on malicious alerts");
    expect(terminal).toHaveTextContent("Current work · Zoluxiones");
    expect(terminal).toHaveTextContent("cat now.txt");
    // Only facts found nowhere else in the hero: no location, no availability.
    expect(terminal).not.toHaveTextContent(/lima|open to offers/i);
    // Static: nothing to type into.
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("links to the GitHub profile", () => {
    renderHero("es");

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Carlou134",
    );
  });
});
