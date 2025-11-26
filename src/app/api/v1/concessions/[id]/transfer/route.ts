import type { NextRequest } from "next/server";
import {
  errorResponse,
  proxyFetch,
  USE_REAL_BACKEND,
} from "../../../../config";

/**
 * POST /api/v1/concessions/{id}/transfer
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, `/concessions/${id}/transfer`, {
    method: "POST",
    body,
  });
}
