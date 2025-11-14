import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
import { plots, blocks, sections } from "../../../../mock-data";

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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const res = await fetch(`${base}/cemeteries/${id}/availability`, {
      method: "GET",
      headers: {
        accept: request.headers.get("accept") ?? "application/json",
      },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  }
  const plotType = request.nextUrl.searchParams.get("plotType") ?? undefined;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  const available = plots
    .filter(
      (p: any) => p.cemeteryId === id && p.occupationStatus === "AVAILABLE",
    )
    .filter((p: any) => (plotType ? p.plotType === plotType : true))
    .slice(0, limit)
    .map((p: any) => ({
      id: p.id,
      plotNumber: p.plotNumber,
      location: {
        blockName: blocks.find((b: any) => b.id === p.blockId)?.name ?? "",
        sectionName:
          sections.find((s: any) => s.id === p.sectionId)?.name ?? "",
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
