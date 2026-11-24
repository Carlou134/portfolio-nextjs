import { test, expect } from "@playwright/test";
import { gotoHydrated } from "./helpers";

test.describe("projects filter", () => {
  test("filters the grid and announces the count it shows", async ({
    page,
  }) => {
    await gotoHydrated(page);
    const section = page.locator("#proyectos");
    const filters = section.getByRole("group", { name: /filtr/i });
    const cards = section.getByRole("article");
    const total = await cards.count();

    await filters.getByRole("button", { name: "Frontend" }).click();

    await expect(
      filters.getByRole("button", { name: "Frontend" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      filters.getByRole("button", { name: "Todos" }),
    ).toHaveAttribute("aria-pressed", "false");

    // The live count must match what is actually on screen.
    const count = section.getByText(
      /de \d+ proyectos · filtro activo: Frontend/,
    );
    await expect(count).toBeVisible();
    const shown = Number((await count.textContent())!.match(/^(\d+)/)![1]);
    await expect(cards).toHaveCount(shown);
    expect(shown).toBeLessThan(total);

    await filters.getByRole("button", { name: "Todos" }).click();
    await expect(cards).toHaveCount(total);
  });
});
