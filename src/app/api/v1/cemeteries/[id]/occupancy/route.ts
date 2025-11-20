import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { blocks, plots } from "../../../../mock-data";

/**
 * GET /api/v1/cemeteries/{id}/occupancy
 * Returns occupancy metrics overview and breakdowns.
 */
/**
 * GET /api/v1/cemeteries/{id}/occupancy
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/cemeteries/${id}/occupancy`);
  }
  const cp = plots.filter((p) => p.cemeteryId === id);
  const totalPlots = cp.length;
  const occupiedPlots = cp.filter(
    (p) => p.occupationStatus === "OCCUPIED",
  ).length;
  const reservedPlots = cp.filter(
    (p) => p.occupationStatus === "RESERVED",
  ).length;
  const availablePlots = cp.filter(
    (p) => p.occupationStatus === "AVAILABLE",
  ).length;
  const maintenancePlots = cp.filter(
    (p) => p.occupationStatus === "MAINTENANCE",
  ).length;
  const occupancyRate = totalPlots
    ? Number(((occupiedPlots / totalPlots) * 100).toFixed(2))
    : 0;
  const byBlocks = blocks
    .filter((b) => b.cemeteryId === id)
    .map((b) => {
      const bp = cp.filter((p) => p.blockId === b.id);
      const occ = bp.filter((p) => p.occupationStatus === "OCCUPIED").length;
      const av = bp.filter((p) => p.occupationStatus === "AVAILABLE").length;
      const resv = bp.filter((p) => p.occupationStatus === "RESERVED").length;
      const rate = bp.length ? Number(((occ / bp.length) * 100).toFixed(2)) : 0;
      return {
        blockId: b.id,
        blockName: b.name,
        totalPlots: bp.length,
        occupiedPlots: occ,
        reservedPlots: resv,
        availablePlots: av,
        occupancyRate: rate,
        status:
          rate >= 75
            ? "HIGH_OCCUPANCY"
            : rate >= 50
              ? "MEDIUM_OCCUPANCY"
              : "LOW_OCCUPANCY",
      };
    });
  return Response.json({
    cemeteryId: id,
    overall: {
      totalPlots,
      occupiedPlots,
      reservedPlots,
      availablePlots,
      maintenancePlots,
      occupancyRate,
      utilizationRate: occupancyRate,
    },
    byBlocks,
    lastUpdated: new Date().toISOString(),
  });
}
