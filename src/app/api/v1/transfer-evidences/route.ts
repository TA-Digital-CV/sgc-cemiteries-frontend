import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND, errorResponse } from "../../config";

export async function GET(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, "/transfer-evidences");
}

export async function POST(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, "/transfer-evidences", {
    method: "POST",
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "multipart/form-data",
    },
    body: request.body ?? undefined,
  });
}
