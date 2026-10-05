import { z } from "zod";

const nonEmpty = z.string().trim().min(1);

const bilingualSchema = z.object({
  es: nonEmpty,
  en: nonEmpty,
});

const projectSchema = z.object({
  id: z.number().int().positive(),
  badge: bilingualSchema,
  badgeColor: z.enum(["accent", "amber", "pink"]),
  title: bilingualSchema,
  description: bilingualSchema,
  metrics: z.array(z.object({ value: nonEmpty, label: nonEmpty })),
  stack: z.array(nonEmpty).min(1),
  image: z.string().startsWith("/").optional(),
  links: z.array(z.object({ label: nonEmpty, href: z.url() })),
  featured: z.boolean(),
  footer: bilingualSchema.optional(),
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
export type Experience = z.infer<typeof experienceSchema>;
