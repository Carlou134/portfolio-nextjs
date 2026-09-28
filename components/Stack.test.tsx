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

  it("renders each category and a sample of its items", () => {
    renderStack("es");
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText(".NET Core")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("DevOps & ML")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });
});
