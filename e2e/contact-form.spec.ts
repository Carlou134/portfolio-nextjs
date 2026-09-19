import { test, expect } from "@playwright/test";
import {
  contactForm,
  fillContactForm,
  gotoHydrated,
  mockContactApi,
} from "./helpers";

const valid = {
  name: "Carlos",
  email: "carlos@example.com",
  message: "Quiero hablar de un proyecto",
};

test.describe("contact form", () => {
  test("sends the message and confirms it", async ({ page }) => {
    const requests = await mockContactApi(page);
    await gotoHydrated(page);
    await fillContactForm(page, valid);

    await contactForm(page)
      .getByRole("button", { name: "Enviar mensaje" })
      .click();

    await expect(contactForm(page).getByRole("status")).toContainText(
      "Mensaje enviado",
    );
    expect(requests).toEqual([{ ...valid, lang: "es" }]);
    await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("");
  });

  test("submits with Enter and stays on the page", async ({ page }) => {
    const requests = await mockContactApi(page);
    await gotoHydrated(page);
    await fillContactForm(page, valid);

    await page.getByLabel("Email", { exact: true }).press("Enter");

    await expect(contactForm(page).getByRole("status")).toContainText(
      "Mensaje enviado",
    );
    expect(requests).toHaveLength(1);
    // A native GET submit would have navigated to "/?" — the handler must stop it.
    expect(new URL(page.url()).search).toBe("");
  });

  test("shows the server error and keeps what was typed", async ({ page }) => {
    const requests = await mockContactApi(page, {
      kind: "json",
      status: 400,
      body: { error: "El mensaje es muy corto." },
    });
    await gotoHydrated(page);
    await fillContactForm(page, { ...valid, message: "corto" });

    await contactForm(page)
      .getByRole("button", { name: "Enviar mensaje" })
      .click();

    await expect(contactForm(page).getByRole("alert")).toContainText(
      "El mensaje es muy corto.",
    );
    expect(requests).toHaveLength(1);
    await expect(page.getByLabel("Mensaje", { exact: true })).toHaveValue(
      "corto",
    );
    // The button is back, so the visitor can fix the text and retry.
    await expect(
      contactForm(page).getByRole("button", { name: "Enviar mensaje" }),
    ).toBeEnabled();
  });

  test("shows a connection error when the request fails", async ({ page }) => {
    await mockContactApi(page, { kind: "abort" });
    await gotoHydrated(page);
    await fillContactForm(page, valid);

    await contactForm(page)
      .getByRole("button", { name: "Enviar mensaje" })
      .click();

    await expect(contactForm(page).getByRole("alert")).toContainText(
      "Error de conexión",
    );
  });

  test("sends the English language flag after toggling", async ({ page }) => {
    const requests = await mockContactApi(page);
    await gotoHydrated(page);
    await page.getByRole("button", { name: /switch language/i }).click();

    await fillContactForm(page, valid, {
      name: "Name",
      email: "Email",
      message: "Message",
    });
    await contactForm(page)
      .getByRole("button", { name: "Send message" })
      .click();

    await expect(contactForm(page).getByRole("status")).toContainText(
      "Message sent",
    );
    expect(requests).toEqual([{ ...valid, lang: "en" }]);
  });
});
