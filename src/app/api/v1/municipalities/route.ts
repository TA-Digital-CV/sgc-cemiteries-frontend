import type { NextRequest } from "next/server";
import { errorResponse, proxyFetch, USE_REAL_BACKEND } from "../../config";

/**
 * GET /api/v1/municipalities
 * Returns the list of municipalities as JSON. Proxies to real backend when enabled.
 */
export async function GET(request: NextRequest) {
  const accept = (request.headers.get("accept") || "").toLowerCase();
  if (accept && !accept.includes("application/json") && accept !== "*/*") {
    return errorResponse(
      "NOT_ACCEPTABLE",
      "Only 'application/json' is supported",
      406,
    );
  }

  if (!USE_REAL_BACKEND) {
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  }

  return proxyFetch(request, "/municipalities");
}
