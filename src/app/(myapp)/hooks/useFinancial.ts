import { useCallback, useState } from "react";
import { FinancialService } from "../services/financialService";
import type { PaginatedResponse, PaginationParams } from "../types/Common";
import type {
  CalculationResult,
  FeeTable,
  FinancialFilters,
  Payment,
} from "../types/Financial";

export function useFinancial() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeTables, setFeeTables] = useState<FeeTable[]>([]);
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] =
    useState<PaginatedResponse<Payment> | null>(null);

  const financialService = new FinancialService();

  const fetchPayments = useCallback(
    async (filters?: FinancialFilters, pageParams?: PaginationParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await financialService.getPayments(
          filters,
          pageParams,
        );
        setPayments(response.content);
        setPagination(response);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Falha ao buscar pagamentos");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchFeeTables = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tables = await financialService.getFeeTables();
      setFeeTables(tables);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Falha ao buscar tabelas de taxas");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (data: Partial<Payment>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPayment = await financialService.createPayment(data);
      setPayments((prev) => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Falha ao criar pagamento");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (id: string, method: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const processedPayment = await financialService.processPayment(
        id,
        method,
      );
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? processedPayment : p)),
      );
      return processedPayment;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Falha ao processar pagamento");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateFees = useCallback(
    async (items: { feeTableId: string; quantity: number }[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await financialService.calculateFees(items);
        setCalculationResult(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Falha ao calcular taxas");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    payments,
    feeTables,
    calculationResult,
    isLoading,
    error,
    pagination,
    fetchPayments,
    fetchFeeTables,
    createPayment,
    processPayment,
    calculateFees,
  };
}
