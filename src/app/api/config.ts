export const USE_REAL_BACKEND = process.env.USE_REAL_BACKEND === "true";
export const REAL_API_URL =
  process.env.REAL_API_URL || "https://api.sgc.gov.cv/api/v1";
export const REAL_API_BASE =
  process.env.REAL_API_BASE || REAL_API_URL.replace(/\/api\/v1$/, "");

export const MUNICIPALITY_ID =
  process.env.NEXT_PUBLIC_MUNICIPALITY_ID ||
  process.env.APP_MUNICIPALITY_DEFAULT ||
  process.env.APP_MUCIPALITY_DEFAULT || "";

/**
 * proxyFetch
 * Proxies the current request to the real backend, preserving path and query.
 * Adds Authorization header when available and respects method/headers overrides.
 */
import { getAccessToken } from "@/lib/auth-helpers";

export async function proxyFetch(
  req: Request,
  path: string,
  init?: RequestInit,
) {
  const url = new URL(req.url);
  const query = url.search ? url.search : "";
  const target = `${REAL_API_URL}${path}${query}`;

  const token = await getAccessToken().catch(() => undefined);
  const authHeader = token?.accessToken
    ? { Authorization: `Bearer ${token.accessToken}` }
    : {};

  const contentTypeHeader =
    (init?.headers as Record<string, string> | undefined)?.["content-type"] ||
    (req.headers.get("content-type") ?? undefined);

  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

  const headers = new Headers(init?.headers as HeadersInit);
  if (contentTypeHeader) headers.set("content-type", contentTypeHeader);
  headers.set("Accept", "*/*");
  headers.set("X-Request-ID", requestId);
  if (token?.accessToken)
    headers.set("Authorization", `Bearer ${token.accessToken}`);

  const res = await fetch(target, {
    method: init?.method ?? req.method,
    headers,
    body: init?.body,
    cache: "no-store",
  });

  const responseContentType = res.headers.get("content-type") || "";
  if (responseContentType.toLowerCase().includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  }
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": responseContentType || "application/octet-stream",
    },
  });
}

/**
 * Proxies a request to a custom base URL (useful for non-versioned paths).
 */
export async function proxyFetchToBase(
  req: Request,
  baseUrl: string,
  path: string,
  init?: RequestInit,
) {
  const url = new URL(req.url);
  const query = url.search ? url.search : "";
  const target = `${baseUrl}${path}${query}`;

  const token = await getAccessToken().catch(() => undefined);
  const authHeader = token?.accessToken
    ? { Authorization: `Bearer ${token.accessToken}` }
    : {};

  const contentTypeHeader =
    (init?.headers as Record<string, string> | undefined)?.["content-type"] ||
    (req.headers.get("content-type") ?? undefined);

  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

  const headers = new Headers(init?.headers as HeadersInit);
  if (contentTypeHeader) headers.set("content-type", contentTypeHeader);
  headers.set("Accept", "*/*");
  headers.set("X-Request-ID", requestId);
  if (token?.accessToken)
    headers.set("Authorization", `Bearer ${token.accessToken}`);

  const res = await fetch(target, {
    method: init?.method ?? req.method,
    headers,
    body: init?.body,
    cache: "no-store",
  });

  const responseContentType = res.headers.get("content-type") || "";
  if (responseContentType.toLowerCase().includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  }
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": responseContentType || "application/octet-stream",
    },
  });
}

/**
 * Builds a standardized error JSON response.
 */
export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  return Response.json(
    {
      error: code,
      message,
      details: details ?? null,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
