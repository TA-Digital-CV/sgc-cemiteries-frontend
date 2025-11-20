import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../config";
import { blocks } from "../../../mock-data";

/**
 * PUT /api/v1/cemetery-blocks/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const body = await request.text();
    return proxyFetch(request, `/cemetery-blocks/${id}`, { body });
  }
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Bloco não encontrado" },
      { status: 404 },
    );
  }
  const payload = await request.json().catch(() => ({}));
  const updated = {
    ...blocks[idx],
    ...payload,
    lastModifiedDate: new Date().toISOString(),
  };
  blocks[idx] = updated as (typeof blocks)[number];
  return Response.json(updated);
}
