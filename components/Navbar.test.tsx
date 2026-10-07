import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
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
  it("renders the desktop nav links in page order", () => {
    renderNavbar();
    const links = within(screen.getAllByRole("list")[0])
      .getAllByRole("link")
      .map((link) => link.textContent);
    expect(links).toEqual([
      "Sobre mí",
      "Stack",
      "Proyectos",
      "Experiencia",
      "Contacto",
    ]);
  });

  it("no longer shows the availability badge", () => {
    renderNavbar();
    expect(screen.queryByText("Disponible")).not.toBeInTheDocument();
  });

  it("links the CV for the current locale", () => {
    renderNavbar("en");
    expect(
      screen.getByRole("link", { name: "Download CV (PDF)" }),
    ).toHaveAttribute("href", "/CV_Carlos_Vasquez_Fullstack_Developer_EN.pdf");
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

  describe("active-section indicator", () => {
    // The global IntersectionObserver mock in vitest.setup.ts never fires.
    // Here we keep the callback so a test can say "this section is now in
    // the middle of the viewport".
    let fire: (target: Element, isIntersecting: boolean) => void;
    const sections: HTMLElement[] = [];
    // Restored by hand: vi.unstubAllGlobals() would also wipe the setup-file
    // mock, and every later test that renders Navbar needs it.
    const setupObserver = globalThis.IntersectionObserver;

    beforeEach(() => {
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor(callback: IntersectionObserverCallback) {
            fire = (target, isIntersecting) =>
              callback(
                [{ target, isIntersecting } as IntersectionObserverEntry],
                this as unknown as IntersectionObserver,
              );
          }
          observe = vi.fn();
          disconnect = vi.fn();
        },
      );
      for (const id of ["sobre-mi", "proyectos"]) {
        const section = document.createElement("section");
        section.id = id;
        document.body.append(section);
        sections.push(section);
      }
    });

    afterEach(() => {
      sections.splice(0).forEach((section) => section.remove());
      vi.stubGlobal("IntersectionObserver", setupObserver);
    });

    it("marks the link of the section in view as the current location", () => {
      renderNavbar();
      const projects = screen.getByRole("link", { name: "Proyectos" });
      expect(projects).not.toHaveAttribute("aria-current");

      act(() => fire(sections[1], true));

      expect(projects).toHaveAttribute("aria-current", "location");
      expect(
        screen.getByRole("link", { name: "Sobre mí" }),
      ).not.toHaveAttribute("aria-current");
    });

    it("clears it when that section leaves the viewport", () => {
      renderNavbar();
      act(() => fire(sections[1], true));
      act(() => fire(sections[1], false));

      expect(
        screen.getByRole("link", { name: "Proyectos" }),
      ).not.toHaveAttribute("aria-current");
    });
  });

  describe("CV button while the hero's is on screen", () => {
    let fire: (isIntersecting: boolean) => void;
    let heroCv: Element;
    const setupObserver = globalThis.IntersectionObserver;
    const headerCv = () =>
      screen.getByRole("link", { name: "Descargar CV (PDF)" });

    beforeEach(() => {
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor(callback: IntersectionObserverCallback) {
            // Only the hero-CV observer matters here; the section observer
            // has no sections to watch in this block.
            fire = (isIntersecting) =>
              callback(
                [
                  {
                    target: heroCv,
                    isIntersecting,
                  } as IntersectionObserverEntry,
                ],
                this as unknown as IntersectionObserver,
              );
          }
          observe = vi.fn();
          disconnect = vi.fn();
        },
      );
      heroCv = document.createElement("a");
      heroCv.id = "hero-cv";
      document.body.append(heroCv);
    });

    afterEach(() => {
      heroCv.remove();
      vi.stubGlobal("IntersectionObserver", setupObserver);
    });

    it("hides the header CV while the hero's CV is in view", () => {
      renderNavbar();
      act(() => fire(true));
      expect(headerCv()).toHaveClass("invisible");
    });

    it("shows it once the hero's CV scrolls away", () => {
      renderNavbar();
      act(() => fire(true));
      act(() => fire(false));
      expect(headerCv()).not.toHaveClass("invisible");
    });
  });

  describe("language segmented control", () => {
    // Post-migration, the locale is resolved server-side from a cookie (see
    // i18n/request.ts). A unit test renders once with a fixed locale and no
    // real Next.js server, so it cannot observe a click actually flipping
    // the page — that's verified for real in e2e/language-toggle.spec.ts.
    //
    // What a unit test CAN verify: the pressed button matches the locale it
    // was rendered with, and clicking the other one calls the next-intl
    // Server Action with that locale.
    const option = (name: "ES" | "EN") =>
      within(screen.getByRole("group", { name: /idioma|language/i })).getByRole(
        "button",
        { name },
      );

    beforeEach(() => {
      setLocaleMock.mockClear();
    });

    it("presses ES when rendered in Spanish", () => {
      renderNavbar("es");
      expect(option("ES")).toHaveAttribute("aria-pressed", "true");
      expect(option("EN")).toHaveAttribute("aria-pressed", "false");
    });

    it("presses EN when rendered in English", () => {
      renderNavbar("en");
      expect(option("EN")).toHaveAttribute("aria-pressed", "true");
      expect(option("ES")).toHaveAttribute("aria-pressed", "false");
    });

    it("calls setLocale with 'en' when EN is clicked from Spanish", async () => {
      const user = userEvent.setup();
      renderNavbar("es");

      await user.click(option("EN"));

      expect(setLocaleMock).toHaveBeenCalledExactlyOnceWith("en");
    });

    it("calls setLocale with 'es' when ES is clicked from English", async () => {
      const user = userEvent.setup();
      renderNavbar("en");

      await user.click(option("ES"));

      expect(setLocaleMock).toHaveBeenCalledExactlyOnceWith("es");
    });

    it("does nothing when the already-active language is clicked", async () => {
      const user = userEvent.setup();
      renderNavbar("es");

      await user.click(option("ES"));

      expect(setLocaleMock).not.toHaveBeenCalled();
    });
  });
});
