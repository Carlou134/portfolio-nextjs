import { test, expect } from "@playwright/test";
import { gotoHydrated } from "./helpers";

// Desktop viewport: the inline nav links are hidden below md.
test.use({ viewport: { width: 1280, height: 800 } });

test.describe("navbar", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page);
  });

  test("marks no section as current over the hero", async ({ page }) => {
    await expect(
      page.getByRole("navigation").locator("[aria-current]"),
    ).toHaveCount(0);
  });

  test("marks the section scrolled into view as current", async ({ page }) => {
    const nav = page.getByRole("navigation");

    await nav.getByRole("link", { name: "Proyectos", exact: true }).click();

    await expect(
      nav.getByRole("link", { name: "Proyectos", exact: true }),
    ).toHaveAttribute("aria-current", "location");
    await expect(nav.locator("[aria-current]")).toHaveCount(1);
  });
});
