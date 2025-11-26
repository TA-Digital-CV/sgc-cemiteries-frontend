import type { PaginatedResponse, PaginationParams } from "../types/Common";
import type {
  CalculationResult,
  FeeTable,
  FinancialFilters,
  Payment,
  Reconciliation,
} from "../types/Financial";

export class FinancialService {
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

  // Fee Tables
  async getFeeTables(): Promise<FeeTable[]> {
    return this.fetchWithErrorHandling<FeeTable[]>(
      `${this.baseUrl}/fee-tables`,
    );
  }

  // Payments
  async getPayments(
    filters?: FinancialFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate)
      params.append("startDate", filters.startDate.toISOString());
    if (filters?.endDate)
      params.append("endDate", filters.endDate.toISOString());

    if (pagination?.page) params.append("page", pagination.page.toString());
    if (pagination?.size) params.append("size", pagination.size.toString());

    return this.fetchWithErrorHandling<PaginatedResponse<Payment>>(
      `${this.baseUrl}/payments?${params.toString()}`,
    );
  }

  async getPaymentById(id: string): Promise<Payment> {
    return this.fetchWithErrorHandling<Payment>(
      `${this.baseUrl}/payments/${id}`,
    );
  }

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    return this.fetchWithErrorHandling<Payment>(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async processPayment(id: string, method: string): Promise<Payment> {
    return this.fetchWithErrorHandling<Payment>(
      `${this.baseUrl}/payments/${id}/process`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      },
    );
  }

  // Calculation
  async calculateFees(
    items: { feeTableId: string; quantity: number }[],
  ): Promise<CalculationResult> {
    return this.fetchWithErrorHandling<CalculationResult>(
      `${this.baseUrl}/calculations/fees`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      },
    );
  }

  // Reconciliation
  async getReconciliations(): Promise<Reconciliation[]> {
    return this.fetchWithErrorHandling<Reconciliation[]>(
      `${this.baseUrl}/reconciliations`,
    );
  }
}
