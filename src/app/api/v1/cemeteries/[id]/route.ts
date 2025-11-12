import type { NextRequest } from "next/server";

/**
 * GET /api/v1/cemeteries/{id}
 * Returns cemetery details.
 */
/**
 * GET /api/v1/cemeteries/{id}
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
  const res = await fetch(`${base}/cemeteries/${id}`, {
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

/**
 * PUT /api/v1/cemeteries/{id}
 * Updates cemetery data.
 */
/**
 * PUT /api/v1/cemeteries/{id}
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
  const res = await fetch(`${base}/cemeteries/${id}`, {
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

/**
 * DELETE /api/v1/cemeteries/{id}
 * Removes the cemetery.
 */
/**
 * DELETE /api/v1/cemeteries/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function DELETE(
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
  const url = `${base}/cemeteries/${id}${search ? `?${search}` : ""}`;
  const res = await fetch(url, { method: "DELETE" });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
