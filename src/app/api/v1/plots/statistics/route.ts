import { proxyFetch, USE_REAL_BACKEND } from "../../../config";
import { plots } from "../../../mock-data";

/**
 * GET /api/v1/plots/statistics
 * Returns plot statistics overview.
 */
export async function GET(req: Request) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, "/plots/statistics");
  }
  const totalPlots = plots.length;
  const availablePlots = plots.filter(
    (p) => p.occupationStatus === "AVAILABLE",
  ).length;
  const occupiedPlots = plots.filter(
    (p) => p.occupationStatus === "OCCUPIED",
  ).length;
  const reservedPlots = plots.filter(
    (p) => p.occupationStatus === "RESERVED",
  ).length;
  const maintenancePlots = plots.filter(
    (p) => p.occupationStatus === "MAINTENANCE",
  ).length;
  const occupancyRate = totalPlots
    ? Number(((occupiedPlots / totalPlots) * 100).toFixed(2))
    : 0;
  return Response.json({
    data: {
      totalPlots,
      availablePlots,
      occupiedPlots,
      reservedPlots,
      maintenancePlots,
      byType: {
        GROUND: plots.filter((p) => p.plotType === "GROUND").length,
        MAUSOLEUM: plots.filter((p) => p.plotType === "MAUSOLEUM").length,
        NICHE: plots.filter((p) => p.plotType === "NICHE").length,
        OSSUARY: plots.filter((p) => p.plotType === "OSSUARY").length,
      },
      byStatus: {
        AVAILABLE: availablePlots,
        OCCUPIED: occupiedPlots,
        RESERVED: reservedPlots,
        MAINTENANCE: maintenancePlots,
      },
      occupancyRate,
      lastUpdated: new Date().toISOString(),
    },
  });
}
