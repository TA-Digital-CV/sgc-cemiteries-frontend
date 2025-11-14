import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../config";
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const body = await request.text();
    const res = await fetch(`${base}/cemetery-sections/${id}`, {
      method: "PUT",
      headers: {
        "content-type":
          request.headers.get("content-type") ?? "application/json",
      },
      body,
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  }
  const idx = sections.findIndex((s: any) => s.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Setor não encontrado" },
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const res = await fetch(`${base}/cemetery-sections/${id}`, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  }
  const section = sections.find((s: any) => s.id === id);
  if (!section) {
    return Response.json(
      { error: "NOT_FOUND", message: "Setor não encontrado" },
      { status: 404 },
    );
  }
  return Response.json(section);
}
