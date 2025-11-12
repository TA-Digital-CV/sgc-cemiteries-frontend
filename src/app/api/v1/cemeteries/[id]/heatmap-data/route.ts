import type { NextRequest } from "next/server";

/**
 * GET /api/v1/cemeteries/{id}/heatmap-data
 * Returns grid data for heatmap visualization.
 */
/**
 * GET /api/v1/cemeteries/{id}/heatmap-data
 * Proxy to backend using IGRP_APP_MANAGER_API.
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
  const search = request.nextUrl.searchParams.toString();
  const url = `${base}/cemeteries/${id}/heatmap-data${search ? `?${search}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { accept: request.headers.get("accept") ?? "application/json" },
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
