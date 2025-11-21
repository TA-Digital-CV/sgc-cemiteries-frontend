import type { NextRequest } from "next/server";
import {
  proxyFetch,
  USE_REAL_BACKEND,
  errorResponse,
} from "../../../config";

/**
 * GET /api/v1/work-orders/pending
 */
export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, "/work-orders/pending");
}
