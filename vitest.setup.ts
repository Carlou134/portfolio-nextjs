import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// RTL doesn't register its automatic cleanup because `test.globals` is off
// (explicit imports in every test file instead) — so it has to be done here.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom doesn't implement IntersectionObserver; Framer Motion's `whileInView`
// needs it to mount at all.
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// jsdom doesn't implement either of these; Hero/Terminal's "scroll to
// section" commands call scrollIntoView, and Terminal's own output pane
// autoscrolls itself on new lines via scrollTo.
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn();
