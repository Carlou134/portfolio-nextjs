import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";

// Same host as metadataBase (layout.tsx) and robots.ts: a sitemap on a
// different host than the canonical URLs reads as a different site.
const SITE = "https://www.cfvasquez.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Built from the content, so a new case study is listed without anyone
    // remembering to add it here. One URL per study: the locale comes from a
    // cookie, not the path, so ES and EN share it.
    ...caseStudies.map((study) => ({
      url: `${SITE}/case-study/${study.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
