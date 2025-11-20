import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { plots } from "../../../../mock-data";

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
  if (USE_REAL_BACKEND) {
    const search = request.nextUrl.searchParams.toString();
    return proxyFetch(
      request,
      `/cemeteries/${id}/heatmap-data${search ? `?${search}` : ""}`,
    );
  }
  const gridSize = Number(request.nextUrl.searchParams.get("gridSize") ?? 50);
  const points = plots.filter((p) => p.cemeteryId === id && p.geoPoint);
  const data = points.map((p) => ({
    lat: p.geoPoint?.latitude,
    lng: p.geoPoint?.longitude,
    value: p.occupationStatus === "OCCUPIED" ? 1 : 0.3,
  }));
  return Response.json({
    gridSize,
    metric: request.nextUrl.searchParams.get("metric") ?? "OCCUPANCY",
    data,
  });
}
