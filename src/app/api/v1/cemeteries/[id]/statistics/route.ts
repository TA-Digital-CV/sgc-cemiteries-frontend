import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { plots } from "../../../../mock-data";

/**
 * GET /api/v1/cemeteries/{id}/statistics
 * Returns occupancy statistics and distributions.
 */
/**
 * GET /api/v1/cemeteries/{id}/statistics
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/cemeteries/${id}/statistics`);
  }
  const cp = plots.filter((p) => p.cemeteryId === id);
  const totalPlots = cp.length;
  const occupiedPlots = cp.filter(
    (p) => p.occupationStatus === "OCCUPIED",
  ).length;
  const availablePlots = cp.filter(
    (p) => p.occupationStatus === "AVAILABLE",
  ).length;
  const reservedPlots = cp.filter(
    (p) => p.occupationStatus === "RESERVED",
  ).length;
  const occupancyRate = totalPlots
    ? Number(((occupiedPlots / totalPlots) * 100).toFixed(2))
    : 0;
  return Response.json({
    cemeteryId: id,
    period: request.nextUrl.searchParams.get("period") ?? "MONTHLY",
    occupancyStats: {
      totalPlots,
      occupiedPlots,
      availablePlots,
      occupancyRate,
      reservedPlots,
    },
    plotTypeDistribution: {
      GROUND: cp.filter((p) => p.plotType === "GROUND").length,
      MAUSOLEUM: cp.filter((p) => p.plotType === "MAUSOLEUM").length,
      NICHE: cp.filter((p) => p.plotType === "NICHE").length,
      OSSUARY: cp.filter((p) => p.plotType === "OSSUARY").length,
    },
    monthlyTrends: [],
    capacityProjection: {
      estimatedFullCapacityDate: null,
      monthsRemaining: null,
      averageMonthlyOccupation: 0,
    },
  });
}
