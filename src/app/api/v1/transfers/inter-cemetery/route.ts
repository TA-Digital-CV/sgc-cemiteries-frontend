import type { NextRequest } from "next/server";
import {
  proxyFetch,
  USE_REAL_BACKEND,
  errorResponse,
} from "../../../config";

export async function POST(request: NextRequest) {
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  const body = await request.text();
  return proxyFetch(request, "/transfers/inter-cemetery", {
    method: "POST",
    body,
  });
}
