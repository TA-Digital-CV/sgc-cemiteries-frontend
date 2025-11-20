import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
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
    const body = await request.text();
    return proxyFetch(request, `/plots/${id}/geolocation`, { body });
  }
  const idx = plots.findIndex((p) => p.id === id);
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
