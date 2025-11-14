import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../../config";
import { cemeteries, blocks, sections } from "../../../../mock-data";

/**
 * GET /api/v1/cemeteries/{id}/structure
 * Returns hierarchical structure: blocks, sections and plots.
 */
/**
 * GET /api/v1/cemeteries/{id}/structure
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function GET(
  request: NextRequest,
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
    const res = await fetch(`${base}/cemeteries/${id}/structure`, {
      method: "GET",
      headers: { accept: request.headers.get("accept") ?? "application/json" },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  }
  const cemetery = cemeteries.find((c: any) => c.id === id);
  if (!cemetery) {
    return Response.json(
      { error: "NOT_FOUND", message: "Cemitério não encontrado" },
      { status: 404 },
    );
  }
  const includeInactive =
    (request.nextUrl.searchParams.get("includeInactive") ?? "false") === "true";
  const level = request.nextUrl.searchParams.get("level") ?? "SECTIONS";
  const resBlocks = blocks.filter(
    (b: any) =>
      b.cemeteryId === id && (includeInactive || b.status === "ACTIVE"),
  );
  const resSections = sections.filter(
    (s: any) =>
      s.cemeteryId === id && (includeInactive || s.status === "ACTIVE"),
  );
  const structure = {
    blocks: resBlocks.map((b: any) => ({
      ...b,
      sections: resSections.filter((s: any) => s.blockId === b.id),
    })),
  };
  const summary = {
    totalBlocks: resBlocks.length,
    activeBlocks: resBlocks.filter((b: any) => b.status === "ACTIVE").length,
    totalSections: resSections.length,
    activeSections: resSections.filter((s: any) => s.status === "ACTIVE")
      .length,
    totalPlots: 0,
    occupiedPlots: 0,
  };
  return Response.json({
    cemeteryId: cemetery.id,
    cemeteryName: cemetery.name,
    structure,
    summary,
  });
}
