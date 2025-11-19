import type { ApiResponse } from "@/types/Common";
import type {
  PaginationInfo,
  Plot,
  PlotApiResponse,
  PlotApiSingleResponse,
  PlotAvailability,
  PlotAvailabilityApiResponse,
  PlotDimensions,
  PlotFilters,
  PlotFormData,
  PlotSearchParams,
  PlotStatistics,
  PlotStatisticsApiResponse,
} from "@/types/Plot";

// Classe de serviço para operações relacionadas a sepulturas (plots)
export class PlotService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const rawBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const normalized = rawBase.replace(/\/$/, "");
    this.baseUrl = /\/api\/v1$/i.test(normalized)
      ? normalized
      : `${normalized}/v1`;
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
      const isFormData = options.body instanceof FormData;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : this.getHeaders()),
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

  // Buscar todas as sepulturas
  async getAllPlots(
    filters?: PlotFilters,
  ): Promise<{ data: Plot[]; pagination?: PaginationInfo }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response: any = await this.fetchWithErrorHandling<any>(url);
    const data: Plot[] = (response?.data ?? response?.content ?? []) as Plot[];
    const pag = (response?.pagination ?? response?.pageable ?? null) as any;
    const pagination: PaginationInfo | undefined = pag
      ? {
          page: Number(pag.page ?? pag.pageNumber ?? 0),
          limit: Number(pag.size ?? pag.pageSize ?? 10),
          total: Number(pag.totalElements ?? pag.total ?? 0),
          totalPages: Number(pag.totalPages ?? 0),
          hasNext: Boolean(
            pag.hasNext ??
              Number(pag.page ?? 0) + 1 < Number(pag.totalPages ?? 0),
          ),
          hasPrev: Boolean((pag.page ?? 0) > 0),
        }
      : undefined;
    return { data, pagination };
  }

  // Buscar sepultura por ID
  async getPlotById(id: string): Promise<Plot> {
    const url = `${this.baseUrl}/plots/${id}`;
    const response: any = await this.fetchWithErrorHandling<any>(url);
    return (response?.data ?? response) as Plot;
  }

  // Criar nova sepultura
  async createPlot(data: PlotFormData): Promise<Plot> {
    const url = `${this.baseUrl}/plots`;
    const response: any = await this.fetchWithErrorHandling<any>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return (response?.data ?? response) as Plot;
  }

  // Atualizar sepultura existente
  async updatePlot(id: string, data: PlotFormData): Promise<Plot> {
    const url = `${this.baseUrl}/plots/${id}`;
    const response: any = await this.fetchWithErrorHandling<any>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return (response?.data ?? response) as Plot;
  }

  // Upload plot photo and return its URL
  async uploadPlotPhoto(id: string, file: File): Promise<string> {
    const url = `${this.baseUrl}/plots/${id}/photos`;
    const form = new FormData();
    form.append("file", file);
    const response: any = await this.fetchWithErrorHandling<any>(url, {
      method: "POST",
      body: form,
    });
    const data = response?.data ?? response;
    const photoUrl = typeof data === "string" ? data : String(data?.url ?? "");
    if (!photoUrl) {
      throw new Error("Erro ao obter URL da imagem enviada");
    }
    return photoUrl;
  }

  // Deletar sepultura
  async deletePlot(id: string): Promise<void> {
    const url = `${this.baseUrl}/plots/${id}`;
    await this.fetchWithErrorHandling<ApiResponse<void>>(url, {
      method: "DELETE",
    });
  }

  // Buscar sepulturas com parâmetros de busca
  async searchPlots(
    params: PlotSearchParams,
  ): Promise<{ data: Plot[]; pagination?: PaginationInfo }> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}/plots/search?${queryParams.toString()}`;
    const response: any = await this.fetchWithErrorHandling<any>(url);
    const data: Plot[] = (response?.data ?? response?.content ?? []) as Plot[];
    const pag = (response?.pagination ?? response?.pageable ?? null) as any;
    const pagination: PaginationInfo | undefined = pag
      ? {
          page: Number(pag.page ?? pag.pageNumber ?? 0),
          limit: Number(pag.size ?? pag.pageSize ?? 10),
          total: Number(pag.totalElements ?? pag.total ?? 0),
          totalPages: Number(pag.totalPages ?? 0),
          hasNext: Boolean(
            pag.hasNext ??
              Number(pag.page ?? 0) + 1 < Number(pag.totalPages ?? 0),
          ),
          hasPrev: Boolean((pag.page ?? 0) > 0),
        }
      : undefined;
    return { data, pagination };
  }

  // Buscar estatísticas de sepulturas
  async getPlotStatistics(cemeteryId?: string): Promise<PlotStatistics> {
    const queryParams = cemeteryId ? `?cemeteryId=${cemeteryId}` : "";
    const url = `${this.baseUrl}/plots/statistics${queryParams}`;
    const response: any = await this.fetchWithErrorHandling<any>(url);
    return (response?.data ?? response) as PlotStatistics;
  }

  // Buscar disponibilidade de sepulturas
  async getPlotAvailability(
    cemeteryId: string,
    filters?: PlotFilters,
  ): Promise<PlotAvailability> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/cemeteries/${cemeteryId}/availability?${queryParams.toString()}`;
    const response: any = await this.fetchWithErrorHandling<any>(url);

    const data: any = response ?? {};
    const summary = data.summary ?? {};
    const list: any[] = Array.isArray(data.availablePlots)
      ? data.availablePlots
      : [];

    const next = list[0];
    const nextAvailablePlot: Plot | undefined = next
      ? {
          id: String(next.id ?? ""),
          cemeteryId: String(cemeteryId),
          blockId: String(next.location?.blockId ?? ""),
          sectionId: String(next.location?.sectionId ?? ""),
          plotNumber: String(next.plotNumber ?? ""),
          plotType: String(next.plotType ?? "GROUND") as Plot["plotType"],
          occupationStatus: "AVAILABLE",
          geoPoint: next.location?.coordinates
            ? {
                latitude: Number(next.location.coordinates.latitude ?? 0),
                longitude: Number(next.location.coordinates.longitude ?? 0),
              }
            : undefined,
          qrCode: String(next.qrCode ?? ""),
          dimensions: next.dimensions
            ? {
                length: Number(next.dimensions.length ?? 0),
                width: Number(next.dimensions.width ?? 0),
                depth: Number(next.dimensions.depth ?? 0),
                unit: String(
                  next.dimensions.unit ?? "meters",
                ) as PlotDimensions["unit"],
              }
            : undefined,
          notes: String(next.notes ?? ""),
          createdDate: String(next.createdDate ?? new Date().toISOString()),
          lastModifiedDate: String(
            next.lastModifiedDate ?? new Date().toISOString(),
          ),
          metadata: undefined,
        }
      : undefined;

    const availabilityRate = summary.totalAvailable
      ? Math.min(
          100,
          ((list.length ?? 0) / Number(summary.totalAvailable)) * 100,
        )
      : 0;

    return {
      cemeteryId,
      availablePlots: Number(summary.totalAvailable ?? list.length ?? 0),
      nextAvailablePlot,
      availabilityRate,
    };
  }

  // Buscar sepulturas por cemitério
  async getPlotsByCemetery(
    cemeteryId: string,
    filters?: PlotFilters,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("cemeteryId", cemeteryId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots/by-cemetery?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas por bloco
  async getPlotsByBlock(
    cemeteryId: string,
    blockId: string,
    filters?: PlotFilters,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("cemeteryId", cemeteryId);
    queryParams.append("blockId", blockId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots/by-block?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas por seção
  async getPlotsBySection(
    cemeteryId: string,
    sectionId: string,
    filters?: PlotFilters,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("cemeteryId", cemeteryId);
    queryParams.append("sectionId", sectionId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots/by-section?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas por tipo
  async getPlotsByType(type: string, cemeteryId?: string): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("type", type);

    if (cemeteryId) {
      queryParams.append("cemeteryId", cemeteryId);
    }

    const url = `${this.baseUrl}/plots/by-type?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas por status
  async getPlotsByStatus(status: string, cemeteryId?: string): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("status", status);

    if (cemeteryId) {
      queryParams.append("cemeteryId", cemeteryId);
    }

    const url = `${this.baseUrl}/plots/by-status?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas por localização (raio)
  async getPlotsByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 1,
    cemeteryId?: string,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("lat", latitude.toString());
    queryParams.append("lng", longitude.toString());
    queryParams.append("radius", radiusKm.toString());

    if (cemeteryId) {
      queryParams.append("cemeteryId", cemeteryId);
    }

    const url = `${this.baseUrl}/plots/by-location?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas disponíveis
  async getAvailablePlots(
    cemeteryId: string,
    filters?: PlotFilters,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("cemeteryId", cemeteryId);
    queryParams.append("status", "available");

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots/available?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas ocupadas
  async getOccupiedPlots(
    cemeteryId: string,
    filters?: PlotFilters,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("cemeteryId", cemeteryId);
    queryParams.append("status", "occupied");

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots/occupied?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Buscar sepulturas reservadas
  async getReservedPlots(
    cemeteryId: string,
    filters?: PlotFilters,
  ): Promise<Plot[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("cemeteryId", cemeteryId);
    queryParams.append("status", "reserved");

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${this.baseUrl}/plots/reserved?${queryParams.toString()}`;
    const response = await this.fetchWithErrorHandling<PlotApiResponse>(url);

    return response.data;
  }

  // Marcar sepultura como ocupada
  async markPlotAsOccupied(
    id: string,
    occupantInfo: {
      occupantName: string;
      deathDate?: Date;
      burialDate?: Date;
      notes?: string;
    },
  ): Promise<Plot> {
    const url = `${this.baseUrl}/plots/${id}/occupy`;
    const response = await this.fetchWithErrorHandling<PlotApiSingleResponse>(
      url,
      {
        method: "POST",
        body: JSON.stringify(occupantInfo),
      },
    );

    return response.data;
  }

  // Marcar sepultura como disponível
  async markPlotAsAvailable(id: string, reason?: string): Promise<Plot> {
    const url = `${this.baseUrl}/plots/${id}/available`;
    const response = await this.fetchWithErrorHandling<PlotApiSingleResponse>(
      url,
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      },
    );

    return response.data;
  }

  // Reservar sepultura
  async reservePlot(
    id: string,
    reservationInfo: {
      reservedBy: string;
      reservedUntil: Date;
      notes?: string;
    },
  ): Promise<Plot> {
    const url = `${this.baseUrl}/plots/${id}/reserve`;
    const response = await this.fetchWithErrorHandling<PlotApiSingleResponse>(
      url,
      {
        method: "POST",
        body: JSON.stringify(reservationInfo),
      },
    );

    return response.data;
  }

  // Cancelar reserva de sepultura
  async cancelPlotReservation(id: string, reason?: string): Promise<Plot> {
    const url = `${this.baseUrl}/plots/${id}/cancel-reservation`;
    const response = await this.fetchWithErrorHandling<PlotApiSingleResponse>(
      url,
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      },
    );

    return response.data;
  }

  // Exportar dados de sepulturas
  async exportPlotData(
    cemeteryId: string,
    format: "json" | "csv" | "xlsx" = "json",
  ): Promise<Blob> {
    const url = `${this.baseUrl}/plots/export?cemeteryId=${cemeteryId}&format=${format}`;

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
      throw new Error("Erro ao exportar dados de sepulturas");
    }
  }

  // Importar dados de sepulturas
  async importPlotData(
    file: File,
  ): Promise<{ success: boolean; imported: number; errors: string[] }> {
    const url = `${this.baseUrl}/plots/import`;
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
      throw new Error("Erro ao importar dados de sepulturas");
    }
  }
}
