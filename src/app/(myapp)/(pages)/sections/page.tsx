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
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/types/cemetery";

export default function SectionsPage() {
  /**
   * SectionsPage renders CRUD UI for cemetery sections (sectores):
   * - Select cemetery and block → list sections with search/filter
   * - Create and edit sections with required validations
   */
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
    createSection,
    updateSection,
    isLoading,
  } = useCemetery();

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [editing, setEditing] = useState<CemeterySection | null>(null);
  const [form, setForm] = useState<{
    name: string;
    totalPlots: number;
    description?: string;
  }>({ name: "", totalPlots: 0, description: "" });

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);

  useEffect(() => {
    if (selectedCemeteryId) void fetchBlocks(selectedCemeteryId);
  }, [selectedCemeteryId, fetchBlocks]);

  useEffect(() => {
    if (selectedCemeteryId && selectedBlockId)
      void fetchSections(selectedCemeteryId, selectedBlockId);
  }, [selectedCemeteryId, selectedBlockId, fetchSections]);

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const matchesSearch = search
        ? (s.name ?? "").toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesSearch;
    });
  }, [sections, search]);

  const validateForm = (): string | null => {
    if (!selectedCemeteryId) return "Cemetery is required";
    if (!selectedBlockId) return "Block is required";
    if (!form.name || form.name.trim().length < 3)
      return "Name must have at least 3 characters";
    if (!form.totalPlots || form.totalPlots <= 0)
      return "Max capacity must be greater than 0";
    return null;
  };

  const handleCreate = async () => {
    const validation = validateForm();
    if (validation) {
      return;
    }
    const res = await createSection({
      cemeteryId: selectedCemeteryId,
      blockId: selectedBlockId,
      name: form.name.trim(),
      maxCapacity: form.totalPlots,
      description: form.description ?? "",
    });
    if (res.success) {
      setForm({ name: "", totalPlots: 0, description: "" });
    } else {
      // noop
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const validation = validateForm();
    if (validation) {
      return;
    }
    const res = await updateSection(editing.id, {
      name: form.name.trim(),
      totalPlots: form.totalPlots,
      description: form.description ?? "",
    });
    if (res.success) {
      setEditing(null);
      setForm({ name: "", totalPlots: 0, description: "" });
    } else {
      // noop
    }
  };

  const startEdit = (s: CemeterySection) => {
    setEditing(s);
    setForm({
      name: s.name ?? "",
      totalPlots: Number(s.totalPlots ?? 0),
      description: String(s.description ?? ""),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Sectores
          </h1>
          <p className="text-muted-foreground">
            CRUD completo e hierarquia bloco → sector
          </p>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Filtros</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <IGRPLabel>Busca</IGRPLabel>
              <IGRPInputText
                placeholder="Nome do sector"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <IGRPButton
                onClick={() =>
                  selectedCemeteryId &&
                  selectedBlockId &&
                  fetchSections(selectedCemeteryId, selectedBlockId)
                }
                disabled={!selectedBlockId || isLoading}
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
            {editing ? "Editar Sector" : "Novo Sector"}
          </IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <IGRPLabel>Nome</IGRPLabel>
              <IGRPInputText
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <IGRPLabel>Capacidade Máxima</IGRPLabel>
              <IGRPInputText
                type="number"
                value={form.totalPlots}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalPlots: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <IGRPLabel>Descrição</IGRPLabel>
              <IGRPInputText
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {editing ? (
              <>
                <IGRPButton
                  variant="outline"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", totalPlots: 0, description: "" });
                  }}
                >
                  Cancelar
                </IGRPButton>
                <IGRPButton
                  onClick={handleUpdate}
                  disabled={
                    isLoading || !selectedCemeteryId || !selectedBlockId
                  }
                >
                  Salvar
                </IGRPButton>
              </>
            ) : (
              <IGRPButton
                onClick={handleCreate}
                disabled={isLoading || !selectedCemeteryId || !selectedBlockId}
              >
                Criar
              </IGRPButton>
            )}
          </div>
        </IGRPCardContent>
      </IGRPCard>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Sectores</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <IGRPDataTable<CemeterySection, CemeterySection>
            className={"rounded-md border"}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Nome`}
                  />
                ),
                accessorKey: "name",
                cell: ({ row }) => row.getValue("name") as string,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Capacidade`}
                  />
                ),
                accessorKey: "totalPlots",
                cell: ({ row }) =>
                  new Intl.NumberFormat("pt-CV").format(
                    Number(row.getValue("totalPlots") ?? 0),
                  ),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title={`Ocupação`}
                  />
                ),
                accessorKey: "occupiedPlots",
                cell: ({ row }) => {
                  const s = row.original as CemeterySection;
                  const rate =
                    s.totalPlots > 0
                      ? (s.occupiedPlots / s.totalPlots) * 100
                      : 0;
                  return `${rate.toFixed(1)}%`;
                },
              },
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  const s = row.original as CemeterySection;
                  return (
                    <IGRPButton
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(s)}
                    >
                      Editar
                    </IGRPButton>
                  );
                },
              },
            ]}
            clientFilters={[]}
            data={filteredSections}
          />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
