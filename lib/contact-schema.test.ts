import { describe, it, expect } from "vitest";
import { contactFieldErrors, parseContact } from "./contact-schema";

const valid = {
  name: "Carlos",
  email: "a@b.com",
  message: "Quiero hablar de un proyecto",
};

describe("parseContact", () => {
  it("returns the trimmed payload for valid input", () => {
    const result = parseContact({
      name: "  Carlos ",
      email: " a@b.com ",
      message: "  Quiero hablar de un proyecto  ",
    });
    expect(result).toEqual({
      success: true,
      data: { ...valid, intent: "other" },
    });
  });

  it("keeps a known intent", () => {
    const result = parseContact({ ...valid, intent: "job" });
    expect(result).toEqual({
      success: true,
      data: { ...valid, intent: "job" },
    });
  });

  it.each([
    ["an unknown intent", "hack"],
    ["a non-string intent", 42],
  ])("falls back to 'other' for %s instead of rejecting", (_label, intent) => {
    const result = parseContact({ ...valid, intent });
    expect(result).toEqual({
      success: true,
      data: { ...valid, intent: "other" },
    });
  });

  it.each([
    ["name", { ...valid, name: "" }],
    ["email", { ...valid, email: "" }],
    ["message", { ...valid, message: "" }],
    ["whitespace-only name", { ...valid, name: "   " }],
    ["non-string name", { ...valid, name: 42 }],
    ["missing key", { name: "Carlos", email: "a@b.com" }],
    ["non-object body", null],
  ])("reports 'missing' when %s is absent or empty", (_label, input) => {
    expect(parseContact(input)).toEqual({ success: false, error: "missing" });
  });

  it("reports 'email' for a malformed email", () => {
    expect(parseContact({ ...valid, email: "no-es-un-email" })).toEqual({
      success: false,
      error: "email",
    });
  });

  it("reports 'short' for a message under 10 characters", () => {
    expect(parseContact({ ...valid, message: "corto" })).toEqual({
      success: false,
      error: "short",
    });
  });

  it("counts a whitespace-padded message by its trimmed length", () => {
    expect(parseContact({ ...valid, message: "   corto      " })).toEqual({
      success: false,
      error: "short",
    });
  });

  it("prioritizes 'missing' over 'email' and 'short'", () => {
    expect(
      parseContact({ name: "", email: "no-es-un-email", message: "corto" }),
    ).toEqual({ success: false, error: "missing" });
  });

  it("prioritizes 'email' over 'short'", () => {
    expect(
      parseContact({ ...valid, email: "no-es-un-email", message: "corto" }),
    ).toEqual({ success: false, error: "email" });
  });

  it("keeps accepting quotes in the local part (escaping is the mailer's job)", () => {
    const email = 'a"onmouseover="x@b.com';
    expect(parseContact({ ...valid, email })).toEqual({
      success: true,
      data: { ...valid, email, intent: "other" },
    });
  });
});

describe("contactFieldErrors", () => {
  it("returns nothing for valid input", () => {
    expect(contactFieldErrors(valid)).toEqual({});
  });

  it("reports every failing field, each with its own error", () => {
    expect(
      contactFieldErrors({ name: " ", email: "nope", message: "corto" }),
    ).toEqual({ name: "missing", email: "email", message: "short" });
  });

  it("calls an empty field missing, not malformed or short", () => {
    expect(contactFieldErrors({ name: "", email: "", message: "" })).toEqual({
      name: "missing",
      email: "missing",
      message: "missing",
    });
  });

  it("leaves valid fields out", () => {
    expect(contactFieldErrors({ ...valid, email: "x@" })).toEqual({
      email: "email",
    });
  });
});
