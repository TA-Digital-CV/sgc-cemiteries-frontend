import { USE_REAL_BACKEND, proxyFetch } from "../../config";
import { plots, pageable } from "../../mock-data";

/**
 * GET /api/v1/plots
 * Returns paginated plot list.
 */
export async function GET(req: Request) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, "/plots");
  }
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? 0);
  const size = Number(url.searchParams.get("size") ?? 10);
  const p = pageable(plots, page, size);
  return Response.json({ data: p.content, pageable: p.pageable });
}

/**
 * POST /api/v1/plots
 * Creates a new plot (mock).
 */
export async function POST(req: Request) {
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, "/plots", { body });
  }
  const data = await req.json().catch(() => ({}));
  const item = {
    id: crypto.randomUUID(),
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    occupationStatus: "AVAILABLE",
    ...data,
  };
  plots.push(item);
  return Response.json({ data: item }, { status: 201 });
}
