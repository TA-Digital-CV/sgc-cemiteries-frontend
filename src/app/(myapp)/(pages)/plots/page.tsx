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
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/types/cemetery";
import type { Plot, PlotFormData } from "@/types/Plot";

export default function PlotsPage() {
  /**
   * PlotsPage renders CRUD UI and reservation/occupation for plots:
   * - Select cemetery/block/section → list plots with search/filter
   * - Create plots with required fields
   * - Reserve/occupy/cancel reservation
   */
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
  } = useCemetery();

  const {
    plots,
    fetchPlots,
    createPlot,
    updatePlot,
    reservePlot,
    cancelPlotReservation,
    markPlotAsOccupied,
    markPlotAsAvailable,
    isLoading,
  } = usePlot() as any;

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [editing, setEditing] = useState<Plot | null>(null);
  const [form, setForm] = useState<PlotFormData>({
    cemeteryId: "",
    blockId: "",
    sectionId: "",
    plotNumber: "",
    plotType: "GROUND",
    geoPoint: undefined,
    dimensions: { width: 0, length: 0, unit: "meters" },
    notes: "",
  });

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);
  useEffect(() => {
    if (selectedCemeteryId) {
      void fetchBlocks(selectedCemeteryId);
      void fetchPlots({ cemeteryId: selectedCemeteryId });
    }
  }, [selectedCemeteryId, fetchBlocks, fetchPlots]);
  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId) {
      void fetchSections(selectedCemeteryId, selectedBlockId);
    }
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  const filteredPlots = useMemo(() => {
    return plots.filter((p: Plot) => {
      const matchesSearch = search
        ? (p.plotNumber ?? "").toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCemetery = selectedCemeteryId
        ? p.cemeteryId === selectedCemeteryId
        : true;
      const matchesBlock = selectedBlockId
        ? p.blockId === selectedBlockId
        : true;
      const matchesSection = selectedSectionId
        ? p.sectionId === selectedSectionId
        : true;
      return matchesSearch && matchesCemetery && matchesBlock && matchesSection;
    });
  }, [plots, search, selectedCemeteryId, selectedBlockId, selectedSectionId]);

  const validateForm = (): string | null => {
    if (!selectedCemeteryId) return "Cemetery is required";
    if (!selectedBlockId) return "Block is required";
    if (!selectedSectionId) return "Section is required";
    if (!form.plotNumber || form.plotNumber.trim().length < 1)
      return "Plot number is required";
    if (
      !form.dimensions ||
      form.dimensions.length <= 0 ||
      form.dimensions.width <= 0
    )
      return "Dimensions must be greater than 0";
    return null;
  };

  const handleCreate = async () => {
    const validation = validateForm();
    if (validation) {
      return;
    }
    const payload: PlotFormData = {
      ...form,
      cemeteryId: selectedCemeteryId,
      blockId: selectedBlockId,
      sectionId: selectedSectionId,
    };
    const res = await createPlot(payload);
    if (res) {
      setForm({
        cemeteryId: "",
        blockId: "",
        sectionId: "",
        plotNumber: "",
        plotType: "GROUND",
        dimensions: { width: 0, length: 0, unit: "meters" },
        notes: "",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const validation = validateForm();
    if (validation) {
      return;
    }
    const payload: PlotFormData = { ...form } as PlotFormData;
    const res = await updatePlot(editing.id, payload);
    if (res?.success) {
      setEditing(null);
    }
  };

  const startEdit = (p: Plot) => {
    setEditing(p);
    setSelectedCemeteryId(p.cemeteryId);
    setSelectedBlockId(p.blockId ?? "");
    setSelectedSectionId(p.sectionId ?? "");
    setForm({
      cemeteryId: p.cemeteryId,
      blockId: p.blockId,
      sectionId: p.sectionId,
      plotNumber: p.plotNumber,
      plotType: p.plotType,
      dimensions: p.dimensions,
      notes: p.notes,
    } as PlotFormData);
  };

  const doReserve = async (p: Plot) => {
    const until = new Date();
    until.setMonth(until.getMonth() + 3);
    const res = await reservePlot(p.id, {
      reservedBy: "system",
      reservedUntil: until,
      notes: "",
    });
    if (res) {
    }
  };
  const doCancelReservation = async (p: Plot) => {
    const res = await cancelPlotReservation(p.id, "User cancel");
    if (res) {
    }
  };
  const doOccupy = async (p: Plot) => {
    const res = await markPlotAsOccupied(p.id, { occupantName: "John Doe" });
    if (res) {
    }
  };
  const doAvailable = async (p: Plot) => {
    const res = await markPlotAsAvailable(p.id, "Freed");
    if (res) {
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Sepulturas
          </h1>
          <p className="text-muted-foreground">
            Cadastro, reserva/ocupação e histórico básico
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/plots/search">
            <IGRPButton variant="outline">Busca Avançada</IGRPButton>
          </Link>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Filtros</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <IGRPLabel>Sector</IGRPLabel>
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
            <div>
              <IGRPLabel>Busca</IGRPLabel>
              <IGRPInputText
                placeholder="Número da sepultura"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <IGRPButton
                onClick={() => fetchPlots({ cemeteryId: selectedCemeteryId })}
                disabled={!selectedCemeteryId || isLoading}
              >
                Recarregar
              </IGRPButton>
            </div>
          </div>
        </IGRPCardContent>
      </IGRPCard>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>
            {editing ? "Editar Sepultura" : "Nova Sepultura"}
          </IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <IGRPLabel>Número</IGRPLabel>
              <IGRPInputText
                value={form.plotNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, plotNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <IGRPLabel>Tipo</IGRPLabel>
              <IGRPSelect
                options={[
                  { value: "GROUND", label: "Solo" },
                  { value: "MAUSOLEUM", label: "Mausoléu" },
                  { value: "NICHE", label: "Nicho" },
                  { value: "OSSUARY", label: "Ossário" },
                ]}
                placeholder="Tipo"
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, plotType: v as any }))
                }
              />
            </div>
            <div>
              <IGRPLabel>Dimensões (L x C)</IGRPLabel>
              <div className="grid grid-cols-3 gap-2">
                <IGRPInputText
                  type="number"
                  placeholder="Largura"
                  value={Number(form.dimensions?.width ?? 0)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      dimensions: {
                        ...(f.dimensions ?? {
                          width: 0,
                          length: 0,
                          unit: "meters",
                        }),
                        width: Number(e.target.value),
                      },
                    }))
                  }
                />
                <IGRPInputText
                  type="number"
                  placeholder="Comprimento"
                  value={Number(form.dimensions?.length ?? 0)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      dimensions: {
                        ...(f.dimensions ?? {
                          width: 0,
                          length: 0,
                          unit: "meters",
                        }),
                        length: Number(e.target.value),
                      },
                    }))
                  }
                />
                <IGRPSelect
                  options={[
                    { value: "meters", label: "Metros" },
                    { value: "feet", label: "Pés" },
                  ]}
                  placeholder="Unidade"
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      dimensions: {
                        ...(f.dimensions ?? {
                          width: 0,
                          length: 0,
                          unit: "meters",
                        }),
                        unit: v as any,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {editing ? (
              <>
                <IGRPButton
                  variant="outline"
                  onClick={() => {
                    setEditing(null);
                  }}
                >
                  Cancelar
                </IGRPButton>
                <IGRPButton
                  onClick={handleUpdate}
                  disabled={
                    isLoading ||
                    !selectedCemeteryId ||
                    !selectedBlockId ||
                    !selectedSectionId
                  }
                >
                  Salvar
                </IGRPButton>
              </>
            ) : (
              <IGRPButton
                onClick={handleCreate}
                disabled={
                  isLoading ||
                  !selectedCemeteryId ||
                  !selectedBlockId ||
                  !selectedSectionId
                }
              >
                Criar
              </IGRPButton>
            )}
          </div>
        </IGRPCardContent>
      </IGRPCard>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Sepulturas</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <IGRPDataTable<Plot, Plot>
            className={"rounded-md border"}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Número`}
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
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  const p = row.original as Plot;
                  return (
                    <div className="flex gap-2">
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(p)}
                      >
                        Editar
                      </IGRPButton>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => doReserve(p)}
                        disabled={p.occupationStatus !== "AVAILABLE"}
                      >
                        Reservar
                      </IGRPButton>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => doCancelReservation(p)}
                        disabled={p.occupationStatus !== "RESERVED"}
                      >
                        Cancelar Reserva
                      </IGRPButton>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => doOccupy(p)}
                        disabled={p.occupationStatus === "OCCUPIED"}
                      >
                        Ocupar
                      </IGRPButton>
                      <IGRPButton
                        variant="outline"
                        size="sm"
                        onClick={() => doAvailable(p)}
                        disabled={p.occupationStatus === "AVAILABLE"}
                      >
                        Disponibilizar
                      </IGRPButton>
                    </div>
                  );
                },
              },
            ]}
            clientFilters={[]}
            data={filteredPlots}
          />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
