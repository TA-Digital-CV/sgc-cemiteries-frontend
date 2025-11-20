import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { blocks, plots, sections } from "../../../../mock-data";

/**
 * GET /api/v1/cemeteries/{id}/availability
 * Returns available plots and summary.
 */
/**
 * GET /api/v1/cemeteries/{id}/availability
 * Proxies to backend API using IGRP_APP_MANAGER_API. No mock data.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/cemeteries/${id}/availability`);
  }
  const plotType = request.nextUrl.searchParams.get("plotType") ?? undefined;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  const available = plots
    .filter((p) => p.cemeteryId === id && p.occupationStatus === "AVAILABLE")
    .filter((p) => (plotType ? p.plotType === plotType : true))
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      plotNumber: p.plotNumber,
      location: {
        blockName: blocks.find((b) => b.id === p.blockId)?.name ?? "",
        sectionName: sections.find((s) => s.id === p.sectionId)?.name ?? "",
        coordinates: p.geoPoint,
      },
      plotType: p.plotType,
      dimensions: p.dimensions,
      distanceFromPreferred: null,
      qrCode: p.qrCode,
      accessibility: {
        wheelchairAccessible: true,
        nearMainPath: true,
        distanceToEntrance: 85.3,
      },
      pricing: {
        basePrice: 2500.0,
        locationMultiplier: 1.1,
        finalPrice: 2750.0,
        currency: "CVE",
      },
    }));
  return Response.json({
    cemeteryId: id,
    searchCriteria: {
      plotType: plotType ?? null,
      preferredLocation: null,
      maxDistance: null,
      limit,
    },
    availablePlots: available,
    summary: {
      totalAvailable: available.length,
      matchingCriteria: available.length,
      averageDistance: null,
      priceRange: { min: 2500.0, max: 3200.0, average: 2850.0 },
    },
    generatedAt: new Date().toISOString(),
  });
}
