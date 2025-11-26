import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../config";

// Importar mock data do route pai (em produção, usar banco de dados)
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
 * GET /api/v1/operations/[id]
 * Busca operação por ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, `/operations/${id}`);
  }

  const operation = mockOperations.find((op) => op.id === id);

  if (!operation) {
    return Response.json(
      {
        error: "Operation not found",
        message: `Operation with ID ${id} not found`,
      },
      { status: 404 },
    );
  }

  return Response.json(
    { data: operation },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * PUT /api/v1/operations/[id]
 * Atualiza operação completa
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, `/operations/${id}`, {
      method: "PUT",
      body,
    });
  }

  try {
    const data = await req.json();
    const index = mockOperations.findIndex((op) => op.id === id);

    if (index === -1) {
      return Response.json(
        {
          error: "Operation not found",
          message: `Operation with ID ${id} not found`,
        },
        { status: 404 },
      );
    }

    mockOperations[index] = {
      ...mockOperations[index],
      ...data,
      id,
      lastModifiedDate: new Date().toISOString(),
    };

    return Response.json(
      { data: mockOperations[index] },
      {
        status: 200,
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

/**
 * PATCH /api/v1/operations/[id]/status
 * Atualiza apenas o status da operação
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, `/operations/${id}/status`, {
      method: "PATCH",
      body,
    });
  }

  try {
    const { status } = await req.json();

    if (!status) {
      return Response.json(
        { error: "Invalid request", message: "Status is required" },
        { status: 400 },
      );
    }

    const index = mockOperations.findIndex((op) => op.id === id);

    if (index === -1) {
      return Response.json(
        {
          error: "Operation not found",
          message: `Operation with ID ${id} not found`,
        },
        { status: 404 },
      );
    }

    mockOperations[index] = {
      ...mockOperations[index],
      status,
      lastModifiedDate: new Date().toISOString(),
    };

    return Response.json(
      { data: mockOperations[index] },
      {
        status: 200,
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

/**
 * DELETE /api/v1/operations/[id]
 * Remove operação
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, `/operations/${id}`, {
      method: "DELETE",
    });
  }

  const index = mockOperations.findIndex((op) => op.id === id);

  if (index === -1) {
    return Response.json(
      {
        error: "Operation not found",
        message: `Operation with ID ${id} not found`,
      },
      { status: 404 },
    );
  }

  mockOperations.splice(index, 1);

  return Response.json(
    { message: "Operation deleted successfully" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
