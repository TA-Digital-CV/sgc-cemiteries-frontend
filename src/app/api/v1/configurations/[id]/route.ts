import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../../config";

// Mock data (compartilhado com route pai)
const mockConfigurations = [
  {
    id: "config-001",
    scope: "SYSTEM",
    targetId: null,
    key: "operation.default.duration",
    value: 120,
    dataType: "NUMBER",
    description: "Duração padrão de operações em minutos",
    createdDate: "2025-01-01T00:00:00Z",
    lastModifiedDate: "2025-01-01T00:00:00Z",
  },
  {
    id: "config-002",
    scope: "SYSTEM",
    targetId: null,
    key: "operation.team.min.size",
    value: 2,
    dataType: "NUMBER",
    description: "Tamanho mínimo da equipe para operações",
    createdDate: "2025-01-01T00:00:00Z",
    lastModifiedDate: "2025-01-01T00:00:00Z",
  },
  {
    id: "config-003",
    scope: "SYSTEM",
    targetId: null,
    key: "operation.quality.threshold",
    value: 85,
    dataType: "NUMBER",
    description: "Threshold mínimo de qualidade (%)",
    createdDate: "2025-01-01T00:00:00Z",
    lastModifiedDate: "2025-01-01T00:00:00Z",
  },
];

/**
 * GET /api/v1/configurations/[id]
 * Busca configuração por ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, `/configurations/${id}`);
  }

  const configuration = mockConfigurations.find((c) => c.id === id);

  if (!configuration) {
    return Response.json(
      {
        error: "Configuration not found",
        message: `Configuration with ID ${id} not found`,
      },
      { status: 404 },
    );
  }

  return Response.json(
    { data: configuration },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * PUT /api/v1/configurations/[id]
 * Atualiza configuração
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, `/configurations/${id}`, {
      method: "PUT",
      body,
    });
  }

  try {
    const { value } = await req.json();

    if (value === undefined) {
      return Response.json(
        { error: "Invalid request", message: "Value is required" },
        { status: 400 },
      );
    }

    const index = mockConfigurations.findIndex((c) => c.id === id);

    if (index === -1) {
      return Response.json(
        {
          error: "Configuration not found",
          message: `Configuration with ID ${id} not found`,
        },
        { status: 404 },
      );
    }

    mockConfigurations[index] = {
      ...mockConfigurations[index],
      value,
      lastModifiedDate: new Date().toISOString(),
    };

    return Response.json(
      { data: mockConfigurations[index] },
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
 * DELETE /api/v1/configurations/[id]
 * Remove configuração
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, `/configurations/${id}`, {
      method: "DELETE",
    });
  }

  const index = mockConfigurations.findIndex((c) => c.id === id);

  if (index === -1) {
    return Response.json(
      {
        error: "Configuration not found",
        message: `Configuration with ID ${id} not found`,
      },
      { status: 404 },
    );
  }

  mockConfigurations.splice(index, 1);

  return Response.json(
    { message: "Configuration deleted successfully" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
