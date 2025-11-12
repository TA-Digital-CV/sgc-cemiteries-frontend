import type { ApiResponse, PaginatedResponse } from "@/types/Common";
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
} from "@/types/cemetery";

// Classe de serviço para operações relacionadas a cemitérios
export class CemeteryService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // TODO: Configurar base URL e API key a partir de variáveis de ambiente
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
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
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(errorData.message || `Erro HTTP ${response.status}`);
      }

      return await response.json();
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

    const url = `${this.baseUrl}/cemeteries${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    const cemeteries: any = data.cemeteries ?? data.content ?? data.data ?? [];
    return Array.isArray(cemeteries) ? (cemeteries as Cemetery[]) : [];
  }

  // Buscar cemitério por ID
  async getCemeteryById(id: string): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries/${id}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const data: any = response?.data ?? response ?? {};
    return (data.cemetery ?? data.data) as Cemetery;
  }

  // Criar novo cemitério
  async createCemetery(data: CemeteryFormData): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries`;
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.cemetery ?? payload.data) as Cemetery;
  }

  // Atualizar cemitério existente
  async updateCemetery(id: string, data: CemeteryFormData): Promise<Cemetery> {
    const url = `${this.baseUrl}/cemeteries/${id}`;
    const response = await this.fetchWithErrorHandling<any>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const payload: any = response?.data ?? response ?? {};
    return (payload.cemetery ?? payload.data) as Cemetery;
  }

  // Deletar cemitério
  async deleteCemetery(id: string): Promise<void> {
    const url = `${this.baseUrl}/cemeteries/${id}`;
    await this.fetchWithErrorHandling<ApiResponse<void>>(url, {
      method: "DELETE",
    });
  }

  // Buscar cemitérios com parâmetros de busca
  async searchCemeteries(params: CemeterySearchParams): Promise<Cemetery[]> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

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
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/structure`;
    const response = await this.fetchWithErrorHandling<any>(url);

    const data: any = response?.data ?? {};
    const structures = (data.structures ?? data.structure ?? []) as unknown;
    return Array.isArray(structures)
      ? (structures as CemeteryStructure[])
      : [structures as CemeteryStructure].filter(Boolean);
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
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/blocks`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const payload: any = response?.data ?? response ?? {};
    return (payload.blocks ?? []) as CemeteryBlock[];
  }

  // Buscar seções de um bloco
  async getBlockSections(
    cemeteryId: string,
    blockId: string,
  ): Promise<CemeterySection[]> {
    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/blocks/${blockId}/sections`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const payload: any = response?.data ?? response ?? {};
    return (payload.sections ?? []) as CemeterySection[];
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
    const url = `${this.baseUrl}/cemetery-sections/${id}`;
    const response = await this.fetchWithErrorHandling<any>(url);
    const payload: any = response?.data ?? response ?? {};
    return (payload.section ?? payload.data) as CemeterySection;
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
