import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { render } from "@testing-library/react";
import Stack from "./Stack";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

// Stack no longer touches LanguageContext post-migration, so only
// NextIntlClientProvider is needed here (matches Hero/Projects tests).
function renderStack(locale: "es" | "en") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Stack />
    </NextIntlClientProvider>,
  );
}

describe("Stack", () => {
  it("renders the Spanish section label", () => {
    renderStack("es");
    expect(screen.getByText("Con qué trabajo")).toBeInTheDocument();
  });

  it("renders the English section label", () => {
    renderStack("en");
    expect(screen.getByText("What I work with")).toBeInTheDocument();
  });

  it("groups the stack into five layers, in mockup order", () => {
    renderStack("es");
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      "01Frontend",
      "02Backend",
      "03Datos",
      "04DevOps / Cloud",
      "05IA",
    ]);
  });

  it("translates the Data and AI layer names", () => {
    renderStack("en");
    expect(
      screen.getByRole("heading", { level: 3, name: /Data$/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /AI$/ }),
    ).toBeInTheDocument();
  });

  it("renders text-only tags, without brand icons", () => {
    const { container } = renderStack("es");
    expect(screen.getByText("C# / .NET")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("SHAP")).toBeInTheDocument();
    expect(container.querySelector("section#stack svg")).toBeNull();
  });

  it("highlights only the daily core with the accent tag", () => {
    const { container } = renderStack("es");
    const accented = [...container.querySelectorAll(".tag-accent")].map(
      (el) => el.textContent,
    );
    expect(accented).toEqual([
      "React 19",
      "Next.js",
      "C# / .NET",
      "Kotlin / Ktor",
    ]);
  });
});
