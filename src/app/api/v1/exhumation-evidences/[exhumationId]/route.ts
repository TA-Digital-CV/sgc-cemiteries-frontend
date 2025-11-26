import type { NextRequest } from "next/server";
import { errorResponse, proxyFetch, USE_REAL_BACKEND } from "../../../config";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ exhumationId: string }> },
) {
  const { exhumationId } = await params;
  if (!USE_REAL_BACKEND)
    return errorResponse("SERVICE_UNAVAILABLE", "Real backend disabled", 503);
  return proxyFetch(request, `/exhumation-evidences/${exhumationId}`, {
    method: "POST",
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "multipart/form-data",
    },
    body: request.body ?? undefined,
  });
}
