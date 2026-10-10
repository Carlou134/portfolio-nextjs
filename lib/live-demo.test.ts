import { describe, it, expect } from "vitest";
import { isLiveDemo } from "./live-demo";

const href = "https://example.com";

describe("isLiveDemo", () => {
  it("is false when there is no demo", () => {
    expect(isLiveDemo(undefined, "2026-10-10")).toBe(false);
  });

  it("stays live forever without a liveUntil date", () => {
    expect(isLiveDemo({ href }, "2030-01-01")).toBe(true);
  });

  it("stays live through the liveUntil day itself", () => {
    expect(isLiveDemo({ href, liveUntil: "2026-12-01" }, "2026-12-01")).toBe(
      true,
    );
  });

  it("hides itself the day after liveUntil", () => {
    expect(isLiveDemo({ href, liveUntil: "2026-12-01" }, "2026-12-02")).toBe(
      false,
    );
  });
});
