import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../config";
import { blocks } from "../../mock-data";

/**
 * POST /api/v1/cemetery-blocks
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function POST(request: NextRequest) {
  if (USE_REAL_BACKEND) {
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const body = await request.text();
    const res = await fetch(`${base}/cemetery-blocks`, {
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
