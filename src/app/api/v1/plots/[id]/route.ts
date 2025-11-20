import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../config";
import { plots } from "../../../mock-data";

/**
 * GET /api/v1/plots/{id}
 * Returns plot details.
 */
/**
 * GET /api/v1/plots/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/plots/${id}`);
  }
  const item = plots.find((p) => p.id === id);
  if (!item) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  return Response.json(item);
}

/**
 * PUT /api/v1/plots/{id}
 * Updates plot data.
 */
/**
 * PUT /api/v1/plots/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const body = await request.text();
    return proxyFetch(request, `/plots/${id}`, { body });
  }
  const idx = plots.findIndex((p) => p.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  const payload = await request.json().catch(() => ({}));
  const updated = {
    ...plots[idx],
    ...payload,
    lastModifiedDate: new Date().toISOString(),
  };
  plots[idx] = updated as (typeof plots)[number];
  return Response.json(updated);
}

/**
 * DELETE /api/v1/plots/{id}
 * Removes the plot.
 */
/**
 * DELETE /api/v1/plots/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/plots/${id}`, { method: "DELETE" });
  }
  const idx = plots.findIndex((p) => p.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  const status = plots[idx].occupationStatus;
  if (status !== "AVAILABLE") {
    return Response.json(
      {
        error: "CANNOT_DELETE",
        message: "Apenas sepulturas disponíveis podem ser removidas",
      },
      { status: 400 },
    );
  }
  plots.splice(idx, 1);
  return Response.json({ deleted: true });
}
