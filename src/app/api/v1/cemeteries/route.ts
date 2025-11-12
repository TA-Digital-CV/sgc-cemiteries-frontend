import { USE_REAL_BACKEND, proxyFetch } from "../../config";
import { cemeteries, pageable } from "../../mock-data";

/**
 * GET /api/v1/cemeteries
 * Returns paginated cemetery list with optional filters.
 */
export async function GET(req: Request) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, "/cemeteries");
  }
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? 0);
  const size = Number(url.searchParams.get("size") ?? 10);
  const status = url.searchParams.get("status");
  const name = url.searchParams.get("name");
  let list = cemeteries;
  if (status) list = list.filter((c) => c.status === status);
  if (name)
    list = list.filter((c) =>
      c.name.toLowerCase().includes(name.toLowerCase()),
    );
  const p = pageable(list, page, size);
  return Response.json({ ...p });
}

/**
 * POST /api/v1/cemeteries
 * Creates a new cemetery (mock).
 */
export async function POST(req: Request) {
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, "/cemeteries", { body });
  }
  const data = await req.json().catch(() => ({}));
  const item = {
    id: crypto.randomUUID(),
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    occupancyRate: 0,
    currentOccupancy: 0,
    status: "ACTIVE",
    ...data,
  };
  cemeteries.push(item);
  return Response.json({ data: { cemetery: item } }, { status: 201 });
}
