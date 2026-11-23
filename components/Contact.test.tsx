import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import Contact from "./Contact";
import esMessages from "@/messages/es.json";

// Contact no longer touches LanguageContext post-migration, so only
// NextIntlClientProvider is needed here (matches Hero/Projects/Stack tests).
// Every existing test exercises the Spanish copy, so locale is fixed to "es".
function renderContact() {
  return render(
    <NextIntlClientProvider locale="es" messages={esMessages}>
      <Contact />
    </NextIntlClientProvider>,
  );
}

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  message: string,
) {
  await user.type(screen.getByPlaceholderText("Tu nombre"), "Carlos");
  await user.type(
    screen.getByPlaceholderText("tucorreo@ejemplo.com"),
    "carlos@example.com",
  );
  await user.type(screen.getByLabelText("Mensaje"), message);
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
    renderContact();
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
      json: async () => ({ error: "Error al enviar el mensaje." }),
    } as Response);

    const user = userEvent.setup();
    renderContact();
    await fillAndSubmit(user, "Quiero hablar de un proyecto");

    expect(
      await screen.findByText("Error al enviar el mensaje."),
    ).toBeInTheDocument();
  });

  it("shows a connection error message when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const user = userEvent.setup();
    renderContact();
    await fillAndSubmit(user, "Quiero hablar de un proyecto");

    expect(await screen.findByText(/error de conexión/i)).toBeInTheDocument();
  });

  describe("form submission", () => {
    it("exposes a named form landmark", () => {
      renderContact();

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
      renderContact();
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
      renderContact();
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
      renderContact();

      const notCanceled = fireEvent.submit(screen.getByRole("form"));

      expect(notCanceled).toBe(false);
    });

    it("blocks a second submit while the request is in flight", async () => {
      vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

      const user = userEvent.setup();
      renderContact();
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
      renderContact();

      expect(screen.getByLabelText("Nombre")).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
      expect(screen.getByLabelText("Mensaje").tagName).toBe("TEXTAREA");
    });

    it("focuses the control when its label is clicked", async () => {
      const user = userEvent.setup();
      renderContact();

      await user.click(screen.getByText("Nombre"));
      expect(screen.getByLabelText("Nombre")).toHaveFocus();
    });

    it("keeps an empty status region mounted before any submit", () => {
      renderContact();

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
      renderContact();
      await fillAndSubmit(user, "Quiero hablar de un proyecto");

      expect(await screen.findByRole("status")).toHaveTextContent(
        /mensaje enviado/i,
      );
    });

    it("announces failures through an alert region", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Error al enviar el mensaje." }),
      } as Response);

      const user = userEvent.setup();
      renderContact();
      await fillAndSubmit(user, "Quiero hablar de un proyecto");

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Error al enviar el mensaje.",
      );
    });

    it("keeps the alert region mounted but empty when there is no error", () => {
      renderContact();

      expect(screen.getByRole("alert")).toBeEmptyDOMElement();
    });
  });

  describe("field validation", () => {
    const submit = (user: ReturnType<typeof userEvent.setup>) =>
      user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    it("flags each empty field under itself and sends nothing", async () => {
      const user = userEvent.setup();
      renderContact();
      await submit(user);

      expect(fetch).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Nombre")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByLabelText("Nombre")).toHaveAccessibleDescription(
        "Escribe tu nombre.",
      );
      expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
        "Escribe tu email.",
      );
      expect(screen.getByLabelText("Mensaje")).toHaveAccessibleDescription(
        "Escribe tu mensaje.",
      );
      expect(screen.getByRole("alert")).toBeEmptyDOMElement();
    });

    it("moves focus to the first invalid field", async () => {
      const user = userEvent.setup();
      renderContact();
      await user.type(screen.getByLabelText("Nombre"), "Carlos");
      await submit(user);

      expect(screen.getByLabelText("Email")).toHaveFocus();
    });

    it("says what is wrong with a malformed email and a short message", async () => {
      const user = userEvent.setup();
      renderContact();
      await user.type(screen.getByLabelText("Nombre"), "Carlos");
      await user.type(screen.getByLabelText("Email"), "carlos@");
      await user.type(screen.getByLabelText("Mensaje"), "Hola");
      await submit(user);

      expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
        /nombre@dominio\.com/,
      );
      expect(screen.getByLabelText("Mensaje")).toHaveAccessibleDescription(
        "El mensaje necesita al menos 10 caracteres (llevas 4).",
      );
    });

    it("clears an error as soon as the field is fixed", async () => {
      const user = userEvent.setup();
      renderContact();
      await submit(user);
      await user.type(screen.getByLabelText("Nombre"), "C");

      expect(screen.getByLabelText("Nombre")).not.toHaveAttribute(
        "aria-invalid",
      );
      expect(screen.queryByText("Escribe tu nombre.")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("shows no field errors before the first submit", async () => {
      const user = userEvent.setup();
      renderContact();
      await user.type(screen.getByLabelText("Email"), "carlos@");

      expect(screen.getByLabelText("Email")).not.toHaveAttribute(
        "aria-invalid",
      );
      expect(screen.getByLabelText("Mensaje")).toHaveAccessibleDescription(
        "Mínimo 10 caracteres.",
      );
    });
  });

  describe("intent", () => {
    it("starts on a job offer and sends the chosen intent", async () => {
      vi.mocked(fetch).mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
      const user = userEvent.setup();
      renderContact();

      expect(
        screen.getByRole("radio", { name: "Oferta laboral" }),
      ).toBeChecked();
      await user.click(screen.getByRole("radio", { name: "Freelance" }));
      await fillAndSubmit(user, "Quiero hablar de un proyecto");

      expect(fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          body: expect.stringContaining('"intent":"freelance"'),
        }),
      );
    });

    it("groups the options under a labelled radio group", () => {
      renderContact();
      expect(screen.getByRole("group", { name: "Motivo" })).toBeInTheDocument();
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });
  });

  describe("copy email", () => {
    it("copies the address and announces it", async () => {
      const user = userEvent.setup();
      renderContact();
      await user.click(screen.getByRole("button", { name: "Copiar email" }));

      expect(await navigator.clipboard.readText()).toBe(
        "carlouvasquez134@gmail.com",
      );
      expect(screen.getByText("¡Copiado!")).toBeInTheDocument();
    });

    it("keeps the address visible as a mailto link", () => {
      renderContact();
      expect(
        screen.getByRole("link", { name: "carlouvasquez134@gmail.com" }),
      ).toHaveAttribute("href", "mailto:carlouvasquez134@gmail.com");
    });
  });

  describe("required fields", () => {
    it("says up front that every field is required", () => {
      renderContact();
      expect(
        screen.getByText("Todos los campos son obligatorios."),
      ).toBeInTheDocument();
    });

    it("marks each text field as required for assistive tech", () => {
      renderContact();
      for (const label of ["Nombre", "Email", "Mensaje"]) {
        expect(screen.getByLabelText(label)).toBeRequired();
      }
    });

    it("announces the message minimum before submitting", () => {
      renderContact();
      expect(screen.getByLabelText("Mensaje")).toHaveAccessibleDescription(
        "Mínimo 10 caracteres.",
      );
    });
  });
});
