import type { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, proxyFetch, USE_REAL_BACKEND } from "../../config";

/**
 * GET /api/v1/concessions
 * POST /api/v1/concessions
 */
export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND) {
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  }
  return proxyFetch(request, "/concessions");
}

export async function POST(request: NextRequest) {
  if (!USE_REAL_BACKEND) {
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  }
  const json = await request.json().catch(() => null);
  const schema = z.object({
    plotId: z.union([z.string(), z.number()]),
    personId: z.union([z.string(), z.number()]),
    concessionTypeId: z.union([z.string(), z.number()]),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    value: z.number(),
    status: z.string().min(1),
  });
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(
      "VALIDATION_ERROR",
      "Invalid concession payload",
      422,
      parsed.error.flatten(),
    );
  }
  return proxyFetch(request, "/concessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
}
