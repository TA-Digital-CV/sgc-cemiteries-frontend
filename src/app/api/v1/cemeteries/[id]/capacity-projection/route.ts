import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { cemeteries, plots } from "../../../../mock-data";

/**
 * GET /api/v1/cemeteries/{id}/capacity-projection
 * Returns capacity projection payload with parameters and projections.
 */
/**
 * GET /api/v1/cemeteries/{id}/capacity-projection
 * Proxy to backend using IGRP_APP_MANAGER_API. No mock data.
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
      `/cemeteries/${id}/capacity-projection${search ? `?${search}` : ""}`,
    );
  }
  const cemetery = cemeteries.find((c) => c.id === id);
  const cp = plots.filter((p) => p.cemeteryId === id);
  const currentOccupancy = cp.filter(
    (p) => p.occupationStatus === "OCCUPIED",
  ).length;
  const totalCapacity = (cemetery?.maxCapacity ?? cp.length) || 0;
  const availableCapacity = Math.max(0, totalCapacity - currentOccupancy);
  const averageMonthlyOccupations = 8.5;
  const monthsToFullCapacity =
    availableCapacity && averageMonthlyOccupations
      ? Math.ceil(availableCapacity / averageMonthlyOccupations)
      : null;
  return Response.json({
    cemeteryId: id,
    projectionParameters: {
      projectionPeriod: Number(
        request.nextUrl.searchParams.get("projectionPeriod") ?? 36,
      ),
      historicalPeriod: Number(
        request.nextUrl.searchParams.get("historicalPeriod") ?? 24,
      ),
      confidenceLevel: Number(
        request.nextUrl.searchParams.get("confidenceLevel") ?? 0.95,
      ),
      includeSeasonality:
        (request.nextUrl.searchParams.get("includeSeasonality") ?? "true") ===
        "true",
    },
    currentStatus: {
      totalCapacity,
      currentOccupancy,
      availableCapacity,
      occupancyRate: totalCapacity
        ? Number(((currentOccupancy / totalCapacity) * 100).toFixed(2))
        : 0,
    },
    historicalTrends: {
      averageMonthlyOccupations,
      seasonalityFactor: 1,
      trendDirection: "STABLE",
      growthRate: 0,
    },
    projections: {
      estimatedFullCapacityDate: null,
      monthsToFullCapacity,
      confidenceInterval: { lower: null, upper: null },
    },
    monthlyProjections: [],
    recommendations: [],
    generatedAt: new Date().toISOString(),
  });
}
