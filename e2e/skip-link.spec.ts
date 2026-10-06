import { test, expect } from "@playwright/test";
import { gotoHydrated } from "./helpers";

test.describe("skip link", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page);
  });

  test("is the first Tab stop and moves focus to main", async ({ page }) => {
    const skipLink = page.getByRole("link", { name: "Saltar al contenido" });

    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });
});
