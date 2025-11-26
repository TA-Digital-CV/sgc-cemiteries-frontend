import type { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, proxyFetch, USE_REAL_BACKEND } from "../../config";

/**
 * GET/POST /api/v1/work-orders
 */
export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, "/work-orders");
}

export async function POST(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const json = await request.json().catch(() => null);
  const schema = z.object({
    type: z.string().min(1),
    priority: z.string().min(1),
    description: z.string().min(1),
    scheduledDate: z.string().min(1),
    plotId: z.union([z.string(), z.number()]),
    teamId: z.union([z.string(), z.number()]),
    estimatedDuration: z.number().min(1),
  });
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(
      "VALIDATION_ERROR",
      "Invalid work order payload",
      422,
      parsed.error.flatten(),
    );
  }
  return proxyFetch(request, "/work-orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
}
