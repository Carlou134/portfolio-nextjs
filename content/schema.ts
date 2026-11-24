import { z } from "zod";

const nonEmpty = z.string().trim().min(1);

const bilingualSchema = z.object({
  es: nonEmpty,
  en: nonEmpty,
});

// Layers shared by the Projects filter; same names as the Stack section.
export const projectCategories = [
  "front",
  "back",
  "data",
  "ops",
  "ai",
] as const;

const linkSchema = z.object({ label: nonEmpty, href: z.url() });

const projectSchema = z.object({
  id: z.number().int().positive(),
  // "grid" cards carry evidence; "table" ones go to the "More projects" list.
  placement: z.enum(["grid", "table"]),
  status: z.enum(["done", "wip", "prod"]),
  kind: z.enum(["thesis", "technicalTest", "academic", "personal", "work"]),
  year: z.number().int().min(2020).max(2030),
  categories: z.array(z.enum(projectCategories)).min(1),
  title: bilingualSchema,
  description: bilingualSchema,
  metrics: z.array(z.object({ value: nonEmpty, label: bilingualSchema })),
  stack: z.array(nonEmpty).min(1),
  image: z.string().startsWith("/").optional(),
  repos: z.array(linkSchema),
  // Recorded walkthrough with narration. A plain demo recording counts as
  // `demo`, so nobody clicks "walkthrough" and gets a silent screen capture.
  video: z.url().optional(),
  // Live deploys can expire (student credits); the link hides itself after
  // liveUntil instead of shipping a dead button.
  demo: z
    .object({ href: z.url(), liveUntil: z.iso.date().optional() })
    .optional(),
  caseSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  footer: bilingualSchema.optional(),
  // Dev-only checklist of missing content; never rendered in production.
  pending: z.array(nonEmpty).optional(),
});

export const projectsSchema = z
  .array(projectSchema)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    {
      error: "project ids must be unique",
    },
  );

const experienceSchema = z.object({
  id: z.number().int().positive(),
  company: nonEmpty,
  role: bilingualSchema,
  period: bilingualSchema,
  current: z.boolean(),
  bullets: z.array(bilingualSchema).min(1),
});

export const experiencesSchema = z
  .array(experienceSchema)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    {
      error: "experience ids must be unique",
    },
  );

export type Project = z.infer<typeof projectSchema>;
export type ProjectCategory = (typeof projectCategories)[number];
export type Experience = z.infer<typeof experienceSchema>;
