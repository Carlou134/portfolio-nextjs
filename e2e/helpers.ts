import { expect, type Page, type Route } from "@playwright/test";

const LANG_STORAGE_KEY = "portfolio-lang";

/**
 * Loads the home page and waits until React has hydrated.
 *
 * Clicking before hydration does nothing (no handlers attached yet), which
 * makes e2e flaky in dev mode. LanguageProvider writes the language to
 * localStorage from a post-mount effect, so its presence is a deterministic
 * "hydrated" signal that doesn't need sleeps or `networkidle`. It only holds
 * in a fresh browser context (every Playwright test gets one); after a reload
 * the key already exists, so assert on visible text instead.
 */
export async function gotoHydrated(page: Page) {
  await page.goto("/");
  await page.waitForFunction(
    (key) => window.localStorage.getItem(key) !== null,
    LANG_STORAGE_KEY,
  );
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  lang: "es" | "en";
}

type ContactResponse =
  | { kind: "json"; status: number; body: Record<string, unknown> }
  | { kind: "abort" };

/**
 * Intercepts POST /api/contact so specs never reach the real route (and
 * therefore never reach Resend). Every payload the page sends is recorded.
 */
export async function mockContactApi(
  page: Page,
  response: ContactResponse = {
    kind: "json",
    status: 200,
    body: { success: true },
  },
) {
  const requests: ContactRequest[] = [];

  await page.route("**/api/contact", async (route: Route) => {
    requests.push(route.request().postDataJSON() as ContactRequest);

    if (response.kind === "abort") {
      await route.abort("failed");
      return;
    }
    await route.fulfill({
      status: response.status,
      contentType: "application/json",
      body: JSON.stringify(response.body),
    });
  });

  return requests;
}

export async function fillContactForm(
  page: Page,
  values: Pick<ContactRequest, "name" | "email" | "message">,
  labels: { name: string; email: string; message: string } = {
    name: "Nombre",
    email: "Email",
    message: "Mensaje",
  },
) {
  const field = (label: string) => page.getByLabel(label, { exact: true });

  await field(labels.name).fill(values.name);
  await field(labels.email).fill(values.email);
  await field(labels.message).fill(values.message);
  await expect(field(labels.message)).toHaveValue(values.message);
}

/**
 * The contact <form>, found by its accessible name. Regions inside it are
 * queried through this locator on purpose: Next injects its own
 * role="alert" route announcer, so a page-wide getByRole("alert") is ambiguous.
 */
export function contactForm(page: Page) {
  return page.getByRole("form", { name: /hablemos|let's talk/i });
}
