import { USE_REAL_BACKEND, proxyFetch } from "../../../config";
import { plots } from "../../../mock-data";

/**
 * GET /api/v1/plots/search
 * Returns plots filtered by query parameters.
 */
export async function GET(req: Request) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, "/plots/search");
  }
  const url = new URL(req.url);
  const cemeteryId = url.searchParams.get("cemeteryId");
  const plotNumber = url.searchParams.get("plotNumber");
  const plotType = url.searchParams.get("plotType");
  const status = url.searchParams.get("status");
  let list = plots;
  if (cemeteryId) list = list.filter((p) => p.cemeteryId === cemeteryId);
  if (plotNumber) list = list.filter((p) => p.plotNumber.includes(plotNumber));
  if (plotType) list = list.filter((p) => p.plotType === plotType);
  if (status) list = list.filter((p) => p.occupationStatus === status);
  return Response.json({ data: list });
}
