import type { NextRequest } from "next/server";
import {
  proxyFetchToBase,
  REAL_API_BASE,
  USE_REAL_BACKEND,
  errorResponse,
} from "../../config";

/**
 * GET /api/enums/{name}
 * Proxies enum values from backend.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!name) {
    return errorResponse("INVALID_ENUM", "Enum name is required", 400);
  }
  if (!USE_REAL_BACKEND) {
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  }
  return proxyFetchToBase(request, REAL_API_BASE, `/api/enums/${name}`);
}
