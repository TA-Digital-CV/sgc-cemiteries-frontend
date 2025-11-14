import { USE_REAL_BACKEND } from "../../config";
import { sections } from "../../mock-data";

export async function POST(req: Request) {
  if (USE_REAL_BACKEND) {
    const base = process.env.IGRP_APP_MANAGER_API || "";
    if (!base) {
      return new Response(
        "Error: Serviço indisponível - variável IGRP_APP_MANAGER_API ausente",
        { status: 500 },
      );
    }
    const body = await req.text();
    const res = await fetch(`${base}/cemetery-sections`, {
      method: "POST",
      headers: {
        "content-type": req.headers.get("content-type") ?? "application/json",
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
  const payload = await req.json().catch(() => ({}));
  const item = {
    id: crypto.randomUUID(),
    cemeteryId: payload.cemeteryId,
    blockId: payload.blockId,
    name: payload.name,
    description: payload.description ?? null,
    maxCapacity: payload.maxCapacity ?? 0,
    currentOccupancy: 0,
    occupancyRate: 0,
    status: "ACTIVE",
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  };
  sections.push(item as (typeof sections)[number]);
  return Response.json(item, { status: 201 });
}
