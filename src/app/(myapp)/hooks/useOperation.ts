import { useCallback, useState } from "react";
import { OperationService } from "../services/operationService";
import type { PaginatedResponse, PaginationParams } from "../types/Common";
import type {
  Configuration,
  Operation,
  OperationFilters,
} from "../types/Operation";

export function useOperation() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] =
    useState<PaginatedResponse<Operation> | null>(null);

  const operationService = new OperationService();

  const fetchOperations = useCallback(
    async (filters?: OperationFilters, pageParams?: PaginationParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await operationService.getAll(filters, pageParams);
        setOperations(response.content);
        setPagination(response);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Falha ao buscar operações");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchConfigurations = useCallback(
    async (scope: string, targetId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const configs = await operationService.getConfigurations(
          scope,
          targetId,
        );
        setConfigurations(configs);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Falha ao buscar configurações");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createOperation = useCallback(async (data: Partial<Operation>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newOperation = await operationService.create(data);
      setOperations((prev) => [...prev, newOperation]);
      return newOperation;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Falha ao criar operação");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOperationStatus = useCallback(
    async (id: string, status: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedOperation = await operationService.updateStatus(
          id,
          status,
        );
        setOperations((prev) =>
          prev.map((op) => (op.id === id ? updatedOperation : op)),
        );
        return updatedOperation;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Falha ao atualizar status da operação");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateConfiguration = useCallback(async (id: string, value: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedConfig = await operationService.updateConfiguration(
        id,
        value,
      );
      setConfigurations((prev) =>
        prev.map((c) => (c.id === id ? updatedConfig : c)),
      );
      return updatedConfig;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Falha ao atualizar configuração");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    operations,
    configurations,
    isLoading,
    error,
    pagination,
    fetchOperations,
    fetchConfigurations,
    createOperation,
    updateOperationStatus,
    updateConfiguration,
  };
}
