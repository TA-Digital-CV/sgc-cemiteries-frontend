import type { NextRequest } from "next/server";
import {
  proxyFetch,
  USE_REAL_BACKEND,
  errorResponse,
} from "../../../config";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ burialId: string }> },
) {
  const { burialId } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, `/burial-evidences/${burialId}`, {
    method: "POST",
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "multipart/form-data",
    },
    body: request.body ?? undefined,
  });
}
