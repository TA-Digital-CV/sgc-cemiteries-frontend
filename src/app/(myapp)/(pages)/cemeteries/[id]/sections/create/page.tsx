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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import type { CemeteryBlock } from "@/types/cemetery";

/**
 * SectionsCreatePage
 * Provides a form to create a new cemetery section under a given block.
 * Requires selecting a block and validates required fields.
 */
export default function SectionsCreatePage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");

  const { fetchBlocks, blocks, createSection, isLoading } = useCemetery();

  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [form, setForm] = useState<{
    name: string;
    code: string;
    plotType: "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
    maxCapacity: number;
  }>({
    name: "",
    code: "",
    plotType: "GROUND",
    maxCapacity: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  const validate = (): string | null => {
    if (!cemeteryId) return "Cemetery is required";
    if (!selectedBlockId) return "Block is required";
    if (!form.name.trim()) return "Name is required";
    if (!form.code.trim()) return "Code is required";
    if (!Number.isFinite(form.maxCapacity) || form.maxCapacity <= 0)
      return "Max capacity must be greater than 0";
    return null;
  };

  const handleCreate = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    const res = await createSection({
      cemeteryId,
      blockId: selectedBlockId,
      name: form.name.trim(),
      code: form.code.trim(),
      plotType: form.plotType,
      maxCapacity: Number(form.maxCapacity),
    });
    if (res.success) {
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      setError(res.errors?.[0] || "Failed to create section");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/cemeteries/${cemeteryId}`}>
            <IGRPButton variant="ghost" size="sm">
              <IGRPIcon iconName="ArrowLeft" className="h-4 w-4 mr-2" />
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Setor</h1>
            <p className="text-muted-foreground">Adicionar setor ao bloco</p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Dados do Setor</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <IGRPIcon iconName="AlertTriangle" className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <IGRPLabel>Bloco *</IGRPLabel>
              <IGRPSelect
                options={blocks
                  .filter((b) => b.cemeteryId === cemeteryId)
                  .map((b: CemeteryBlock) => ({ value: b.id, label: b.name }))}
                placeholder="Selecione"
                onValueChange={(v) => setSelectedBlockId(String(v))}
              />
            </div>
            <div>
              <IGRPLabel>Nome *</IGRPLabel>
              <IGRPInputText
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <IGRPLabel>Código *</IGRPLabel>
              <IGRPInputText
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value }))
                }
              />
            </div>
            <div>
              <IGRPLabel>Tipo *</IGRPLabel>
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
              <IGRPLabel>Capacidade Máxima *</IGRPLabel>
              <IGRPInputText
                type="number"
                value={String(form.maxCapacity)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    maxCapacity: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <IGRPButton
              variant="outline"
              onClick={() => router.push(`/cemeteries/${cemeteryId}`)}
              type="button"
            >
              Cancelar
            </IGRPButton>
            <IGRPButton
              onClick={handleCreate}
              disabled={isLoading || !cemeteryId || !selectedBlockId}
            >
              Criar
            </IGRPButton>
          </div>
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
