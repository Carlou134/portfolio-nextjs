import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { renderWithProviders } from "@/test/render";

const setLocaleMock = vi.fn();
vi.mock("@/i18n/actions", () => ({
  setLocale: (...args: unknown[]) => setLocaleMock(...args),
}));

describe("Navbar", () => {
  it("renders the desktop nav links", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole("link", { name: "Proyectos" })).toBeInTheDocument();
  });

  it("opens the mobile menu on hamburger click and closes it when a link is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    // Only the desktop link exists before the mobile menu is opened.
    expect(screen.getAllByRole("link", { name: "Proyectos" })).toHaveLength(1);

    const toggle = screen.getByRole("button", { name: /abrir menú/i });
    await user.click(toggle);

    expect(screen.getAllByRole("link", { name: "Proyectos" })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /cerrar menú/i }),
    ).toHaveAttribute("aria-expanded", "true");

    const contactoLinks = screen.getAllByRole("link", { name: "Contacto" });
    await user.click(contactoLinks[contactoLinks.length - 1]);

    expect(screen.getAllByRole("link", { name: "Proyectos" })).toHaveLength(1);
  });

  describe("language toggle", () => {
    // Post-migration, the nav link labels and the "Disponible" badge are
    // driven by next-intl, whose locale is resolved server-side from a
    // cookie (see i18n/request.ts). A unit test renders once with a fixed
    // locale and no real Next.js server, so it cannot observe that text
    // flipping the way the old, 100%-client-side LanguageContext allowed —
    // there's nothing here to re-run the server and hand down new messages.
    // The full flip (nav links included) is verified for real, against a
    // real server, in e2e/language-toggle.spec.ts.
    //
    // What a unit test CAN still verify: clicking the button (a) flips the
    // legacy EN/ES indicator instantly, since that one small bit of text is
    // deliberately still read straight from LanguageContext, and (b) calls
    // the next-intl Server Action with the right next locale, which is the
    // other half of what the button is now responsible for doing.
    beforeEach(() => {
      setLocaleMock.mockClear();
    });

    it("flips the EN/ES indicator instantly via LanguageContext", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Navbar />);

      const languageButton = screen.getByRole("button", {
        name: /switch language/i,
      });
      expect(languageButton).toHaveTextContent("EN");

      await user.click(languageButton);

      expect(languageButton).toHaveTextContent("ES");
    });

    it("calls the next-intl setLocale action with the next locale", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Navbar />);

      await user.click(
        screen.getByRole("button", { name: /switch language/i }),
      );

      expect(setLocaleMock).toHaveBeenCalledExactlyOnceWith("en");
    });
  });
});
