import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  // Specs are independent (each mocks its own network), so they can run in parallel.
  fullyParallel: true,
  // Measured locally against `next dev` on a 32-core machine: 16 workers (the
  // default) timed out 10/10 on page.goto, 4 workers timed out 4/10, 1 worker
  // passed 10/10 in ~27s. The dev server stalls when several browsers hit it
  // cold at once (root cause not diagnosed). CI serves the production bundle,
  // so it keeps Playwright's default.
  workers: isCI ? undefined : 1,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Locally we run the dev server (no build step). CI must build first and
    // serve the production bundle, which is what real users get.
    command: isCI ? `pnpm start --port ${PORT}` : `pnpm dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Reuse a dev server you already have running instead of failing on the port.
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
