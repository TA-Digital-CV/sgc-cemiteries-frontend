import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const res = await fetch(`${base}/plots/${id}/qr-code`, { method: "GET" });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  }
  const item = plots.find((p: any) => p.id === id);
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
