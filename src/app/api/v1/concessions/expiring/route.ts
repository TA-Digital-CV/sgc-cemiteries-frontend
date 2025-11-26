import type { NextRequest } from "next/server";
import { errorResponse, proxyFetch, USE_REAL_BACKEND } from "../../../config";

/**
 * GET /api/v1/concessions/expiring
 */
export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, "/concessions/expiring");
}
