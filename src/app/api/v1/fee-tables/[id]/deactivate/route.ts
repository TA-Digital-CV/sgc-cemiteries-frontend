import type { NextRequest } from "next/server";
import {
  proxyFetch,
  USE_REAL_BACKEND,
  errorResponse,
} from "../../../../config";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, `/fee-tables/${id}/deactivate`, {
    method: "PUT",
    body,
  });
}
