import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../config";
import { blocks, cemeteries, plots, sections } from "../../../mock-data";

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
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/cemeteries/${id}`);
  }
  const item = cemeteries.find((c) => c.id === id);
  if (!item) {
    return Response.json(
      { error: "NOT_FOUND", message: "Cemitério não encontrado" },
      { status: 404 },
    );
  }
  const cemeteryBlocks = blocks.filter((b) => b.cemeteryId === id);
  const cemeterySections = sections.filter((s) => s.cemeteryId === id);
  const cemeteryPlots = plots.filter((p) => p.cemeteryId === id);
  const _occupiedPlots = cemeteryPlots.filter(
    (p) => p.occupationStatus === "OCCUPIED",
  ).length;
  const availablePlots = cemeteryPlots.filter(
    (p) => p.occupationStatus === "AVAILABLE",
  ).length;
  const response = {
    ...item,
    blocksCount: cemeteryBlocks.length,
    sectionsCount: cemeterySections.length,
    plotsCount: cemeteryPlots.length,
    availablePlots,
  };
  return Response.json(response);
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
  if (USE_REAL_BACKEND) {
    const body = await request.text();
    return proxyFetch(request, `/cemeteries/${id}`, { method: "PUT", body });
  }
  const idx = cemeteries.findIndex((c) => c.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Cemitério não encontrado" },
      { status: 404 },
    );
  }
  const payload = await request.json().catch(() => ({}));
  const updated = {
    ...cemeteries[idx],
    ...payload,
    lastModifiedDate: new Date().toISOString(),
  };
  cemeteries[idx] = updated as (typeof cemeteries)[number];
  return Response.json(updated);
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
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/cemeteries/${id}`, { method: "DELETE" });
  }
  const confirm = request.nextUrl.searchParams.get("confirm");
  if (confirm !== "true") {
    return Response.json(
      {
        error: "CONFIRMATION_REQUIRED",
        message: "Confirmação obrigatória (confirm=true)",
      },
      { status: 400 },
    );
  }
  const cemeteryPlots = plots.filter((p) => p.cemeteryId === id);
  const hasOccupied = cemeteryPlots.some(
    (p) => p.occupationStatus === "OCCUPIED",
  );
  if (hasOccupied) {
    return Response.json(
      {
        error: "CANNOT_DELETE",
        message: "Cemitério possui sepulturas ocupadas",
      },
      { status: 400 },
    );
  }
  const idx = cemeteries.findIndex((c) => c.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Cemitério não encontrado" },
      { status: 404 },
    );
  }
  cemeteries[idx] = {
    ...cemeteries[idx],
    status: "INACTIVE",
    lastModifiedDate: new Date().toISOString(),
  } as (typeof cemeteries)[number];
  return Response.json({ status: "INACTIVE" }, { status: 200 });
}
