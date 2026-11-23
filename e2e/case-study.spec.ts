import { test, expect } from "@playwright/test";
import { gotoHydrated, languageOption } from "./helpers";

const CASE = "/case-study/soc-ml";

// Desktop viewport: the inline nav links are hidden below lg.
test.use({ viewport: { width: 1280, height: 800 } });

test.describe("case study", () => {
  test("opens from the thesis card", async ({ page }) => {
    await gotoHydrated(page);

    await page.getByRole("link", { name: /Ver case study/ }).click();

    await expect(page).toHaveURL(CASE);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Priorización de alertas SOC con Machine Learning",
    );
  });

  test("renders in English after switching language", async ({ page }) => {
    await gotoHydrated(page);
    await languageOption(page, "EN").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // The locale lives in a cookie, so it carries over to the next page.
    await gotoHydrated(page, CASE);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "SOC alert prioritization with Machine Learning",
    );
    await expect(
      page.getByRole("link", { name: /Back to projects/ }),
    ).toBeVisible();
  });

  // Regression: under the fixed header the link received no clicks.
  test("goes back to the projects section", async ({ page }) => {
    await gotoHydrated(page, CASE);

    await page.getByRole("link", { name: /Volver a proyectos/ }).click();

    await expect(page).toHaveURL(/\/#proyectos$/);
    await expect(page.locator("#proyectos")).toBeInViewport();
  });

  // Regression: bare "#id" hrefs pointed at /case-study/soc-ml#id, and a
  // <Link> on "/" then stacked hashes ("/#experiencia#contacto").
  test("navigates to home sections from the navbar, one hash at a time", async ({
    page,
  }) => {
    await gotoHydrated(page, CASE);
    const nav = page.getByRole("navigation");

    await nav.getByRole("link", { name: "Experiencia", exact: true }).click();
    await expect(page).toHaveURL(/\/#experiencia$/);
    await expect(page.locator("#experiencia")).toBeInViewport();

    await nav.getByRole("link", { name: "Contacto", exact: true }).click();
    await expect(page).toHaveURL(/\/#contacto$/);
    expect(new URL(page.url()).hash).toBe("#contacto");
  });

  // Regression: it waited for the hero's CV to scroll away, and this page
  // has no hero, so it never showed.
  test("shows the header CV button", async ({ page }) => {
    await gotoHydrated(page, CASE);

    await expect(
      page.getByRole("link", { name: "Descargar CV (PDF)" }),
    ).toBeVisible();
  });
});

test.describe("not found", () => {
  test("answers 404 with the site's shell and a way home", async ({ page }) => {
    const response = await page.goto("/no-existe");
    expect(response?.status()).toBe(404);
    await page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Esta página no existe.",
    );
    await expect(page).toHaveTitle(/Esta página no existe/);
    await expect(page.getByRole("navigation")).toBeVisible();

    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Construyo sistemas",
    );
  });

  test("covers an unknown case study slug too", async ({ page }) => {
    const response = await page.goto("/case-study/nope");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Esta página no existe.",
    );
  });
});
