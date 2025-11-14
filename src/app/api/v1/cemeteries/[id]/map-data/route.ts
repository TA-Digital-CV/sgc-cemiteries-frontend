import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
import { blocks } from "../../../../mock-data";

/**
 * GET /api/v1/cemeteries/{id}/map-data
 * Returns GeoJSON FeatureCollection for given level.
 */
/**
 * GET /api/v1/cemeteries/{id}/map-data
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
    const url = `${base}/cemeteries/${id}/map-data${search ? `?${search}` : ""}`;
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
  const level = (
    request.nextUrl.searchParams.get("level") ?? "BLOCKS"
  ).toUpperCase();
  const format = (
    request.nextUrl.searchParams.get("format") ?? "GEOJSON"
  ).toUpperCase();
  const includeOccupied =
    (request.nextUrl.searchParams.get("includeOccupied") ?? "true") === "true";
  if (format !== "GEOJSON") {
    return Response.json(
      { error: "UNSUPPORTED_FORMAT", message: "Formato não suportado" },
      { status: 400 },
    );
  }
  let features: any[] = [];
  if (level === "BLOCKS") {
    features = blocks
      .filter((b: any) => b.cemeteryId === id)
      .map((b: any) => ({
        type: "Feature",
        id: b.id,
        properties: {
          id: b.id,
          name: b.name,
          type: "BLOCK",
          maxCapacity: b.maxCapacity,
          currentOccupancy: b.currentOccupancy,
          occupancyRate: b.occupancyRate,
          status: b.status,
        },
        geometry: b.geoPolygon,
      }));
  } else if (level === "PLOTS") {
    const { plots } = await import("../../../../mock-data");
    features = plots
      .filter((p: any) => p.cemeteryId === id)
      .filter((p: any) =>
        includeOccupied ? true : p.occupationStatus !== "OCCUPIED",
      )
      .map((p: any) => ({
        type: "Feature",
        id: p.id,
        properties: {
          id: p.id,
          plotNumber: p.plotNumber,
          type: "PLOT",
          plotType: p.plotType,
          occupationStatus: p.occupationStatus,
        },
        geometry: p.geoPoint
          ? {
              type: "Point",
              coordinates: [p.geoPoint.longitude, p.geoPoint.latitude],
            }
          : null,
      }));
  } else if (level === "SECTIONS") {
    const { sections } = await import("../../../../mock-data");
    features = sections
      .filter((s: any) => s.cemeteryId === id)
      .map((s: any) => ({
        type: "Feature",
        id: s.id,
        properties: {
          id: s.id,
          name: s.name,
          type: "SECTION",
          maxCapacity: s.maxCapacity,
          currentOccupancy: s.currentOccupancy,
          occupancyRate: s.occupancyRate,
          status: s.status,
        },
        geometry: null,
      }));
  } else if (level === "CEMETERY") {
    const { cemeteries } = await import("../../../../mock-data");
    const c = cemeteries.find((k: any) => k.id === id);
    if (c) {
      features = [
        {
          type: "Feature",
          id: c.id,
          properties: {
            id: c.id,
            name: c.name,
            type: "CEMETERY",
            status: c.status,
          },
          geometry: c.geoPoint
            ? {
                type: "Point",
                coordinates: [c.geoPoint.longitude, c.geoPoint.latitude],
              }
            : null,
        },
      ];
    }
  }
  return Response.json({
    type: "FeatureCollection",
    crs: { type: "name", properties: { name: "EPSG:4326" } },
    features,
    metadata: {
      cemeteryId: id,
      level,
      totalFeatures: features.length,
      generatedAt: new Date().toISOString(),
    },
  });
}
