import { z } from "zod";
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/app/(myapp)/types/Common";
import type {
  CapacityProjection,
  Cemetery,
  CemeteryBlock,
  CemeteryFilters,
  CemeteryFormData,
  CemeteryPlot,
  CemeterySearchParams,
  CemeterySection,
  CemeteryStatistics,
  CemeteryStructure,
  GrowthScenario,
} from "@/app/(myapp)/types/cemetery";

// Validation schemas for API payloads
const CemeterySchema = z.object({
  id: z.string(),
  municipalityId: z.string(),
  name: z.string(),
  address: z.string().optional().default(""),
  geoPoint: z
    .object({ latitude: z.number(), longitude: z.number() })
    .optional(),
  totalArea: z.number().optional().default(0),
  maxCapacity: z.number(),
  currentOccupancy: z.number().optional().default(0),
  occupancyRate: z.number().optional().default(0),
  status: z.string(),
  createdDate: z.string().optional().default(new Date().toISOString()),
  lastModifiedDate: z.string().optional().default(new Date().toISOString()),
  metadata: z.any().optional(),
});
const CemeteryArraySchema = z.array(CemeterySchema);

function parseCemetery(input: any): Cemetery {
  const parsed = CemeterySchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid cemetery payload");
  }
  return parsed.data as Cemetery;
}

function parseCemeteryList(input: any): Cemetery[] {
  if (Array.isArray(input)) {
    const parsed = CemeteryArraySchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid cemetery list payload");
    }
    return parsed.data as Cemetery[];
  }
  return [];
}

// Classe de serviço para operações relacionadas a cemitérios
export class CemeteryService {
  private baseUrl: string;
  private apiKey: string;
  private municipalityId?: string;

  constructor() {
    // Configure base URL and API key from environment. Ensure /api/v1 suffix.
    const rawBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const normalized = rawBase.replace(/\/$/, "");
    this.baseUrl = /\/api\/v1$/i.test(normalized)
      ? normalized
      : `${normalized}/v1`;
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
    this.municipalityId =
      process.env.NEXT_PUBLIC_MUNICIPALITY_ID ||
      process.env.APP_MUNICIPALITY_DEFAULT ||
      process.env.APP_MUCIPALITY_DEFAULT ||
      undefined;
  }

  // Headers padrão para requisições
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * requireMunicipalityId
   * Returns municipalityId from env or throws when unavailable.
   */
  private requireMunicipalityId(): string {
    const id = this.municipalityId;
    if (!id) {
      throw new Error("Error: Municipality ID not configured");
    }
    return id;
  }

