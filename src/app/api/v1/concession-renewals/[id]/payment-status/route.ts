import type { NextRequest } from "next/server";
import {
  errorResponse,
  proxyFetch,
  USE_REAL_BACKEND,
} from "../../../../config";

/**
 * PUT /api/v1/concession-renewals/{id}/payment-status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, `/concession-renewals/${id}/payment-status`, {
    method: "PUT",
    body,
  });
}
