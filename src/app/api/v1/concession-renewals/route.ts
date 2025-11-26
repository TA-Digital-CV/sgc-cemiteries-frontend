import type { NextRequest } from "next/server";
import { errorResponse, proxyFetch, USE_REAL_BACKEND } from "../../config";

/**
 * GET/POST /api/v1/concession-renewals
 */
export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, "/concession-renewals");
}

export async function POST(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, "/concession-renewals", { method: "POST", body });
}
