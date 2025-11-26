import type { NextRequest } from "next/server";
import {
  errorResponse,
  proxyFetch,
  USE_REAL_BACKEND,
} from "../../../../config";

/**
 * POST /api/v1/work-orders/{id}/evidences (multipart/form-data)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, `/work-orders/${id}/evidences`, {
    method: "POST",
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "multipart/form-data",
    },
    body: request.body ?? undefined,
  });
}
