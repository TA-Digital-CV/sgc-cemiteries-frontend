import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
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
  const gridSize = Number(request.nextUrl.searchParams.get("gridSize") ?? 50);
  const points = plots.filter((p: any) => p.cemeteryId === id && p.geoPoint);
  const data = points.map((p: any) => ({
    lat: p.geoPoint!.latitude,
    lng: p.geoPoint!.longitude,
    value: p.occupationStatus === "OCCUPIED" ? 1 : 0.3,
  }));
  return Response.json({
    gridSize,
    metric: request.nextUrl.searchParams.get("metric") ?? "OCCUPANCY",
    data,
  });
}
