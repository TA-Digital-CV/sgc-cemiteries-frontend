import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../config";
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
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
  const item = cemeteries.find((c: any) => c.id === id);
  if (!item) {
    return Response.json(
      { error: "NOT_FOUND", message: "Cemitério não encontrado" },
      { status: 404 },
    );
  }
  const cemeteryBlocks = blocks.filter((b: any) => b.cemeteryId === id);
  const cemeterySections = sections.filter((s: any) => s.cemeteryId === id);
  const cemeteryPlots = plots.filter((p: any) => p.cemeteryId === id);
  const occupiedPlots = cemeteryPlots.filter(
    (p: any) => p.occupationStatus === "OCCUPIED",
  ).length;
  const availablePlots = cemeteryPlots.filter(
    (p: any) => p.occupationStatus === "AVAILABLE",
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const body = await request.text();
    const res = await fetch(`${base}/cemeteries/${id}`, {
      method: "PUT",
      headers: {
        "content-type":
          request.headers.get("content-type") ?? "application/json",
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
  const idx = cemeteries.findIndex((c: any) => c.id === id);
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
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
  const cemeteryPlots = plots.filter((p: any) => p.cemeteryId === id);
  const hasOccupied = cemeteryPlots.some(
    (p: any) => p.occupationStatus === "OCCUPIED",
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
  const idx = cemeteries.findIndex((c: any) => c.id === id);
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
