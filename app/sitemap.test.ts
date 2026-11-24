import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { caseStudies } from "@/content/case-studies";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists the home page first", () => {
    expect(urls[0]).toBe("https://www.cfvasquez.dev");
  });

  it("lists every published case study", () => {
    for (const study of caseStudies) {
      expect(urls).toContain(
        `https://www.cfvasquez.dev/case-study/${study.slug}`,
      );
    }
    expect(urls).toContain("https://www.cfvasquez.dev/case-study/soc-ml");
  });

  it("keeps every URL on the canonical host", () => {
    for (const url of urls) {
      expect(url.startsWith("https://www.cfvasquez.dev")).toBe(true);
    }
  });
});
