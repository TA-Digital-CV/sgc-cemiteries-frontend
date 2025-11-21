import { USE_REAL_BACKEND, proxyFetch } from "../../config";
import { sections } from "../../mock-data";

export async function POST(req: Request) {
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, "/cemetery-sections", { method: "POST", body });
  }
  const payload = await req.json().catch(() => ({}));
  const item = {
    id: crypto.randomUUID(),
    cemeteryId: payload.cemeteryId,
    blockId: payload.blockId,
    name: payload.name,
    description: payload.description ?? null,
    maxCapacity: payload.maxCapacity ?? 0,
    currentOccupancy: 0,
    occupancyRate: 0,
    status: "ACTIVE",
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  };
  sections.push(item as (typeof sections)[number]);
  return Response.json(item, { status: 201 });
}
