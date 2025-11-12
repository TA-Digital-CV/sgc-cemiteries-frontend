export const USE_REAL_BACKEND = process.env.USE_REAL_BACKEND === "true";
export const REAL_API_URL =
  process.env.REAL_API_URL || "https://api.sgc.gov.cv/api/v1";

/**
 * proxyFetch
 * Proxies the current request to the real backend, preserving path and query.
 */
export async function proxyFetch(
  req: Request,
  path: string,
  init?: RequestInit,
) {
  const url = new URL(req.url);
  const query = url.search ? url.search : "";
  const target = `${REAL_API_URL}${path}${query}`;
  const res = await fetch(target, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: init?.body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return Response.json(data, { status: res.status });
}