  // Método auxiliar para fazer requisições HTTP
  private async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const ct = response.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Erro desconhecido" }));
          throw new Error(errorData.message || `Erro HTTP ${response.status}`);
        } else {
          const text = await response.text().catch(() => "");
          throw new Error(
            `Resposta inválida (${response.status}) - esperava JSON, recebeu '${ct || "desconhecido"}'`,
          );
        }
      }

      const ct = response.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        return await response.json();
      }
      const text = await response.text();
      throw new Error(
        `Resposta inválida - esperava JSON, recebeu '${ct || "desconhecido"}'`,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro na comunicação com o servidor");
    }
  }

  // Buscar todos os cemitérios
  /**
   * getAllCemeteries
   * Adds municipalityId to query when not provided.
   */
  async getAllCemeteries(filters?: CemeteryFilters): Promise<Cemetery[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    if (!queryParams.has("municipalityId") && this.municipalityId) {
      queryParams.append("municipalityId", this.municipalityId);
    }

    const url = `${this.baseUrl}/cemeteries${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    const cemeteries: any = data.cemeteries ?? data.content ?? data.data ?? [];
    return parseCemeteryList(cemeteries);
  }

  // Buscar cemitério por ID
  async getCemeteryById(id: string): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries/${id}`;
    /**
     * GET /cemeteries/{id}
     * Returns either a raw Cemetery object or an envelope { data: Cemetery }.
     */
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    return parseCemetery(data.cemetery ?? data.data ?? data);
  }

  // Criar novo cemitério
  /**
   * createCemetery
   * Ensures municipalityId is set from env when missing.
   */
  async createCemetery(data: CemeteryFormData): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries`;
    if (!data.municipalityId) {
      data.municipalityId = this.requireMunicipalityId();
    }
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.cemetery ?? payload.data) as Cemetery;
  }

  // Atualizar cemitério existente
  /**
   * updateCemetery
   * Ensures municipalityId is present for consistency.
   */
  async updateCemetery(id: string, data: CemeteryFormData): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries/${id}`;
    /**
     * PUT /cemeteries/{id}
     * Returns either raw Cemetery or { data: Cemetery }.
     */
    if (!data.municipalityId && this.municipalityId) {
      data.municipalityId = this.municipalityId;
    }
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return parseCemetery(payload.cemetery ?? payload.data ?? payload);
  }

  // Deletar cemitério
  async deleteCemetery(id: string): Promise<void> {
    /**
     * DELETE /cemeteries/{id}?confirm=true
     * Mock enforces confirm=true and may return a JSON body.
     */
    const url = `${this.baseUrl}/cemeteries/${id}?confirm=true`;
    await this.fetchWithErrorHandling<ApiResponse<void>>(url, {
      method: "DELETE",
    });
  }

  // Buscar cemitérios com parâmetros de busca
  /**
   * searchCemeteries
   * Adds municipalityId to query when not provided.
   */
  async searchCemeteries(params: CemeterySearchParams): Promise<Cemetery[]> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    if (!queryParams.has("municipalityId") && this.municipalityId) {
      queryParams.append("municipalityId", this.municipalityId);
    }

    const url = `${this.baseUrl}/cemeteries/search?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    const cemeteries: any = data.cemeteries ?? data.content ?? data.data ?? [];
    return Array.isArray(cemeteries) ? (cemeteries as Cemetery[]) : [];
  }

  // Buscar estruturas de cemitério (blocos, seções, lotes)
  async getCemeteryStructures(
    cemeteryId: string,
  ): Promise<CemeteryStructure[]> {
    /**
     * GET /cemeteries/{id}/structure
     * Mock returns { cemeteryId, cemeteryName, structure: { blocks: [...] }, summary }
     * Normalize into CemeteryStructure[] for client usage.
     */
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/structure`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const structure = (response?.structure ?? {}) as any;
    const blocks = Array.isArray(structure.blocks) ? structure.blocks : [];
    const mapped: CemeteryStructure = {
      cemetery: response?.cemetery ?? ({} as Cemetery),
      blocks: blocks as any,
      sections: blocks.flatMap((b: any) => b.sections ?? []) as any,
      plots: [],
    };
    return [mapped];
  }

  async getCemeteryStructureSummary(cemeteryId: string): Promise<{
    totalBlocks: number;
    totalSections: number;
    totalPlots: number;
  }> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/structure`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const summary = response?.summary ?? {};
    const hasSummary = summary && summary.totalBlocks !== undefined;
    if (hasSummary) {
      return {
        totalBlocks: Number(summary.totalBlocks ?? 0),
        totalSections: Number(summary.totalSections ?? 0),
        totalPlots: Number(summary.totalPlots ?? 0),
      };
    }
    const structure = (response?.structure ?? {}) as any;
    const blocks = Array.isArray(structure.blocks) ? structure.blocks : [];
    const sections = blocks.flatMap((b: any) => b.sections ?? []);
    return {
      totalBlocks: blocks.length,
      totalSections: sections.length,
      totalPlots: Array.isArray(structure.plots) ? structure.plots.length : 0,
    };
  }

  // Buscar estatísticas de cemitério
  async getCemeteryStatistics(cemeteryId: string): Promise<CemeteryStatistics> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/statistics`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const payload: any = response?.data ?? response ?? {};
    return (payload.statistics ?? payload.data) as CemeteryStatistics;
  }

  // Buscar projeções de capacidade
  async getCapacityProjections(
    cemeteryId: string,
    years: number = 5,
  ): Promise<CapacityProjection[]> {
    const projectionPeriod = Math.max(1, years);
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/capacity-projection?projectionPeriod=${projectionPeriod}`;
    const response = await this.fetchWithErrorHandling<any>(url);

    const payload: any = response?.data ?? {};
    const currentStatus = payload.currentStatus ?? {};
    const params = payload.projectionParameters ?? {};
    const projections = payload.projections ?? {};

    const item: CapacityProjection = {
      currentDate: new Date().toISOString(),
      projectionDate: String(projections.estimatedFullCapacityDate ?? ""),
      monthsRemaining: Number(projections.monthsToFullCapacity ?? 0),
      projectedOccupancyRate: Number(currentStatus.occupancyRate ?? 0),
      confidenceLevel: Number(params.confidenceLevel ?? 0),
      scenario: (payload.historicalTrends?.trendDirection ??
        "MODERATE") as GrowthScenario,
    } as CapacityProjection;

    return [item].filter((p) => Boolean(p.projectionDate));
  }

  // Buscar blocos de cemitério
  async getCemeteryBlocks(cemeteryId: string): Promise<CemeteryBlock[]> {
    /**
     * Derive blocks from structure endpoint for compatibility with mock.
     */
    const structures = await this.getCemeteryStructures(cemeteryId);
    const blocks = structures[0]?.blocks ?? [];
    return blocks as CemeteryBlock[];
  }

  // Buscar seções de um bloco
  async getBlockSections(
    cemeteryId: string,
    blockId: string,
  ): Promise<CemeterySection[]> {
    /**
     * Derive sections from structure endpoint for compatibility with mock.
     */
    const structures = await this.getCemeteryStructures(cemeteryId);
    const allSections = (structures[0]?.sections ?? []) as any[];
    return allSections.filter(
      (s) => s.blockId === blockId,
    ) as CemeterySection[];
  }

  // Criar bloco
  async createBlock(
    data: Partial<CemeteryBlock> & {
      cemeteryId: string;
      name: string;
      maxCapacity: number;
      geoPolygon?: { type: string; coordinates: any[] };
    },
  ): Promise<CemeteryBlock> {
    const url = `${this.baseUrl}/cemetery-blocks`;
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.block ?? payload.data) as CemeteryBlock;
  }

  // Atualizar bloco
  async updateBlock(
    id: string,
    data: Partial<CemeteryBlock>,
  ): Promise<CemeteryBlock> {
    const url = `${this.baseUrl}/cemetery-blocks/${id}`;
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.block ?? payload.data) as CemeteryBlock;
  }

  // Criar seção
  async createSection(
    data: Partial<CemeterySection> & {
      cemeteryId: string;
      blockId: string;
      name: string;
      maxCapacity: number;
      geoPolygon?: { type: string; coordinates: any[] };
    },
  ): Promise<CemeterySection> {
    const url = `${this.baseUrl}/cemetery-sections`;
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.section ?? payload.data) as CemeterySection;
  }

  // Atualizar seção
  async updateSection(
    id: string,
    data: Partial<CemeterySection>,
  ): Promise<CemeterySection> {
    const url = `${this.baseUrl}/cemetery-sections/${id}`;
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.section ?? payload.data) as CemeterySection;
  }

  // Buscar seção por ID
  async getSectionById(id: string): Promise<CemeterySection> {
    /**
     * GET /cemetery-sections/{id}
     * Returns raw section or envelope. Fallback to search via structure when needed.
     */
    const url = `${this.baseUrl}/cemetery-sections/${id}`;
    try {
      const response = await this.fetchWithErrorHandling<any>(url);
      const payload: any = response?.data ?? response ?? {};
      return (payload.section ?? payload.data ?? payload) as CemeterySection;
    } catch (_err) {
      // Fallback: iterate structures to find section
      const all: Cemetery[] = await this.getAllCemeteries();
      for (const c of all) {
        const structures = await this.getCemeteryStructures(c.id);
        const sec = structures[0]?.sections?.find((s: any) => s.id === id);
        if (sec) return sec as CemeterySection;
      }
      throw new Error("Section not found");
    }
  }

  // Buscar lotes de uma seção
  async getSectionPlots(
    cemeteryId: string,
    sectionId: string,
  ): Promise<CemeteryPlot[]> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/sections/${sectionId}/plots`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const payload: any = response?.data ?? response ?? {};
    return (payload.plots ?? []) as CemeteryPlot[];
  }

  // Buscar cemitérios por localização (raio)
  async getCemeteriesByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<Cemetery[]> {
    const url = `${this.baseUrl}/cemeteries/by-location?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    const cemeteries: any = data.cemeteries ?? data.content ?? data.data ?? [];
    return Array.isArray(cemeteries) ? (cemeteries as Cemetery[]) : [];
  }

  // Buscar cemitérios por capacidade disponível
  async getCemeteriesByAvailableCapacity(
    minCapacity: number,
  ): Promise<Cemetery[]> {
    const url = `${this.baseUrl}/cemeteries/by-capacity?minCapacity=${minCapacity}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    const cemeteries: any = data.cemeteries ?? data.content ?? data.data ?? [];
    return Array.isArray(cemeteries) ? (cemeteries as Cemetery[]) : [];
  }

  // Exportar dados de cemitério
  async exportCemeteryData(
    cemeteryId: string,
    format: "json" | "csv" | "xlsx" = "json",
  ): Promise<Blob> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/export?format=${format}`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao exportar dados: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao exportar dados do cemitério");
    }
  }

  // Importar dados de cemitério
  async importCemeteryData(
    file: File,
  ): Promise<{ success: boolean; imported: number; errors: string[] }> {
    const url = `${this.baseUrl}/cemeteries/import`;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: this.apiKey ? `Bearer ${this.apiKey}` : "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao importar dados: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao importar dados de cemitério");
    }
  }
}
