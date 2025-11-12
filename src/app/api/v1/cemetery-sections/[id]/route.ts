import type { NextRequest } from "next/server";

/**
 * PUT /api/v1/cemetery-sections/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function PUT(
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
  const body = await request.text();
  const res = await fetch(`${base}/cemetery-sections/${id}`, {
    method: "PUT",
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
    body,
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
