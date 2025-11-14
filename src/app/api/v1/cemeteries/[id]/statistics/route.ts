import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const res = await fetch(`${base}/cemeteries/${id}/statistics`, {
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
  const cp = plots.filter((p: any) => p.cemeteryId === id);
  const totalPlots = cp.length;
  const occupiedPlots = cp.filter(
    (p: any) => p.occupationStatus === "OCCUPIED",
  ).length;
  const availablePlots = cp.filter(
    (p: any) => p.occupationStatus === "AVAILABLE",
  ).length;
  const reservedPlots = cp.filter(
    (p: any) => p.occupationStatus === "RESERVED",
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
      GROUND: cp.filter((p: any) => p.plotType === "GROUND").length,
      MAUSOLEUM: cp.filter((p: any) => p.plotType === "MAUSOLEUM").length,
      NICHE: cp.filter((p: any) => p.plotType === "NICHE").length,
      OSSUARY: cp.filter((p: any) => p.plotType === "OSSUARY").length,
    },
    monthlyTrends: [],
    capacityProjection: {
      estimatedFullCapacityDate: null,
      monthsRemaining: null,
      averageMonthlyOccupation: 0,
    },
  });
}
