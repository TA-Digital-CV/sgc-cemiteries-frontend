import type { NextRequest } from "next/server";
import {
  errorResponse,
  MUNICIPALITY_ID,
  proxyFetch,
  USE_REAL_BACKEND,
} from "../../config";

/**
 * GET /api/v1/fee-tables
 * Appends municipalityId from environment when missing.
 */
export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const hasMun = Boolean(request.nextUrl.searchParams.get("municipalityId"));
  if (!hasMun && MUNICIPALITY_ID) {
    return proxyFetch(
      request,
      `/fee-tables?municipalityId=${encodeURIComponent(MUNICIPALITY_ID)}`,
    );
  }
  return proxyFetch(request, "/fee-tables");
}

export async function POST(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, "/fee-tables", { method: "POST", body });
}
