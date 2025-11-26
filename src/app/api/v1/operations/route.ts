import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../config";

// Mock data para operações
const mockOperations = [
  {
    id: "op-001",
    number: "OP-2025-001",
    type: "INHUMATION",
    status: "COMPLETED",
    cemeteryId: "cem-001",
    plotId: "plot-001",
    scheduledDate: "2025-11-20T10:00:00Z",
    completedDate: "2025-11-20T11:30:00Z",
    teamId: "team-001",
    responsibleName: "João Silva",
    deceasedName: "Maria Santos",
    notes: "Operação realizada sem intercorrências",
    createdDate: "2025-11-15T08:00:00Z",
    lastModifiedDate: "2025-11-20T11:30:00Z",
  },
  {
    id: "op-002",
    number: "OP-2025-002",
    type: "EXHUMATION",
    status: "SCHEDULED",
    cemeteryId: "cem-001",
    plotId: "plot-002",
    scheduledDate: "2025-11-25T14:00:00Z",
    teamId: "team-002",
    responsibleName: "Pedro Costa",
    deceasedName: "António Ferreira",
    notes: "Exumação programada após período legal",
    createdDate: "2025-11-18T10:00:00Z",
    lastModifiedDate: "2025-11-18T10:00:00Z",
  },
  {
    id: "op-003",
    number: "OP-2025-003",
    type: "TRANSFER",
    status: "IN_PROGRESS",
    cemeteryId: "cem-002",
    plotId: "plot-003",
    scheduledDate: "2025-11-24T09:00:00Z",
    teamId: "team-001",
    responsibleName: "João Silva",
    deceasedName: "José Oliveira",
    notes: "Trasladação para outro cemitério",
    createdDate: "2025-11-20T15:00:00Z",
    lastModifiedDate: "2025-11-24T09:15:00Z",
  },
];

/**
 * GET /api/v1/operations
 * Lista operações com filtros opcionais
 */
export async function GET(req: NextRequest) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, "/operations");
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const cemeteryId = searchParams.get("cemeteryId");
  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);

  let filtered = [...mockOperations];

  if (status) {
    filtered = filtered.filter((op) => op.status === status);
  }
  if (type) {
    filtered = filtered.filter((op) => op.type === type);
  }
  if (cemeteryId) {
    filtered = filtered.filter((op) => op.cemeteryId === cemeteryId);
  }

  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end);

  return Response.json(
    {
      content,
      pageable: {
        page,
        size,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
      },
    },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * POST /api/v1/operations
 * Cria nova operação
 */
export async function POST(req: NextRequest) {
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, "/operations", { body });
  }

  try {
    const data = await req.json();

    const newOperation = {
      id: `op-${Date.now()}`,
      ...data,
      status: data.status || "SCHEDULED",
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
    };

    mockOperations.push(newOperation);

    return Response.json(
      { data: newOperation },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return Response.json(
      {
        error: "Invalid request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
