"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPInputText,
  IGRPLabel,
  IGRPSelect,
  IGRPDataTable,
  IGRPDataTableHeaderSortToggle,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/types/cemetery";
import type { Plot, PlotFilters, PlotSearchParams } from "@/types/Plot";

/**
 * PlotsSearchPage
 * Advanced search UI for plots with server-side pagination using filters page/limit.
 */
export default function PlotsSearchPage() {
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
  } = useCemetery();
  const { plots, searchPlots, plotPagination, isLoading } = usePlot();

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);
  useEffect(() => {
    if (selectedCemeteryId) {
      void fetchBlocks(selectedCemeteryId);
    }
  }, [selectedCemeteryId, fetchBlocks]);
  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId) {
      void fetchSections(selectedCemeteryId, selectedBlockId);
    }
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  const runSearch = async () => {
    const filters: PlotFilters = {
      cemeteryId: selectedCemeteryId || undefined,
      blockId: selectedBlockId || undefined,
      sectionId: selectedSectionId || undefined,
      page,
      limit,
    };
    const params: PlotSearchParams = { query, filters };
    await searchPlots(params);
  };

  useEffect(() => {
    void runSearch();
  }, [page, limit]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/plots">
            <IGRPButton variant="ghost" size="sm" showIcon iconName={"ArrowLeft"}>
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Busca Avançada
            </h1>
            <p className="text-muted-foreground">
              Filtros e paginação server-side
            </p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Filtros</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <IGRPLabel>Cemitério</IGRPLabel>
              <IGRPSelect
                options={cemeteries.map((c: Cemetery) => ({
                  value: c.id,
                  label: c.name,
                }))}
                placeholder="Selecione"
                onValueChange={(v) => setSelectedCemeteryId(String(v))}
              />
            </div>
            <div>
              <IGRPLabel>Bloco</IGRPLabel>
              <IGRPSelect
                options={blocks.map((b: CemeteryBlock) => ({
                  value: b.id,
                  label: b.name,
                }))}
                placeholder="Selecione"
                onValueChange={(v) => setSelectedBlockId(String(v))}
                disabled={!selectedCemeteryId}
              />
            </div>
            <div>
              <IGRPLabel>Setor</IGRPLabel>
              <IGRPSelect
                options={sections.map((s: CemeterySection) => ({
                  value: s.id,
                  label: s.name,
                }))}
                placeholder="Selecione"
                onValueChange={(v) => setSelectedSectionId(String(v))}
                disabled={!selectedBlockId}
              />
            </div>
            <div className="md:col-span-2">
              <IGRPLabel>Busca</IGRPLabel>
              <IGRPInputText
                placeholder="Código ou termos"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <IGRPButton
                onClick={() => {
                  setPage(0);
                  void runSearch();
                }}
                disabled={isLoading}
              >
                Buscar
              </IGRPButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
            <div>
              <IGRPLabel>Itens por página</IGRPLabel>
              <IGRPSelect
                options={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                ]}
                placeholder="10"
                onValueChange={(v) => setLimit(Number(v))}
              />
            </div>
            <div className="flex items-end gap-2">
              <IGRPButton
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isLoading || page <= 0}
              >
                Anterior
              </IGRPButton>
              <IGRPButton
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoading}
              >
                Próxima
              </IGRPButton>
            </div>
            {plotPagination && (
              <div className="md:col-span-3 flex items-end">
                <span className="text-sm text-muted-foreground">
                  Página {plotPagination.page + 1} de{" "}
                  {plotPagination.totalPages} • Total: {plotPagination.total}
                </span>
              </div>
            )}
          </div>
        </IGRPCardContent>
      </IGRPCard>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Resultados</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <IGRPDataTable<Plot, Plot>
            className={"rounded-md border"}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Código`}
                  />
                ),
                accessorKey: "plotNumber",
                cell: ({ row }) => row.getValue("plotNumber") as string,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Tipo`}
                  />
                ),
                accessorKey: "plotType",
                cell: ({ row }) => String(row.getValue("plotType") ?? ""),
              },
              {
                header: () => `Status`,
                accessorKey: "occupationStatus",
                cell: ({ row }) =>
                  String(row.getValue("occupationStatus") ?? ""),
              },
            ]}
            clientFilters={[]}
            data={plots}
          />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
