import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import Terminal from "./Terminal";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

function renderTerminal(locale: "es" | "en" = "es") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Terminal />
    </NextIntlClientProvider>,
  );
}

async function runCommand(
  user: ReturnType<typeof userEvent.setup>,
  command: string,
) {
  await user.type(screen.getByLabelText("terminal input"), `${command}{Enter}`);
}

describe("Terminal", () => {
  it("shows the Spanish welcome line and prompt", () => {
    renderTerminal("es");
    expect(
      screen.getByText("Escribí 'help' para empezar."),
    ).toBeInTheDocument();
    expect(screen.getByText("visitante@cfvasquez:~")).toBeInTheDocument();
  });

  it("shows the English welcome line and prompt", () => {
    renderTerminal("en");
    expect(screen.getByText("Type 'help' to get started.")).toBeInTheDocument();
    expect(screen.getByText("visitor@cfvasquez:~")).toBeInTheDocument();
  });

  it("prints the whoami output in the current locale", async () => {
    const user = userEvent.setup();
    renderTerminal("en");
    await runCommand(user, "whoami");

    expect(
      screen.getByText(
        "Carlos Vásquez — Fullstack Developer. .NET · React · Next.js · Applied AI.",
      ),
    ).toBeInTheDocument();
  });

  it("interpolates the typed command into the ICU notFound message", async () => {
    const user = userEvent.setup();
    renderTerminal("es");
    await runCommand(user, "wrongcmd");

    // Confirms next-intl's ICU parser treats a bare apostrophe as literal
    // text (verified against the actual installed formatter before writing
    // this) rather than opening a quoted-literal escape section — otherwise
    // this would render "escribí help" with the quote marks silently dropped.
    expect(
      screen.getByText("command not found: wrongcmd (escribí 'help')"),
    ).toBeInTheDocument();
  });

  it("interpolates the command into the English notFound message too", async () => {
    const user = userEvent.setup();
    renderTerminal("en");
    await runCommand(user, "wrongcmd");

    expect(
      screen.getByText("command not found: wrongcmd ('help' for a list)"),
    ).toBeInTheDocument();
  });

  it("clears the screen on the clear command", async () => {
    const user = userEvent.setup();
    renderTerminal("es");
    await runCommand(user, "whoami");
    expect(screen.getByText(/fullstack developer/i)).toBeInTheDocument();

    await runCommand(user, "clear");

    expect(screen.queryByText(/fullstack developer/i)).not.toBeInTheDocument();
  });

  it("scrolls to the matching section for an English or Spanish alias", async () => {
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="proyectos"></div><div id="stack"></div>',
    );
    scrollIntoView.mockClear();

    const user = userEvent.setup();
    renderTerminal("es");
    await runCommand(user, "projects");
    await runCommand(user, "stack");

    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });
});
