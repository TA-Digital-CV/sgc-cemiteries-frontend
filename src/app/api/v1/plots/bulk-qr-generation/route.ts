import { USE_REAL_BACKEND, proxyFetch } from "../../../config";

/**
 * POST /api/v1/plots/bulk-qr-generation
 * Generates QR codes in batch for plots.
 */
export async function POST(req: Request) {
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, "/plots/bulk-qr-generation", { body });
  }
  const payload = await req.json().catch(() => ({ plotIds: [] }));
  const ids: string[] = Array.isArray(payload.plotIds) ? payload.plotIds : [];
  const results = ids.map((id) => ({ id, qrCode: `QR_${id}_${Date.now()}` }));
  return Response.json({ data: results });
}
