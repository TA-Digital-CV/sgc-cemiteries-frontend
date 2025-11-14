import type { NextRequest } from "next/server";
import { USE_REAL_BACKEND } from "../../../config";
import { plots } from "../../../mock-data";

/**
 * GET /api/v1/plots/{id}
 * Returns plot details.
 */
/**
 * GET /api/v1/plots/{id}
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
    const res = await fetch(`${base}/plots/${id}`, {
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
  const item = plots.find((p: any) => p.id === id);
  if (!item) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  return Response.json(item);
}

/**
 * PUT /api/v1/plots/{id}
 * Updates plot data.
 */
/**
 * PUT /api/v1/plots/{id}
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
    const res = await fetch(`${base}/plots/${id}`, {
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
  const idx = plots.findIndex((p: any) => p.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  const payload = await request.json().catch(() => ({}));
  const updated = {
    ...plots[idx],
    ...payload,
    lastModifiedDate: new Date().toISOString(),
  };
  plots[idx] = updated as (typeof plots)[number];
  return Response.json(updated);
}

/**
 * DELETE /api/v1/plots/{id}
 * Removes the plot.
 */
/**
 * DELETE /api/v1/plots/{id}
 * Proxy to backend using IGRP_APP_MANAGER_API.
 */
export async function DELETE(
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
    const res = await fetch(`${base}/plots/${id}`, { method: "DELETE" });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  }
  const idx = plots.findIndex((p: any) => p.id === id);
  if (idx === -1) {
    return Response.json(
      { error: "NOT_FOUND", message: "Sepultura não encontrada" },
      { status: 404 },
    );
  }
  const status = plots[idx].occupationStatus;
  if (status !== "AVAILABLE") {
    return Response.json(
      {
        error: "CANNOT_DELETE",
        message: "Apenas sepulturas disponíveis podem ser removidas",
      },
      { status: 400 },
    );
  }
  plots.splice(idx, 1);
  return Response.json({ deleted: true });
}
