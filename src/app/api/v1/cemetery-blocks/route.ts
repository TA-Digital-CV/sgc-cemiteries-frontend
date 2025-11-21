import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND, proxyFetch } from "../../config";
import { blocks } from "../../mock-data";

/**
 * POST /api/v1/cemetery-blocks
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function POST(request: NextRequest) {
  if (USE_REAL_BACKEND) {
    const body = await request.text();
    return proxyFetch(request, "/cemetery-blocks", { method: "POST", body });
  }
  const payload = await request.json().catch(() => ({}));
  const item = {
    id: crypto.randomUUID(),
    cemeteryId: payload.cemeteryId,
    name: payload.name,
    description: payload.description ?? null,
    maxCapacity: payload.maxCapacity ?? 0,
    currentOccupancy: 0,
    occupancyRate: 0,
    status: "ACTIVE",
    geoPolygon: payload.geoPolygon ?? { type: "Polygon", coordinates: [] },
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  };
  blocks.push(item as (typeof blocks)[number]);
  return Response.json(item, { status: 201 });
}
