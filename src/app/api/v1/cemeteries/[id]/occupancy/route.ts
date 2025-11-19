import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const res = await fetch(`${base}/cemeteries/${id}/occupancy`, {
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
  const reservedPlots = cp.filter(
    (p: any) => p.occupationStatus === "RESERVED",
  ).length;
  const availablePlots = cp.filter(
    (p: any) => p.occupationStatus === "AVAILABLE",
  ).length;
  const maintenancePlots = cp.filter(
    (p: any) => p.occupationStatus === "MAINTENANCE",
  ).length;
  const occupancyRate = totalPlots
    ? Number(((occupiedPlots / totalPlots) * 100).toFixed(2))
    : 0;
  const byBlocks = blocks
    .filter((b: any) => b.cemeteryId === id)
    .map((b: any) => {
      const bp = cp.filter((p: any) => p.blockId === b.id);
      const occ = bp.filter(
        (p: any) => p.occupationStatus === "OCCUPIED",
      ).length;
      const av = bp.filter(
        (p: any) => p.occupationStatus === "AVAILABLE",
      ).length;
      const resv = bp.filter(
        (p: any) => p.occupationStatus === "RESERVED",
      ).length;
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
