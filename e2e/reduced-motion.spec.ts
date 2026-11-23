import { test, expect, type Page } from "@playwright/test";
import es from "../messages/es.json";

// The first fadeUp element in the Hero. Read from the messages so a copy
// change can not silently break the selector (the kicker this used to target
// stopped being animated when the Hero was redesigned).
const ANIMATED_TEXT = es.Hero.subtitle;

declare global {
  interface Window {
    __opacityWhenSettled?: number;
  }
}

/**
 * The Hero subtitle fades in (opacity) while sliding up (transform). Normally
 * both finish together, so the transform only settles once opacity is 1.
 * With reduced motion, framer snaps the transform and keeps the fade, so the
 * transform settles while the element is still fading in.
 *
 * Sampling runs every frame from inside the page, so the result doesn't
 * depend on how fast the test process polls.
 */
async function opacityWhenTransformSettles(page: Page) {
  await page.addInitScript((text) => {
    const sample = () => {
      const el = [...document.querySelectorAll("p")].find(
        (p) => p.textContent === text,
      );
      if (
        el &&
        el.style.opacity !== "" &&
        getComputedStyle(el).transform === "none"
      ) {
        window.__opacityWhenSettled = Number(getComputedStyle(el).opacity);
        return;
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }, ANIMATED_TEXT);

  await page.goto("/");
  await page.waitForFunction(() => window.__opacityWhenSettled !== undefined);
  return page.evaluate(() => window.__opacityWhenSettled!);
}

test.describe("reduced motion", () => {
  test("snaps movement but keeps the fade when the OS asks for it", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    expect(await opacityWhenTransformSettles(page)).toBeLessThan(1);
  });

  test("animates movement normally otherwise", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });

    expect(await opacityWhenTransformSettles(page)).toBe(1);
  });
});
