import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../config";
import { sections } from "../../../mock-data";

/**
 * PUT /api/v1/cemetery-sections/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const body = await request.text();
    return proxyFetch(request, `/cemetery-sections/${id}`, { body });
  }
  const idx = sections.findIndex((s) => s.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Secção não encontrado" },
      { status: 404 },
    );
  }
  const payload = await request.json().catch(() => ({}));
  const updated = {
    ...sections[idx],
    ...payload,
    lastModifiedDate: new Date().toISOString(),
  };
  sections[idx] = updated as (typeof sections)[number];
  return Response.json(updated);
}

/**
 * GET /api/v1/cemetery-sections/{id}
 * Returns a section by id. Mock reads from local dataset.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(_request, `/cemetery-sections/${id}`);
  }
  const section = sections.find((s) => s.id === id);
  if (!section) {
    return Response.json(
      { error: "NOT_FOUND", message: "Secção não encontrado" },
      { status: 404 },
    );
  }
  return Response.json(section);
}
