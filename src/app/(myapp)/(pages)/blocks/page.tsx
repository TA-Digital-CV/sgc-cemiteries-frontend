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
import type { Cemetery, CemeteryBlock } from "@/types/cemetery";

export default function BlocksPage() {
  /**
   * BlocksPage renders CRUD UI for cemetery blocks:
   * - Select cemetery → list blocks with search/filter
   * - Create and edit blocks with required validations
   */
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    createBlock,
    updateBlock,
    isLoading,
    error,
  } = useCemetery();

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [editing, setEditing] = useState<CemeteryBlock | null>(null);
  const [form, setForm] = useState<{
    name: string;
    totalPlots: number;
    description?: string;
  }>({ name: "", totalPlots: 0, description: "" });

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);

  useEffect(() => {
    if (selectedCemeteryId) {
      void fetchBlocks(selectedCemeteryId);
    }
  }, [selectedCemeteryId, fetchBlocks]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      const matchesSearch = search
        ? (b.name ?? "").toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesSearch;
    });
  }, [blocks, search]);

  const validateForm = (): string | null => {
    if (!selectedCemeteryId) return "Cemetery is required";
    if (!form.name || form.name.trim().length < 3)
      return "Name must have at least 3 characters";
    if (!form.totalPlots || form.totalPlots <= 0)
      return "Max capacity must be greater than 0";
    return null;
  };

  const handleCreate = async () => {
    const validation = validateForm();
    if (validation) return;
    const res = await createBlock({
      cemeteryId: selectedCemeteryId,
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
    if (validation) return;
    const res = await updateBlock(editing.id, {
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

  const startEdit = (b: CemeteryBlock) => {
    setEditing(b);
    setForm({
      name: b.name ?? "",
      totalPlots: Number(b.totalPlots ?? 0),
      description: String(b.description ?? ""),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Blocos
          </h1>
          <p className="text-muted-foreground">
            Cadastro, edição e filtros de blocos
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
              <IGRPLabel>Busca</IGRPLabel>
              <IGRPInputText
                placeholder="Nome do bloco"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <IGRPButton
                onClick={() =>
                  selectedCemeteryId && fetchBlocks(selectedCemeteryId)
                }
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
            {editing ? "Editar Bloco" : "Novo Bloco"}
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
                  disabled={isLoading || !selectedCemeteryId}
                >
                  Salvar
                </IGRPButton>
              </>
            ) : (
              <IGRPButton
                onClick={handleCreate}
                disabled={isLoading || !selectedCemeteryId}
              >
                Criar
              </IGRPButton>
            )}
          </div>
        </IGRPCardContent>
      </IGRPCard>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Blocos</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <IGRPDataTable<CemeteryBlock, CemeteryBlock>
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
                  new Intl.NumberFormat("pt-BR").format(
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
                  const b = row.original as CemeteryBlock;
                  const rate =
                    b.totalPlots > 0
                      ? (b.occupiedPlots / b.totalPlots) * 100
                      : 0;
                  return `${rate.toFixed(1)}%`;
                },
              },
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  const b = row.original as CemeteryBlock;
                  return (
                    <IGRPButton
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(b)}
                    >
                      Editar
                    </IGRPButton>
                  );
                },
              },
            ]}
            clientFilters={[]}
            data={filteredBlocks}
          />
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
