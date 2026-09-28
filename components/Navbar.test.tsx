import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "./Navbar";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";

const setLocaleMock = vi.fn();
vi.mock("@/i18n/actions", () => ({
  setLocale: (...args: unknown[]) => setLocaleMock(...args),
}));

// Navbar no longer touches LanguageContext post-migration (removed in commit
// 17), so only NextIntlClientProvider is needed here. Locale is a prop, not
// global state, so switching it per test is just a different render.
function renderNavbar(locale: "es" | "en" = "es") {
  const messages = locale === "es" ? esMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
    </NextIntlClientProvider>,
  );
}

describe("Navbar", () => {
  it("renders the desktop nav links", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "Proyectos" })).toBeInTheDocument();
  });

  it("opens the mobile menu on hamburger click and closes it when a link is clicked", async () => {
    const user = userEvent.setup();
    renderNavbar();

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
    // Post-migration, the EN/ES indicator, the nav links, and the "Disponible"
    // badge are all driven by next-intl, whose locale is resolved server-side
    // from a cookie (see i18n/request.ts). A unit test renders once with a
    // fixed locale and no real Next.js server, so it cannot observe a click
    // actually flipping that locale — there's nothing here to re-run the
    // server and hand down new messages. The full flip is verified for real,
    // against a real server, in e2e/language-toggle.spec.ts.
    //
    // What a unit test CAN still verify: the indicator matches whatever
    // locale it was rendered with, and clicking it calls the next-intl
    // Server Action with the correct next locale.
    beforeEach(() => {
      setLocaleMock.mockClear();
    });

    it("shows EN when rendered in Spanish", () => {
      renderNavbar("es");
      expect(
        screen.getByRole("button", { name: /switch language/i }),
      ).toHaveTextContent("EN");
    });

    it("shows ES when rendered in English", () => {
      renderNavbar("en");
      expect(
        screen.getByRole("button", { name: /switch language/i }),
      ).toHaveTextContent("ES");
    });

    it("calls setLocale with 'en' when toggled from Spanish", async () => {
      const user = userEvent.setup();
      renderNavbar("es");

      await user.click(
        screen.getByRole("button", { name: /switch language/i }),
      );

      expect(setLocaleMock).toHaveBeenCalledExactlyOnceWith("en");
    });

    it("calls setLocale with 'es' when toggled from English", async () => {
      const user = userEvent.setup();
      renderNavbar("en");

      await user.click(
        screen.getByRole("button", { name: /switch language/i }),
      );

      expect(setLocaleMock).toHaveBeenCalledExactlyOnceWith("es");
    });
  });
});
