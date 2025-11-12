import type { NextRequest } from "next/server";

/**
 * GET /api/v1/plots/{id}/qr-code
 * Returns QR code string for a plot.
 */
/**
 * GET /api/v1/plots/{id}/qr-code
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
  const res = await fetch(`${base}/plots/${id}/qr-code`, { method: "GET" });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
