import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
import { plots } from "../../../../mock-data";

/**
 * POST /api/v1/plots/{id}/geolocation
 * Updates geolocation for a plot.
 */
/**
 * POST /api/v1/plots/{id}/geolocation
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function POST(
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
    const res = await fetch(`${base}/plots/${id}/geolocation`, {
      method: "POST",
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
  const idx = plots.findIndex((p: any) => p.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  const payload = await request.json().catch(() => ({}));
  plots[idx] = {
    ...plots[idx],
    geoPoint: { latitude: payload.latitude, longitude: payload.longitude },
    lastModifiedDate: new Date().toISOString(),
  } as (typeof plots)[number];
  return Response.json({
    plotId: id,
    geoPoint: plots[idx].geoPoint,
    accuracy: payload.accuracy ?? null,
    source: payload.source ?? "MANUAL",
    validationResults: {
      withinSectionBounds: true,
      minimumDistanceToNearest: null,
      nearestPlotId: null,
    },
    updatedDate: new Date().toISOString(),
  });
}
