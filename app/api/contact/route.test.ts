import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } };
  }),
}));

const { POST } = await import("./route");

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "1" }, error: null });
  });

  it("rejects when a required field is missing", async () => {
    const res = await POST(
      makeRequest({ name: "", email: "a@b.com", message: "hola que tal" }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/requeridos/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a whitespace-only name", async () => {
    const res = await POST(
      makeRequest({ name: "   ", email: "a@b.com", message: "hola que tal" }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/requeridos/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a JSON null body with 400 instead of crashing", async () => {
    const res = await POST(makeRequest(null));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/requeridos/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await POST(
      makeRequest({
        name: "Carlos",
        email: "no-es-un-email",
        message: "hola que tal",
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/inválido/i);
  });

  it("rejects a message shorter than 10 characters", async () => {
    const res = await POST(
      makeRequest({ name: "Carlos", email: "a@b.com", message: "corto" }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/corto/i);
  });

  it('returns English error messages when lang is "en"', async () => {
    const res = await POST(
      makeRequest({
        name: "Carlos",
        email: "not-an-email",
        message: "short",
        lang: "en",
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid email.");
  });

  it("sends the email and returns success for valid input", async () => {
    const res = await POST(
      makeRequest({
        name: "Carlos",
        email: "a@b.com",
        message: "Quiero hablar de un proyecto",
      }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "carlouvasquez134@gmail.com" }),
    );
  });

  it("escapes user input before interpolating it into the email HTML", async () => {
    const res = await POST(
      makeRequest({
        name: "<script>alert(1)</script>",
        email: 'a"onmouseover="x@b.com',
        message: "<img src=x onerror=alert(1)> & más texto",
      }),
    );
    expect(res.status).toBe(200);

    const { html } = sendMock.mock.calls[0][0] as { html: string };
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).not.toContain('"onmouseover="');
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain(
      "&lt;img src=x onerror=alert(1)&gt; &amp; más texto",
    );
    expect(html).toContain("&quot;onmouseover=&quot;");
  });

  it("returns 500 and logs the error when Resend fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    sendMock.mockRejectedValueOnce(new Error("network down"));

    const res = await POST(
      makeRequest({
        name: "Carlos",
        email: "a@b.com",
        message: "Quiero hablar de un proyecto",
      }),
    );
    expect(res.status).toBe(500);
    expect(consoleError).toHaveBeenCalledWith(
      "Error sending email:",
      expect.any(Error),
    );

    consoleError.mockRestore();
  });
});
