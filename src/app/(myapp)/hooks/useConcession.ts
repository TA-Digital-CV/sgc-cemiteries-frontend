import { useCallback, useState } from "react";
import { ConcessionService } from "../services/concessionService";
import type { PaginatedResponse, PaginationParams } from "../types/Common";
import type {
  Concession,
  ConcessionFilters,
  ConcessionFormData,
} from "../types/Concession";

export function useConcession() {
  const [concessions, setConcessions] = useState<Concession[]>([]);
  const [selectedConcession, setSelectedConcession] =
    useState<Concession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] =
    useState<PaginatedResponse<Concession> | null>(null);

  const concessionService = new ConcessionService();

  const fetchConcessions = useCallback(
    async (filters?: ConcessionFilters, pageParams?: PaginationParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await concessionService.getAll(filters, pageParams);
        setConcessions(response.content);
        setPagination(response);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Falha ao buscar concessões");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getConcessionById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const concession = await concessionService.getById(id);
      setSelectedConcession(concession);
      return concession;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Falha ao buscar concessão");
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConcession = useCallback(async (data: ConcessionFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newConcession = await concessionService.create(data);
      setConcessions((prev) => [...prev, newConcession]);
      return newConcession;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Falha ao criar concessão");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConcession = useCallback(
    async (id: string, data: Partial<ConcessionFormData>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedConcession = await concessionService.update(id, data);
        setConcessions((prev) =>
          prev.map((c) => (c.id === id ? updatedConcession : c)),
        );
        if (selectedConcession?.id === id) {
          setSelectedConcession(updatedConcession);
        }
        return updatedConcession;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Falha ao atualizar concessão");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedConcession],
  );

  const deleteConcession = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await concessionService.delete(id);
        setConcessions((prev) => prev.filter((c) => c.id !== id));
        if (selectedConcession?.id === id) {
          setSelectedConcession(null);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Falha ao remover concessão");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedConcession],
  );

  const renewConcession = useCallback(
    async (id: string, duration: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const renewedConcession = await concessionService.renew(id, duration);
        setConcessions((prev) =>
          prev.map((c) => (c.id === id ? renewedConcession : c)),
        );
        if (selectedConcession?.id === id) {
          setSelectedConcession(renewedConcession);
        }
        return renewedConcession;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Falha ao renovar concessão");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedConcession],
  );

  return {
    concessions,
    selectedConcession,
    isLoading,
    error,
    pagination,
    fetchConcessions,
    getConcessionById,
    createConcession,
    updateConcession,
    deleteConcession,
    renewConcession,
  };
}
