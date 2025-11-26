import type { NextRequest } from "next/server";
import { proxyFetch, USE_REAL_BACKEND } from "../../config";

// Mock data para configurações
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
  {
    id: "config-004",
    scope: "CEMETERY",
    targetId: "cem-001",
    key: "cemetery.working.hours.start",
    value: "08:00",
    dataType: "STRING",
    description: "Horário de início de operações",
    createdDate: "2025-01-01T00:00:00Z",
    lastModifiedDate: "2025-01-01T00:00:00Z",
  },
  {
    id: "config-005",
    scope: "CEMETERY",
    targetId: "cem-001",
    key: "cemetery.working.hours.end",
    value: "17:00",
    dataType: "STRING",
    description: "Horário de término de operações",
    createdDate: "2025-01-01T00:00:00Z",
    lastModifiedDate: "2025-01-01T00:00:00Z",
  },
  {
    id: "config-006",
    scope: "TEAM",
    targetId: "team-001",
    key: "team.quality.target",
    value: 90,
    dataType: "NUMBER",
    description: "Meta de qualidade da equipe (%)",
    createdDate: "2025-01-01T00:00:00Z",
    lastModifiedDate: "2025-01-01T00:00:00Z",
  },
];

/**
 * GET /api/v1/configurations
 * Lista configurações com filtros opcionais
 */
export async function GET(req: NextRequest) {
  if (USE_REAL_BACKEND) {
    return proxyFetch(req, "/configurations");
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");
  const targetId = searchParams.get("targetId");

  let filtered = [...mockConfigurations];

  if (scope) {
    filtered = filtered.filter((config) => config.scope === scope);
  }
  if (targetId) {
    filtered = filtered.filter((config) => config.targetId === targetId);
  }

  return Response.json(filtered, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/v1/configurations
 * Cria nova configuração
 */
export async function POST(req: NextRequest) {
  if (USE_REAL_BACKEND) {
    const body = await req.text();
    return proxyFetch(req, "/configurations", { body });
  }

  try {
    const data = await req.json();

    const newConfiguration = {
      id: `config-${Date.now()}`,
      ...data,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
    };

    mockConfigurations.push(newConfiguration);

    return Response.json(
      { data: newConfiguration },
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
