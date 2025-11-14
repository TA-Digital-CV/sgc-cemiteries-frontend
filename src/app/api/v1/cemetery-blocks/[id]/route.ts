import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../config";
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
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const body = await request.text();
    const res = await fetch(`${base}/cemetery-blocks/${id}`, {
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
  const idx = blocks.findIndex((b: any) => b.id === id);
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
