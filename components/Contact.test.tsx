import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "./Contact";
import { LanguageProvider } from "@/contexts/LanguageContext";

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  message: string,
) {
  await user.type(screen.getByPlaceholderText("Tu nombre"), "Carlos");
  await user.type(
    screen.getByPlaceholderText("tucorreo@ejemplo.com"),
    "carlos@example.com",
  );
  await user.type(
    screen.getByPlaceholderText("Cuéntame del proyecto..."),
    message,
  );
  await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));
}

describe("Contact form", () => {
  beforeEach(() => {
    // Fresh mock every test — no need to unstub, and unstubAllGlobals() would
    // also wipe the IntersectionObserver polyfill from vitest.setup.ts that
    // next/link needs for its viewport-prefetch logic.
    vi.stubGlobal("fetch", vi.fn());
  });

  it("submits to /api/contact and shows a success message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const user = userEvent.setup();
    render(<Contact />, { wrapper: LanguageProvider });
    await fillAndSubmit(user, "Quiero hablar de un proyecto");

    expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"lang":"es"'),
      }),
    );
  });

  it("shows the server error message when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "El mensaje es muy corto." }),
    } as Response);

    const user = userEvent.setup();
    render(<Contact />, { wrapper: LanguageProvider });
    await fillAndSubmit(user, "corto");

    expect(
      await screen.findByText("El mensaje es muy corto."),
    ).toBeInTheDocument();
  });

  it("shows a connection error message when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const user = userEvent.setup();
    render(<Contact />, { wrapper: LanguageProvider });
    await fillAndSubmit(user, "Quiero hablar de un proyecto");

    expect(await screen.findByText(/error de conexión/i)).toBeInTheDocument();
  });

  describe("form submission", () => {
    it("exposes a named form landmark", () => {
      render(<Contact />, { wrapper: LanguageProvider });

      expect(
        screen.getByRole("form", { name: /hablemos/i }),
      ).toBeInTheDocument();
    });

    it("submits when pressing Enter inside a field", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const user = userEvent.setup();
      render(<Contact />, { wrapper: LanguageProvider });
      await user.type(screen.getByLabelText("Nombre"), "Carlos");
      await user.type(
        screen.getByLabelText("Mensaje"),
        "Quiero hablar de algo",
      );
      await user.type(
        screen.getByLabelText("Email"),
        "carlos@example.com{Enter}",
      );

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          body: expect.stringContaining('"email":"carlos@example.com"'),
        }),
      );
      expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument();
    });

    it("does not treat Enter in the textarea as a submit", async () => {
      const user = userEvent.setup();
      render(<Contact />, { wrapper: LanguageProvider });
      await user.type(
        screen.getByLabelText("Mensaje"),
        "línea 1{Enter}línea 2",
      );

      expect(fetch).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Mensaje")).toHaveValue("línea 1\nlínea 2");
    });

    it("prevents the native page navigation on submit", () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);
      render(<Contact />, { wrapper: LanguageProvider });

      const notCanceled = fireEvent.submit(screen.getByRole("form"));

      expect(notCanceled).toBe(false);
    });

    it("blocks a second submit while the request is in flight", async () => {
      vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

      const user = userEvent.setup();
      render(<Contact />, { wrapper: LanguageProvider });
      await user.type(screen.getByLabelText("Nombre"), "Carlos");
      await user.type(
        screen.getByLabelText("Mensaje"),
        "Quiero hablar de algo",
      );
      await user.type(
        screen.getByLabelText("Email"),
        "carlos@example.com{Enter}",
      );
      // Fields are disabled while sending, so a second Enter has no target.
      await user.keyboard("{Enter}");

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("associates every label with its control", () => {
      render(<Contact />, { wrapper: LanguageProvider });

      expect(screen.getByLabelText("Nombre")).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
      expect(screen.getByLabelText("Mensaje").tagName).toBe("TEXTAREA");
    });

    it("focuses the control when its label is clicked", async () => {
      const user = userEvent.setup();
      render(<Contact />, { wrapper: LanguageProvider });

      await user.click(screen.getByText("Nombre"));
      expect(screen.getByLabelText("Nombre")).toHaveFocus();
    });

    it("keeps an empty status region mounted before any submit", () => {
      render(<Contact />, { wrapper: LanguageProvider });

      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toBeEmptyDOMElement();
    });

    it("announces success through the status region", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const user = userEvent.setup();
      render(<Contact />, { wrapper: LanguageProvider });
      await fillAndSubmit(user, "Quiero hablar de un proyecto");

      expect(await screen.findByRole("status")).toHaveTextContent(
        /mensaje enviado/i,
      );
    });

    it("announces failures through an alert region", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "El mensaje es muy corto." }),
      } as Response);

      const user = userEvent.setup();
      render(<Contact />, { wrapper: LanguageProvider });
      await fillAndSubmit(user, "corto");

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "El mensaje es muy corto.",
      );
    });

    it("keeps the alert region mounted but empty when there is no error", () => {
      render(<Contact />, { wrapper: LanguageProvider });

      expect(screen.getByRole("alert")).toBeEmptyDOMElement();
    });
  });
});
