import { describe, it, expect } from "vitest";
import { projectsSchema, experiencesSchema } from "./schema";
import { projects } from "./projects";
import { experiences } from "./experience";

const validProject = {
  id: 1,
  badge: { es: "Backend", en: "Backend" },
  badgeColor: "accent",
  title: { es: "Título", en: "Title" },
  description: { es: "Descripción", en: "Description" },
  metrics: [],
  stack: ["C#"],
  links: [{ label: "GitHub", href: "https://github.com/Carlou134/webapi" }],
  featured: false,
};

const validExperience = {
  id: 1,
  company: "Empresa",
  role: { es: "Rol", en: "Role" },
  period: { es: "Ene 2026", en: "Jan 2026" },
  current: false,
  bullets: [{ es: "Punto", en: "Point" }],
};

describe("content schemas", () => {
  it("accepts the real project and experience data", () => {
    expect(projectsSchema.safeParse(projects).success).toBe(true);
    expect(experiencesSchema.safeParse(experiences).success).toBe(true);
  });

  it("rejects a project whose Spanish title is missing", () => {
    const broken = { ...validProject, title: { en: "Title" } };
    expect(projectsSchema.safeParse([broken]).success).toBe(false);
  });

  it("rejects a project with an unknown badge color", () => {
    const broken = { ...validProject, badgeColor: "red" };
    expect(projectsSchema.safeParse([broken]).success).toBe(false);
  });

  it("rejects a project link that is not a URL", () => {
    const broken = {
      ...validProject,
      links: [{ label: "GitHub", href: "not a url" }],
    };
    expect(projectsSchema.safeParse([broken]).success).toBe(false);
  });

  it("rejects projects that share an id", () => {
    expect(
      projectsSchema.safeParse([validProject, { ...validProject }]).success,
    ).toBe(false);
  });

  it("rejects a project with an empty stack", () => {
    const broken = { ...validProject, stack: [] };
    expect(projectsSchema.safeParse([broken]).success).toBe(false);
  });

  it("rejects an experience with no bullets", () => {
    const broken = { ...validExperience, bullets: [] };
    expect(experiencesSchema.safeParse([broken]).success).toBe(false);
  });

  it("rejects an experience whose bullet lacks an English translation", () => {
    const broken = {
      ...validExperience,
      bullets: [{ es: "Punto", en: "   " }],
    };
    expect(experiencesSchema.safeParse([broken]).success).toBe(false);
  });

  it("rejects experiences that share an id", () => {
    expect(
      experiencesSchema.safeParse([validExperience, { ...validExperience }])
        .success,
    ).toBe(false);
  });
});
