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
  const blockId = url.searchParams.get("blockId");
  const sectionId = url.searchParams.get("sectionId");
  const plotNumber = url.searchParams.get("plotNumber");
  const plotType = url.searchParams.get("plotType");
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q");
  const nearPoint = url.searchParams.get("nearPoint");
  const radius = Number(url.searchParams.get("radius") ?? 100);
  const availableOnly =
    (url.searchParams.get("availableOnly") ?? "false") === "true";
  const plotTypes = (url.searchParams.get("plotTypes") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  const minDimensions = url.searchParams.get("minDimensions");

  let list: any[] = plots;
  if (cemeteryId) list = list.filter((p: any) => p.cemeteryId === cemeteryId);
  if (blockId) list = list.filter((p: any) => p.blockId === blockId);
  if (sectionId) list = list.filter((p: any) => p.sectionId === sectionId);
  if (plotNumber)
    list = list.filter((p: any) => p.plotNumber.includes(plotNumber));
  if (plotType) list = list.filter((p: any) => p.plotType === plotType);
  if (status) list = list.filter((p: any) => p.occupationStatus === status);
  if (q)
    list = list.filter(
      (p: any) =>
        (p.notes ?? "").toLowerCase().includes(q.toLowerCase()) ||
        p.plotNumber.includes(q),
    );
  if (availableOnly)
    list = list.filter((p: any) => p.occupationStatus === "AVAILABLE");
  if (plotTypes.length)
    list = list.filter((p: any) => plotTypes.includes(p.plotType));
  if (minDimensions) {
    const [lenStr, widStr] = minDimensions.split(",");
    const minLen = Number(lenStr ?? 0);
    const minWid = Number(widStr ?? 0);
    list = list.filter((p: any) => {
      const d = p.dimensions || {};
      return Number(d.length ?? 0) >= minLen && Number(d.width ?? 0) >= minWid;
    });
  }
  if (nearPoint) {
    const [latStr, lngStr] = nearPoint.split(",");
    const lat = Number(latStr);
    const lng = Number(lngStr);
    const toRad = (v: number) => (v * Math.PI) / 180;
    const dist = (la1: number, lo1: number, la2: number, lo2: number) => {
      const R = 6371000;
      const dLat = toRad(la2 - la1);
      const dLng = toRad(lo2 - lo1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    list = list.filter((p: any) => {
      const gp = p.geoPoint;
      if (!gp) return false;
      return dist(lat, lng, gp.latitude, gp.longitude) <= radius;
    });
  }
  return Response.json({ data: list });
}
