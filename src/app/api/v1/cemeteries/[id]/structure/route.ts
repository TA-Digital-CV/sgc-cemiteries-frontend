import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../../config";
import { blocks, cemeteries, sections } from "../../../../mock-data";

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
    return proxyFetch(request, `/cemeteries/${id}/structure`);
  }
  const cemetery = cemeteries.find((c) => c.id === id);
  if (!cemetery) {
    return Response.json(
      { error: "NOT_FOUND", message: "Cemitério não encontrado" },
      { status: 404 },
    );
  }
  const includeInactive =
    (request.nextUrl.searchParams.get("includeInactive") ?? "false") === "true";
  const _level = request.nextUrl.searchParams.get("level") ?? "SECTIONS";
  const resBlocks = blocks.filter(
    (b) => b.cemeteryId === id && (includeInactive || b.status === "ACTIVE"),
  );
  const resSections = sections.filter(
    (s) => s.cemeteryId === id && (includeInactive || s.status === "ACTIVE"),
  );
  const structure = {
    blocks: resBlocks.map((b) => ({
      ...b,
      sections: resSections.filter((s) => s.blockId === b.id),
    })),
  };
  const summary = {
    totalBlocks: resBlocks.length,
    activeBlocks: resBlocks.filter((b) => b.status === "ACTIVE").length,
    totalSections: resSections.length,
    activeSections: resSections.filter((s) => s.status === "ACTIVE").length,
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
