"use client";

import { useCallback, useEffect, useState } from "react";
import { PlotService } from "@/services/plotService";
import type { ActionResult } from "@/types/Common";
import type {
  PaginationInfo,
  Plot,
  PlotAvailability,
  PlotFilters,
  PlotFormData,
  PlotSearchParams,
  PlotStatistics,
} from "@/types/Plot";

// Interface de retorno do hook usePlot
export interface UsePlotReturn {
  plots: Plot[];
  selectedPlot: Plot | null;
  plotStatistics: PlotStatistics | null;
  plotAvailability: PlotAvailability | null;
  plotPagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;

  // Ações
  fetchPlots: (filters?: PlotFilters) => Promise<void>;
  selectPlot: (id: string) => Promise<void>;
  createPlot: (data: PlotFormData) => Promise<ActionResult<Plot>>;
  updatePlot: (id: string, data: PlotFormData) => Promise<ActionResult<Plot>>;
  deletePlot: (id: string) => Promise<ActionResult<void>>;
  searchPlots: (params: PlotSearchParams) => Promise<void>;
  fetchPlotStatistics: (cemeteryId?: string) => Promise<void>;
  fetchPlotAvailability: (
    cemeteryId: string,
    filters?: PlotFilters,
  ) => Promise<void>;
  reservePlot: (
    id: string,
    reservationInfo: {
      reservedBy: string;
      reservedUntil: Date;
      notes?: string;
    },
  ) => Promise<ActionResult<Plot>>;
  cancelPlotReservation: (
    id: string,
    reason?: string,
  ) => Promise<ActionResult<Plot>>;
  markPlotAsOccupied: (
    id: string,
    occupantInfo: {
      occupantName: string;
      deathDate?: Date;
      burialDate?: Date;
      notes?: string;
    },
  ) => Promise<ActionResult<Plot>>;
  markPlotAsAvailable: (
    id: string,
    reason?: string,
  ) => Promise<ActionResult<Plot>>;
  clearSelection: () => void;
  clearError: () => void;
}

// Serviço de plots (singleton)
const plotService = new PlotService();

