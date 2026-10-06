import { expect, type Page, type Route } from "@playwright/test";

/**
 * Loads the home page and waits until React has hydrated.
 *
 * Clicking before hydration does nothing (no handlers attached yet), which
 * makes e2e flaky in dev mode. Navbar sets a `data-hydrated` marker on
 * `<html>` from a post-mount effect, so its presence is a deterministic
 * "hydrated" signal that doesn't need sleeps or `networkidle`. Navbar renders
 * on every page, so the marker holds regardless of which page loaded.
 */
export async function gotoHydrated(page: Page) {
  await page.goto("/");
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
}

/** One button of the navbar's ES / EN segmented control. */
export function languageOption(page: Page, name: "ES" | "EN") {
  return page
    .getByRole("group", { name: /idioma|language/i })
    .getByRole("button", { name, exact: true });
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
