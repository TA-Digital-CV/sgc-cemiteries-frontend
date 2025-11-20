"use client";

import { useCallback, useEffect, useState } from "react";
import { CemeteryService } from "@/app/(myapp)/services/cemeteryService";
import type { ActionResult } from "@/app/(myapp)/types/Common";
import type {
  CapacityProjection,
  Cemetery,
  CemeteryBlock,
  CemeteryFilters,
  CemeteryFormData,
  CemeterySearchParams,
  CemeterySection,
  CemeteryStatistics,
  CemeteryStructure,
} from "@/app/(myapp)/types/cemetery";

// Interface de retorno do hook useCemetery
export interface UseCemeteryReturn {
  cemeteries: Cemetery[];
  selectedCemetery: Cemetery | null;
  cemeteryStructures: CemeteryStructure[];
  cemeteryStatistics: CemeteryStatistics | null;
  capacityProjections: CapacityProjection[];
  blocks: CemeteryBlock[];
  sections: CemeterySection[];
  isLoading: boolean;
  error: string | null;

  // Ações
  fetchCemeteries: (filters?: CemeteryFilters) => Promise<void>;
  selectCemetery: (id: string) => Promise<void>;
  createCemetery: (data: CemeteryFormData) => Promise<ActionResult<Cemetery>>;
  updateCemetery: (
    id: string,
    data: CemeteryFormData,
  ) => Promise<ActionResult<Cemetery>>;
  deleteCemetery: (id: string) => Promise<ActionResult<void>>;
  searchCemeteries: (params: CemeterySearchParams) => Promise<void>;
  fetchCemeteryStructures: (cemeteryId: string) => Promise<void>;
  fetchCemeteryStatistics: (id: string) => Promise<void>;
  fetchCapacityProjections: (
    cemeteryId: string,
    years?: number,
  ) => Promise<void>;
  fetchBlocks: (cemeteryId: string) => Promise<void>;
  createBlock: (
    data: Partial<CemeteryBlock> & {
      cemeteryId: string;
      name: string;
      maxCapacity: number;
    },
  ) => Promise<ActionResult<CemeteryBlock>>;
  updateBlock: (
    id: string,
    data: Partial<CemeteryBlock>,
  ) => Promise<ActionResult<CemeteryBlock>>;
  fetchSections: (cemeteryId: string, blockId: string) => Promise<void>;
  createSection: (
    data: Partial<CemeterySection> & {
      cemeteryId: string;
      blockId: string;
      name: string;
      maxCapacity: number;
    },
  ) => Promise<ActionResult<CemeterySection>>;
  updateSection: (
    id: string,
    data: Partial<CemeterySection>,
  ) => Promise<ActionResult<CemeterySection>>;
  getSectionById: (id: string) => Promise<CemeterySection | null>;
  clearSelection: () => void;
  clearError: () => void;
}

// Serviço de cemitérios (singleton)
const cemeteryService = new CemeteryService();

