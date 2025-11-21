import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND, errorResponse } from "../../../config";

/**
 * GET/PUT /api/v1/concession-requests/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, `/concession-requests/${id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, `/concession-requests/${id}`, {
    method: "PUT",
    body,
  });
}
