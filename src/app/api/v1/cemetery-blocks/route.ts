import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../config";
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
    geoPolygon: payload.geoPolygon ?? { type: "Polygon", coordinates: [] },
  };
  blocks.push(item as (typeof blocks)[number]);
  return Response.json(item, { status: 201 });
}

/**
 * GET /api/v1/cemetery-blocks
 * Returns list of blocks filtered by cemeterieId/cemeteryId.
 */
export async function GET(request: NextRequest) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, "/cemetery-blocks");
  }
  const url = new URL(request.url);
  const cid =
    url.searchParams.get("cemeterieId") ??
    url.searchParams.get("cemeteryId") ??
    "";
  const list = cid
    ? blocks.filter((b) => String(b.cemeteryId) === String(cid))
    : blocks;
  return Response.json({ content: list });
}
