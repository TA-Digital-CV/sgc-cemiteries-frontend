import { z } from "zod";
import type {
  ActionResult,
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
import { CemeteryFormSchema } from "@/app/(myapp)/types/cemetery";

// Validation schemas for API payloads
// Validation schemas for API payloads
// Removed unused schemas and parsers

// Classe de serviço para operações relacionadas a cemitérios
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

  /**
   * sanitizeCemeteryFormData
   * Trims strings and normalizes numeric fields for request payload.
   */
  private sanitizeCemeteryFormData(d: CemeteryFormData): CemeteryFormData {
    return {
      municipalityId: String(d.municipalityId ?? "").trim(),
      name: String(d.name ?? "").trim(),
      address: String(d.address ?? "").trim(),
      geoPoint: d.geoPoint
        ? {
            latitude: Number(d.geoPoint.latitude ?? 0),
            longitude: Number(d.geoPoint.longitude ?? 0),
          }
        : undefined,
      totalArea: Number(d.totalArea ?? 0),
      maxCapacity: Number(d.maxCapacity ?? 0),
      status: d.status,
    };
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
          const isXml =
            /xml/i.test(ct) || /application\/problem\+xml/i.test(ct);
          if (isXml) {
            const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/i);
            const detailMatch = text.match(/<detail>([\s\S]*?)<\/detail>/i);
            const msg = (
              detailMatch?.[1] ||
              titleMatch?.[1] ||
              "Erro desconhecido"
            ).trim();
            throw new Error(msg || `Erro HTTP ${response.status}`);
          }
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
  async getAllCemeteries(filters?: CemeteryFilters): Promise<Cemetery[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    // Do not enforce municipalityId automatically here; rely on explicit filters

    const url = `${this.baseUrl}/cemeteries${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    // Backend returns WrapperListCemeterieDTO with 'content' list
    const content = response.content || response.data || [];
    return Array.isArray(content) ? (content as Cemetery[]) : [];
  }

  // Buscar cemitério por ID
  async getCemeteryById(id: string): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries/${id}`;
    // Backend returns CemeterieResponseDetailsDTO
    const response = await this.fetchWithErrorHandling<Cemetery>(url);
    return response;
  }

  // Criar novo cemitério
  async createCemetery(data: CemeteryFormData): Promise<Cemetery> {
    const cleaned = this.sanitizeCemeteryFormData(data);
    const parsed = CemeteryFormSchema.safeParse(cleaned);
    if (!parsed.success) {
      throw new Error("Error: invalid cemetery payload");
    }
    data = parsed.data as CemeteryFormData;
    const url = `${this.baseUrl}/cemeteries`;
    if (!data.municipalityId) {
      data.municipalityId = this.requireMunicipalityId();
    }
    // Backend expects CemeterieRequestDTO
    const response = await this.fetchWithErrorHandling<Cemetery>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Atualizar cemitério existente
  async updateCemetery(id: string, data: CemeteryFormData): Promise<Cemetery> {
    const cleaned = this.sanitizeCemeteryFormData(data);
    const parsed = CemeteryFormSchema.safeParse(cleaned);
    if (!parsed.success) {
      throw new Error("Error: invalid cemetery payload");
    }
    data = parsed.data as CemeteryFormData;
    const url = `${this.baseUrl}/cemeteries/${id}`;
    if (!data.municipalityId && this.municipalityId) {
      data.municipalityId = this.municipalityId;
    }
    const response = await this.fetchWithErrorHandling<Cemetery>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Deletar cemitério
  async deleteCemetery(id: string): Promise<void> {
    const url = `${this.baseUrl}/cemeteries/${id}?confirm=true`;
    await this.fetchWithErrorHandling<ActionResult<void>>(url, {
      method: "DELETE",
    });
  }

  // Buscar cemitérios com parâmetros de busca
  async searchCemeteries(params: CemeterySearchParams): Promise<Cemetery[]> {
    // Reusing getAllCemeteries logic as search endpoint might be same or similar
    // If backend has specific search endpoint, adapt here.
    // For now, mapping to getAllCemeteries with filters
    return this.getAllCemeteries(params.filters);
  }

  // Buscar estruturas de cemitério (blocos, seções, lotes)
  async getCemeteryStructures(
    cemeteryId: string,
  ): Promise<CemeteryStructure[]> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/structure`;
    // Backend returns CemeterieResponseDetailsAllDTO
    const response = await this.fetchWithErrorHandling<CemeteryStructure>(url);
    return [response];
  }

  async getCemeteryStructureSummary(cemeteryId: string): Promise<{
    totalBlocks: number;
    totalSections: number;
    totalPlots: number;
  }> {
    /**
     * Computes structure summary using flexible mapping of API shapes.
     * Supports both flattened shape (blocks/sections at top-level) and
     * nested shape returned by /cemeteries/{id}/structure with {structure, summary}.
     */
    const structures = await this.getCemeteryStructures(cemeteryId);
    const s: any = structures[0] ?? {};

    // Prefer explicit summary when provided by API
    const summaryFromApi = s.summary as
      | { totalBlocks?: number; totalSections?: number; totalPlots?: number }
      | undefined;

    // Flatten nested lists if present under s.structure
    const nestedBlocks: any[] = Array.isArray(s?.structure?.blocks)
      ? (s.structure.blocks as any[])
      : [];
    const nestedSectionsCount = nestedBlocks.reduce(
      (acc, b) => acc + (Array.isArray(b?.sections) ? b.sections.length : 0),
      0,
    );

    // Fallback to top-level arrays if available
    const topBlocks: any[] = Array.isArray(s?.blocks)
      ? (s.blocks as any[])
      : [];
    const topSections: any[] = Array.isArray(s?.sections)
      ? (s.sections as any[])
      : [];
    const topPlots: any[] = Array.isArray(s?.plots) ? (s.plots as any[]) : [];

    const totalBlocks =
      summaryFromApi?.totalBlocks ??
      s.blocksCount ??
      nestedBlocks.length ??
      topBlocks.length ??
      0;
    const totalSections =
      summaryFromApi?.totalSections ??
      s.sectionsCount ??
      nestedSectionsCount ??
      topSections.length ??
      0;
    const totalPlots =
      summaryFromApi?.totalPlots ?? s.plotsCount ?? topPlots.length ?? 0;

    return { totalBlocks, totalSections, totalPlots };
  }

  // Buscar estatísticas de cemitério
  async getCemeteryStatistics(cemeteryId: string): Promise<CemeteryStatistics> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/statistics`;
    const response = await this.fetchWithErrorHandling<CemeteryStatistics>(url);
    return response;
  }

  // Buscar projeções de capacidade
  async getCapacityProjections(
    cemeteryId: string,
    years: number = 5,
  ): Promise<CapacityProjection[]> {
    const projectionPeriod = Math.max(1, years);
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/capacity-projection?projectionPeriod=${projectionPeriod}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    // Adapt response to CapacityProjection[] if needed
    // Assuming backend returns CemeteryCapacityProjectionResponseDTO
    // which might need mapping if it's not an array
    return [response as CapacityProjection]; // Placeholder mapping
  }

  // Buscar blocos de cemitério
  async getCemeteryBlocks(cemeteryId: string): Promise<CemeteryBlock[]> {
    const url = `${this.baseUrl}/cemetery-blocks?cemeterieId=${cemeteryId}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    // Backend returns WrapperListCemeterieBlockDTO
    const content = response.content || [];
    return content as CemeteryBlock[];
  }

  // Buscar seções de um bloco
  async getBlockSections(
    cemeteryId: string,
    blockId: string,
  ): Promise<CemeterySection[]> {
    const url = `${this.baseUrl}/cemetery-sections?blockId=${blockId}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    // Backend returns WrapperListCemeterieSectionDTO
    const content = response.content || [];
    return content as CemeterySection[];
  }

  // Criar bloco
  async createBlock(data: {
    cemeteryId: string;
    name: string;
    description?: string;
    maxCapacity: number;
    geoPolygon?: Record<string, any>;
  }): Promise<CemeteryBlock> {
    const url = `${this.baseUrl}/cemetery-blocks`;
    const response = await this.fetchWithErrorHandling<CemeteryBlock>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Atualizar bloco
  async updateBlock(
    id: string,
    data: Partial<CemeteryBlock>,
  ): Promise<CemeteryBlock> {
    const url = `${this.baseUrl}/cemetery-blocks/${id}`;
    const response = await this.fetchWithErrorHandling<CemeteryBlock>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Criar seção
  async createSection(
    data: Partial<CemeterySection> & {
      cemeteryId: string;
      blockId: string;
      name: string;
      maxCapacity: number;
    },
  ): Promise<CemeterySection> {
    const url = `${this.baseUrl}/cemetery-sections`;
    const response = await this.fetchWithErrorHandling<CemeterySection>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Atualizar seção
  async updateSection(
    id: string,
    data: Partial<CemeterySection>,
  ): Promise<CemeterySection> {
    const url = `${this.baseUrl}/cemetery-sections/${id}`;
    const response = await this.fetchWithErrorHandling<CemeterySection>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Buscar seção por ID
  async getSectionById(id: string): Promise<CemeterySection> {
    const url = `${this.baseUrl}/cemetery-sections/${id}`;
    const response = await this.fetchWithErrorHandling<CemeterySection>(url);
    return response;
  }

  // Buscar lotes de uma seção
  async getSectionPlots(
    cemeteryId: string,
    sectionId: string,
  ): Promise<CemeteryPlot[]> {
    const url = `${this.baseUrl}/plots?sectionId=${sectionId}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    // Backend returns WrapperListPlotDTO
    const content = response.content || [];
    return content as CemeteryPlot[];
  }

  // Criar sepultura
  async createPlot(
    data: Partial<CemeteryPlot> & {
      sectionId: string;
      plotNumber: string;
      plotType: string;
      status: string;
    },
  ): Promise<CemeteryPlot> {
    const url = `${this.baseUrl}/plots`;
    const response = await this.fetchWithErrorHandling<CemeteryPlot>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  // Buscar cemitérios por localização (raio)
  async getCemeteriesByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<Cemetery[]> {
    const url = `${this.baseUrl}/cemeteries/by-location?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const content = response.content || response.data || [];
    return content as Cemetery[];
  }

  // Buscar cemitérios por capacidade disponível
  async getCemeteriesByAvailableCapacity(
    minCapacity: number,
  ): Promise<Cemetery[]> {
    const url = `${this.baseUrl}/cemeteries/by-capacity?minCapacity=${minCapacity}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const content = response.content || response.data || [];
    return content as Cemetery[];
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
