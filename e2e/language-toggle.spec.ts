import { test, expect } from "@playwright/test";
import { gotoHydrated, languageOption } from "./helpers";

test.describe("language toggle", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page);
  });

  test("starts in Spanish", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Construyo software",
    );
    await expect(
      page.getByRole("link", { name: "Proyectos", exact: true }),
    ).toBeVisible();
    await expect(languageOption(page, "ES")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("switches the whole page to English", async ({ page }) => {
    await languageOption(page, "EN").click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I build software",
    );
    await expect(
      page.getByRole("link", { name: "Projects", exact: true }),
    ).toBeVisible();
    await expect(languageOption(page, "EN")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("switches back to Spanish", async ({ page }) => {
    await languageOption(page, "EN").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await languageOption(page, "ES").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Construyo software",
    );
  });

  test("remembers the choice after a reload", async ({ page }) => {
    await languageOption(page, "EN").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.reload();

    // The server renders Spanish; the saved language is applied after hydration.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I build software",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("translates the contact form labels", async ({ page }) => {
    await languageOption(page, "EN").click();

    const form = page.getByRole("form", { name: /let's talk/i });
    await expect(form.getByLabel("Name", { exact: true })).toBeVisible();
    await expect(form.getByLabel("Message", { exact: true })).toBeVisible();
    await expect(
      form.getByRole("button", { name: "Send message" }),
    ).toBeVisible();
  });
});
