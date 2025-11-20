import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { plots } from "../../../../mock-data";

/**
 * GET /api/v1/plots/{id}/qr-code
 * Returns QR code string for a plot.
 */
/**
 * GET /api/v1/plots/{id}/qr-code
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(request, `/plots/${id}/qr-code`);
  }
  const item = plots.find((p) => p.id === id);
  if (!item) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  return Response.json({
    plotId: id,
    qrCode: item.qrCode ?? `QR_${id}_${new Date().getFullYear()}`,
  });
}
