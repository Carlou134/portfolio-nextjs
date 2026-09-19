import { z } from "zod";

export type ContactError = "missing" | "email" | "short";

// Deliberately the same permissive pattern the route used before Zod: it only
// checks shape. Escaping user input is the mailer's responsibility, not this
// schema's, so z.email() (stricter) would silently change what gets accepted.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

// Error messages are keys, not prose: the server and any client form map them
// to their own translations, so this schema stays language-agnostic.
const contactSchema = z.object(
  {
    name: z.string({ error: "missing" }).trim().min(1, { error: "missing" }),
    email: z
      .string({ error: "missing" })
      .trim()
      .min(1, { error: "missing" })
      .regex(EMAIL_PATTERN, { error: "email" }),
    message: z
      .string({ error: "missing" })
      .trim()
      .min(1, { error: "missing" })
      .min(MIN_MESSAGE_LENGTH, { error: "short" }),
  },
  { error: "missing" },
);

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactParseResult =
  | { success: true; data: ContactPayload }
  | { success: false; error: ContactError };

// Zod reports every failing field; the API surfaces a single error. Precedence
// mirrors the original hand-written checks: missing > email > short.
const PRECEDENCE: ContactError[] = ["missing", "email", "short"];

export function parseContact(input: unknown): ContactParseResult {
  const result = contactSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const reported = new Set(result.error.issues.map((issue) => issue.message));
  const error = PRECEDENCE.find((key) => reported.has(key)) ?? "missing";
  return { success: false, error };
}
