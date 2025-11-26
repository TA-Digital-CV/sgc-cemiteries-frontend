import type { PaginatedResponse, PaginationParams } from "../types/Common";
import type {
  Configuration,
  Operation,
  OperationFilters,
} from "../types/Operation";

export class OperationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
  }

  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  async getAll(
    filters?: OperationFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Operation>> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.cemeteryId) params.append("cemeteryId", filters.cemeteryId);
    if (filters?.startDate)
      params.append("startDate", filters.startDate.toISOString());
    if (filters?.endDate)
      params.append("endDate", filters.endDate.toISOString());

    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.size) params.append("size", pagination.size.toString());

    const url = `${this.baseUrl}/operations?${params.toString()}`;
    console.log("[OperationService] Fetching operations from:", url);

    try {
      const response =
        await this.fetchWithErrorHandling<PaginatedResponse<Operation>>(url);
      console.log("[OperationService] Response:", response);
      return response;
    } catch (error) {
      console.error("[OperationService] Error fetching operations:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<Operation> {
    return this.fetchWithErrorHandling<Operation>(
      `${this.baseUrl}/operations/${id}`,
    );
  }

  async create(data: Partial<Operation>): Promise<Operation> {
    return this.fetchWithErrorHandling<Operation>(
      `${this.baseUrl}/operations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
  }

  async updateStatus(id: string, status: string): Promise<Operation> {
    return this.fetchWithErrorHandling<Operation>(
      `${this.baseUrl}/operations/${id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
  }

  // Configuration methods
  async getConfigurations(
    scope: string,
    targetId?: string,
  ): Promise<Configuration[]> {
    const params = new URLSearchParams({ scope });
    if (targetId) params.append("targetId", targetId);

    const url = `${this.baseUrl}/configurations?${params.toString()}`;
    console.log("[OperationService] Fetching configurations from:", url);

    try {
      const response = await this.fetchWithErrorHandling<Configuration[]>(url);
      console.log("[OperationService] Configurations response:", response);
      return response;
    } catch (error) {
      console.error("[OperationService] Error fetching configurations:", error);
      throw error;
    }
  }

  async updateConfiguration(id: string, value: any): Promise<Configuration> {
    return this.fetchWithErrorHandling<Configuration>(
      `${this.baseUrl}/configurations/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      },
    );
  }
}