export function useCemetery(): UseCemeteryReturn {
  // Estado
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [selectedCemetery, setSelectedCemetery] = useState<Cemetery | null>(
    null,
  );
  const [cemeteryStructures, setCemeteryStructures] = useState<
    CemeteryStructure[]
  >([]);
  const [cemeteryStatistics, setCemeteryStatistics] =
    useState<CemeteryStatistics | null>(null);
  const [capacityProjections, setCapacityProjections] = useState<
    CapacityProjection[]
  >([]);
  const [blocks, setBlocks] = useState<CemeteryBlock[]>([]);
  const [sections, setSections] = useState<CemeterySection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função auxiliar para tratamento de erros
  const handleError = useCallback((error: unknown, context: string) => {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`Erro em ${context}:`, error);
    setError(`${context}: ${errorMessage}`);
  }, []);

  // Buscar todos os cemitérios
  const fetchCemeteries = useCallback(
    async (filters?: CemeteryFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await cemeteryService.getAllCemeteries(filters);
        setCemeteries(response);
      } catch (error) {
        handleError(error, "fetchCemeteries");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Selecionar cemitério específico
  const selectCemetery = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const cemetery = await cemeteryService.getCemeteryById(id);
        setSelectedCemetery(cemetery);
      } catch (error) {
        handleError(error, "selectCemetery");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Criar novo cemitério
  const createCemetery = useCallback(
    async (data: CemeteryFormData): Promise<ActionResult<Cemetery>> => {
      setIsLoading(true);
      setError(null);

      try {
        const newCemetery = await cemeteryService.createCemetery(data);
        setCemeteries((prev) => [...prev, newCemetery]);
        return { success: true, data: newCemetery };
      } catch (error) {
        handleError(error, "createCemetery");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao criar cemitério",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Atualizar cemitério existente
  const updateCemetery = useCallback(
    async (
      id: string,
      data: CemeteryFormData,
    ): Promise<ActionResult<Cemetery>> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedCemetery = await cemeteryService.updateCemetery(id, data);

        // Atualizar na lista
        setCemeteries((prev) =>
          prev.map((c) => (c.id === id ? updatedCemetery : c)),
        );

        // Atualizar cemitério selecionado se for o mesmo
        if (selectedCemetery?.id === id) {
          setSelectedCemetery(updatedCemetery);
        }

        return { success: true, data: updatedCemetery };
      } catch (error) {
        handleError(error, "updateCemetery");
        return {
          success: false,
          errors: [
            error instanceof Error
              ? error.message
              : "Erro ao atualizar cemitério",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedCemetery],
  );

  // Deletar cemitério
  const deleteCemetery = useCallback(
    async (id: string): Promise<ActionResult<void>> => {
      setIsLoading(true);
      setError(null);

      try {
        await cemeteryService.deleteCemetery(id);

        // Remover da lista
        setCemeteries((prev) => prev.filter((c) => c.id !== id));

        // Limpar seleção se for o cemitério selecionado
        if (selectedCemetery?.id === id) {
          setSelectedCemetery(null);
        }

        return { success: true };
      } catch (error) {
        handleError(error, "deleteCemetery");
        return {
          success: false,
          errors: [
            error instanceof Error
              ? error.message
              : "Erro ao deletar cemitério",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, selectedCemetery],
  );

  // Buscar cemitérios com parâmetros de busca
  const searchCemeteries = useCallback(
    async (params: CemeterySearchParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await cemeteryService.searchCemeteries(params);
        setCemeteries(response);
      } catch (error) {
        handleError(error, "searchCemeteries");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar estruturas de cemitério
  const fetchCemeteryStructures = useCallback(
    async (cemeteryId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const structures =
          await cemeteryService.getCemeteryStructures(cemeteryId);
        setCemeteryStructures(structures);
      } catch (error) {
        handleError(error, "fetchCemeteryStructures");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar estatísticas de cemitério
  const fetchCemeteryStatistics = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const statistics = await cemeteryService.getCemeteryStatistics(id);
        setCemeteryStatistics(statistics);
      } catch (error) {
        handleError(error, "fetchCemeteryStatistics");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar projeções de capacidade
  const fetchCapacityProjections = useCallback(
    async (cemeteryId: string, years: number = 5) => {
      setIsLoading(true);
      setError(null);

      try {
        const projections = await cemeteryService.getCapacityProjections(
          cemeteryId,
          years,
        );
        setCapacityProjections(projections);
      } catch (error) {
        handleError(error, "fetchCapacityProjections");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar blocos por cemitério
  const fetchBlocks = useCallback(
    async (cemeteryId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const list = await cemeteryService.getCemeteryBlocks(cemeteryId);
        setBlocks(list);
      } catch (error) {
        handleError(error, "fetchBlocks");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Criar bloco
  const createBlock = useCallback(
    async (
      data: Partial<CemeteryBlock> & {
        cemeteryId: string;
        name: string;
        maxCapacity: number;
      },
    ): Promise<ActionResult<CemeteryBlock>> => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await cemeteryService.createBlock(data);
        setBlocks((prev) => [created, ...prev]);
        return { success: true, data: created };
      } catch (error) {
        handleError(error, "createBlock");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao criar bloco",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Atualizar bloco
  const updateBlock = useCallback(
    async (
      id: string,
      data: Partial<CemeteryBlock>,
    ): Promise<ActionResult<CemeteryBlock>> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await cemeteryService.updateBlock(id, data);
        setBlocks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        return { success: true, data: updated };
      } catch (error) {
        handleError(error, "updateBlock");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao atualizar bloco",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Buscar seções
  const fetchSections = useCallback(
    async (cemeteryId: string, blockId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const list = await cemeteryService.getBlockSections(
          cemeteryId,
          blockId,
        );
        setSections(list);
      } catch (error) {
        handleError(error, "fetchSections");
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Criar seção
  const createSection = useCallback(
    async (
      data: Partial<CemeterySection> & {
        cemeteryId: string;
        blockId: string;
        name: string;
        maxCapacity: number;
      },
    ): Promise<ActionResult<CemeterySection>> => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await cemeteryService.createSection(data);
        setSections((prev) => [created, ...prev]);
        return { success: true, data: created };
      } catch (error) {
        handleError(error, "createSection");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao criar seção",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Atualizar seção
  const updateSection = useCallback(
    async (
      id: string,
      data: Partial<CemeterySection>,
    ): Promise<ActionResult<CemeterySection>> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await cemeteryService.updateSection(id, data);
        setSections((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return { success: true, data: updated };
      } catch (error) {
        handleError(error, "updateSection");
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "Erro ao atualizar seção",
          ],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Obter seção por ID diretamente
  const getSectionById = useCallback(
    async (id: string): Promise<CemeterySection | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const section = await cemeteryService.getSectionById(id);
        return section ?? null;
      } catch (error) {
        handleError(error, "getSectionById");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  // Limpar seleção
  const clearSelection = useCallback(() => {
    setSelectedCemetery(null);
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Efeito para buscar cemitérios ao montar o hook
  useEffect(() => {
    fetchCemeteries();
  }, [fetchCemeteries]);

  return {
    cemeteries,
    selectedCemetery,
    cemeteryStructures,
    cemeteryStatistics,
    capacityProjections,
    blocks,
    sections,
    isLoading,
    error,
    fetchCemeteries,
    selectCemetery,
    createCemetery,
    updateCemetery,
    deleteCemetery,
    searchCemeteries,
    fetchCemeteryStructures,
    fetchCemeteryStatistics,
    fetchCapacityProjections,
    fetchBlocks,
    createBlock,
    updateBlock,
    fetchSections,
    createSection,
    updateSection,
    getSectionById,
    clearSelection,
    clearError,
  };
}
