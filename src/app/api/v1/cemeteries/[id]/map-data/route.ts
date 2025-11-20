import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
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
    const search = request.nextUrl.searchParams.toString();
    return proxyFetch(
      request,
      `/cemeteries/${id}/map-data${search ? `?${search}` : ""}`,
    );
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
  let features: Array<Record<string, unknown>> = [];
  if (level === "BLOCKS") {
    features = blocks
      .filter((b) => b.cemeteryId === id)
      .map((b) => ({
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
      .filter((p) => p.cemeteryId === id)
      .filter((p) =>
        includeOccupied ? true : p.occupationStatus !== "OCCUPIED",
      )
      .map((p) => ({
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
      .filter((s) => s.cemeteryId === id)
      .map((s) => ({
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
    const c = cemeteries.find((k) => k.id === id);
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
