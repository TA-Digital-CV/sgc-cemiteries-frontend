import type { PaginatedResponse, PaginationParams } from "../types/Common";
import type {
  Concession,
  ConcessionFilters,
  ConcessionFormData,
} from "../types/Concession";

export class ConcessionService {
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
    filters?: ConcessionFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Concession>> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.holderName) params.append("holder", filters.holderName);
    if (filters?.startDate)
      params.append("startDate", filters.startDate.toISOString());
    if (filters?.endDate)
      params.append("endDate", filters.endDate.toISOString());

    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.size) params.append("size", pagination.size.toString());
    if (pagination?.sort) params.append("sort", pagination.sort);
    if (pagination?.direction) params.append("direction", pagination.direction);

    return this.fetchWithErrorHandling<PaginatedResponse<Concession>>(
      `${this.baseUrl}/concessions?${params.toString()}`,
    );
  }

  async getById(id: string): Promise<Concession> {
    return this.fetchWithErrorHandling<Concession>(
      `${this.baseUrl}/concessions/${id}`,
    );
  }

  async create(data: ConcessionFormData): Promise<Concession> {
    // Note: File uploads usually require FormData, but for this example we'll assume JSON or handle it separately
    // If files are involved, we might need to upload them first or use multipart/form-data

    return this.fetchWithErrorHandling<Concession>(
      `${this.baseUrl}/concessions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
  }

  async update(
    id: string,
    data: Partial<ConcessionFormData>,
  ): Promise<Concession> {
    return this.fetchWithErrorHandling<Concession>(
      `${this.baseUrl}/concessions/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
  }

  async delete(id: string): Promise<void> {
    return this.fetchWithErrorHandling<void>(
      `${this.baseUrl}/concessions/${id}`,
      { method: "DELETE" },
    );
  }

  async renew(id: string, duration: number): Promise<Concession> {
    return this.fetchWithErrorHandling<Concession>(
      `${this.baseUrl}/concessions/${id}/renew`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration }),
      },
    );
  }
}