export function usePlot(): UsePlotReturn {
  // Estado
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [plotStatistics, setPlotStatistics] = useState<PlotStatistics | null>(
    null,
  );
  const [plotAvailability, setPlotAvailability] =
    useState<PlotAvailability | null>(null);
  const [plotPagination, setPlotPagination] = useState<PaginationInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função auxiliar para tratamento de erros
  const handleError = useCallback((error: any, context: string) => {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`Erro em ${context}:`, error);
    setError(`${context}: ${errorMessage}`);
  }, []);

  // Buscar todas as sepulturas
  const fetchPlots = useCallback(
    async (filters?: PlotFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await plotService.getAllPlots(filters);
        setPlots(response.data);
        setPlotPagination(response.pagination ?? null);
      } catch (error) {
        handleError(error, "fetchPlots");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Selecionar sepultura específica
  const selectPlot = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const plot = await plotService.getPlotById(id);
        setSelectedPlot(plot);
      } catch (error) {
        handleError(error, "selectPlot");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Criar nova sepultura
  const createPlot = useCallback(
    async (data: PlotFormData): Promise<ActionResult<Plot>> => {
      setIsLoading(true);
      setError(null);

      try {
        const newPlot = await plotService.createPlot(data);
        setPlots((prev) => [...prev, newPlot]);
        return { success: true, data: newPlot };
      } catch (error) {
        handleError(error, "createPlot");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao criar sepultura",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Atualizar sepultura existente
  const updatePlot = useCallback(
    async (id: string, data: PlotFormData): Promise<ActionResult<Plot>> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedPlot = await plotService.updatePlot(id, data);

        // Atualizar na lista
        setPlots((prev) => prev.map((p) => (p.id === id ? updatedPlot : p)));

        // Atualizar sepultura selecionada se for a mesma
        if (selectedPlot?.id === id) {
          setSelectedPlot(updatedPlot);
        }

        return { success: true, data: updatedPlot };
      } catch (error) {
        handleError(error, "updatePlot");
        return {
          success: false,
          errors: [
            error instanceof Error
              ? error.message
              : "Erro ao atualizar sepultura",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedPlot],
  );

  // Deletar sepultura
  const deletePlot = useCallback(
    async (id: string): Promise<ActionResult<void>> => {
      setIsLoading(true);
      setError(null);

      try {
        await plotService.deletePlot(id);

        // Remover da lista
        setPlots((prev) => prev.filter((p) => p.id !== id));

        // Limpar seleção se for a sepultura selecionada
        if (selectedPlot?.id === id) {
          setSelectedPlot(null);
        }

        return { success: true };
      } catch (error) {
        handleError(error, "deletePlot");
        return {
          success: false,
          errors: [
            error instanceof Error
              ? error.message
              : "Erro ao deletar sepultura",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedPlot],
  );

  // Reservar sepultura
  const reservePlot = useCallback(
    async (
      id: string,
      reservationInfo: {
        reservedBy: string;
        reservedUntil: Date;
        notes?: string;
      },
    ): Promise<ActionResult<Plot>> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await plotService.reservePlot(id, reservationInfo);
        setPlots((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (selectedPlot?.id === id) setSelectedPlot(updated);
        return { success: true, data: updated };
      } catch (error) {
        handleError(error, "reservePlot");
        return {
          success: false,
          errors: [
            error instanceof Error
              ? error.message
              : "Erro ao reservar sepultura",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedPlot],
  );

  // Cancelar reserva
  const cancelPlotReservation = useCallback(
    async (id: string, reason?: string): Promise<ActionResult<Plot>> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await plotService.cancelPlotReservation(id, reason);
        setPlots((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (selectedPlot?.id === id) setSelectedPlot(updated);
        return { success: true, data: updated };
      } catch (error) {
        handleError(error, "cancelPlotReservation");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao cancelar reserva",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedPlot],
  );

  // Marcar como ocupada
  const markPlotAsOccupied = useCallback(
    async (
      id: string,
      occupantInfo: {
        occupantName: string;
        deathDate?: Date;
        burialDate?: Date;
        notes?: string;
      },
    ): Promise<ActionResult<Plot>> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await plotService.markPlotAsOccupied(id, occupantInfo);
        setPlots((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (selectedPlot?.id === id) setSelectedPlot(updated);
        return { success: true, data: updated };
      } catch (error) {
        handleError(error, "markPlotAsOccupied");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao ocupar sepultura",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedPlot],
  );

  // Marcar como disponível
  const markPlotAsAvailable = useCallback(
    async (id: string, reason?: string): Promise<ActionResult<Plot>> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await plotService.markPlotAsAvailable(id, reason);
        setPlots((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (selectedPlot?.id === id) setSelectedPlot(updated);
        return { success: true, data: updated };
      } catch (error) {
        handleError(error, "markPlotAsAvailable");
        return {
          success: false,
          errors: [
            error instanceof Error
              ? error.message
              : "Erro ao disponibilizar sepultura",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedPlot],
  );

  // Buscar sepulturas com parâmetros de busca
  const searchPlots = useCallback(
    async (params: PlotSearchParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await plotService.searchPlots(params);
        setPlots(response.data);
        setPlotPagination(response.pagination ?? null);
      } catch (error) {
        handleError(error, "searchPlots");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar estatísticas de sepulturas
  const fetchPlotStatistics = useCallback(
    async (cemeteryId?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const statistics = await plotService.getPlotStatistics(cemeteryId);
        setPlotStatistics(statistics);
      } catch (error) {
        handleError(error, "fetchPlotStatistics");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar disponibilidade de sepulturas
  const fetchPlotAvailability = useCallback(
    async (cemeteryId: string, filters?: PlotFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const availability = await plotService.getPlotAvailability(
          cemeteryId,
          filters,
        );
        setPlotAvailability(availability);
      } catch (error) {
        handleError(error, "fetchPlotAvailability");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Limpar seleção
  const clearSelection = useCallback(() => {
    setSelectedPlot(null);
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Efeito para buscar sepulturas ao montar o hook
  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  return {
    plots,
    selectedPlot,
    plotStatistics,
    plotAvailability,
    plotPagination,
    isLoading,
    error,
    fetchPlots,
    selectPlot,
    createPlot,
    updatePlot,
    deletePlot,
    searchPlots,
    fetchPlotStatistics,
    fetchPlotAvailability,
    reservePlot,
    cancelPlotReservation,
    markPlotAsOccupied,
    markPlotAsAvailable,
    clearSelection,
    clearError,
  };
}
