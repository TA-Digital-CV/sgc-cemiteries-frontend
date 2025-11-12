import type { NextRequest } from "next/server";

/**
 * GET /api/v1/cemeteries/{id}/availability
 * Returns available plots and summary.
 */
/**
 * GET /api/v1/cemeteries/{id}/availability
 * Proxies to backend API using IGRP_APP_MANAGER_API. No mock data.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const base = process.env.IGRP_APP_MANAGER_API || "";
  if (!base) {
    return new Response(
      "Error: Service unavailable - missing IGRP_APP_MANAGER_API",
      { status: 500 },
    );
  }

  const res = await fetch(`${base}/cemeteries/${id}/availability`, {
    method: "GET",
    headers: {
      accept: request.headers.get("accept") ?? "application/json",
    },
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
