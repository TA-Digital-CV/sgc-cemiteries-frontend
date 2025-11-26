import { beforeEach, describe, expect, it, vi } from "vitest";
import { proxyFetch, proxyFetchToBase } from "./config";

vi.mock("@/lib/auth-helpers", () => ({
  getAccessToken: vi.fn(async () => ({ accessToken: "TEST_TOKEN" })),
}));

describe("proxyFetch", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init: any) => {
        const headers = new Headers(init?.headers || {});
        const ct = headers.get("content-type") || "application/json";
        return new Response(
          ct.includes("json") ? JSON.stringify({ ok: true }) : "RAW",
          {
            status: 200,
            headers: { "content-type": ct },
          },
        );
      }),
    );
  });

  it("adds Authorization and respects method override", async () => {
    const req = new Request("http://localhost/api/v1/test", { method: "POST" });
    const res = await proxyFetch(req, "/x", { method: "DELETE", body: "{}" });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("ok");
  });

  it("streams non-JSON responses", async () => {
    const req = new Request("http://localhost/api/v1/test", { method: "GET" });
    const res = await proxyFetch(req, "/x", {
      headers: { "content-type": "text/plain" },
    });
    const body = await res.text();
    expect(body).toBe("RAW");
  });
});

describe("proxyFetchToBase", () => {
  it("builds target with custom base", async () => {
    const req = new Request("http://localhost/api/v1/test?q=1", {
      method: "GET",
    });
    const res = await proxyFetchToBase(
      req,
      "http://backend",
      "/api/enums/Status",
    );
    expect(res.status).toBe(200);
  });
});
