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
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type {
  Cemetery,
  CemeteryBlock,
  CemeterySection,
} from "@/types/cemetery";
import type { PlotFormData } from "@/types/Plot";

/**
 * PlotsCreatePage
 * Renders a dedicated page to create plots, aligned with FE-01 blueprint.
 * Uses IGRP DS primitives and existing hooks for data and validations.
 */
export default function PlotsCreatePage() {
  const router = useRouter();
  const {
    cemeteries,
    fetchCemeteries,
    blocks,
    fetchBlocks,
    sections,
    fetchSections,
  } = useCemetery();
  const { createPlot, isLoading } = usePlot() as any;

  const [selectedCemeteryId, setSelectedCemeteryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
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
  const [error, setError] = useState<string | null>(null);

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

  const validateForm = (): string | null => {
    if (!selectedCemeteryId) return "Cemetery is required";
    if (!selectedBlockId) return "Block is required";
    if (!selectedSectionId) return "Section is required";
    if (!form.plotNumber || form.plotNumber.trim().length < 1)
      return "Plot number is required";
    if (
      !form.dimensions ||
      Number(form.dimensions.length) <= 0 ||
      Number(form.dimensions.width) <= 0
    )
      return "Dimensions must be greater than 0";
    return null;
  };

  const handleCreate = async () => {
    const validation = validateForm();
    if (validation) {
      setError(validation);
      return;
    }
    const payload: PlotFormData = {
      ...form,
      cemeteryId: selectedCemeteryId,
      blockId: selectedBlockId,
      sectionId: selectedSectionId,
    };
    const res = await createPlot(payload);
    if (res?.success) {
      router.push("/plots");
    } else if (res?.errors && res.errors[0]) {
      setError(res.errors[0]);
    }
  };

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
              Nova Sepultura
            </h1>
            <p className="text-muted-foreground">Cadastre uma nova sepultura</p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Dados da Sepultura</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <IGRPIcon iconName="AlertTriangle" className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <IGRPLabel>Dimensão - Largura</IGRPLabel>
              <IGRPInputText
                type="number"
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
            </div>
            <div>
              <IGRPLabel>Dimensão - Comprimento</IGRPLabel>
              <IGRPInputText
                type="number"
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
            </div>
            <div>
              <IGRPLabel>Unidade</IGRPLabel>
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

          <div className="mt-6 flex gap-2">
            <IGRPButton
              variant="outline"
              onClick={() => router.push("/plots")}
              type="button"
            >
              Cancelar
            </IGRPButton>
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
          </div>
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
