"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPInputText,
  IGRPLabel,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import type { CemeteryBlock } from "@/types/cemetery";

/**
 * BlockEditPage
 * Provides a form to edit an existing block. Validates capacity and code uniqueness.
 */
export default function BlockEditPage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");
  const blockId = String(params.blockId ?? "");

  const { fetchBlocks, blocks, updateBlock, isLoading } = useCemetery();

  const currentBlock = useMemo(
    () => blocks.find((b) => b.id === blockId),
    [blocks, blockId],
  );
  const [form, setForm] = useState<{
    name: string;
    code: string;
    totalPlots: number;
  }>({
    name: "",
    code: "",
    totalPlots: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  useEffect(() => {
    if (currentBlock) {
      setForm({
        name: currentBlock.name,
        code: currentBlock.code,
        totalPlots: Number(currentBlock.totalPlots),
      });
    }
  }, [currentBlock]);

  const isCodeDuplicate = useMemo(() => {
    const codeNorm = form.code.trim().toLowerCase();
    return blocks.some(
      (b: CemeteryBlock) =>
        b.cemeteryId === cemeteryId &&
        b.id !== blockId &&
        String(b.code).toLowerCase() === codeNorm,
    );
  }, [blocks, cemeteryId, blockId, form.code]);

  const validate = (): string | null => {
    if (!cemeteryId || !blockId) return "Invalid route parameters";
    if (!form.name.trim()) return "Name is required";
    if (!form.code.trim()) return "Code is required";
    if (isCodeDuplicate) return "Code must be unique in this cemetery";
    if (!Number.isFinite(form.totalPlots) || form.totalPlots <= 0)
      return "Max capacity must be greater than 0";
    return null;
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    const res = await updateBlock(blockId, {
      name: form.name.trim(),
      code: form.code.trim(),
      totalPlots: Number(form.totalPlots),
    });
    if (res.success) {
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      setError(res.errors?.[0] || "Failed to update block");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/cemeteries/${cemeteryId}`}>
            <IGRPButton variant="ghost" size="sm" showIcon iconName="ArrowLeft">
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Bloco</h1>
            <p className="text-muted-foreground">Atualize os dados do bloco</p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Dados do Bloco</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <IGRPIcon iconName="AlertTriangle" className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <IGRPLabel>Capacidade Máxima *</IGRPLabel>
              <IGRPInputText
                type="number"
                value={String(form.totalPlots)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalPlots: Number(e.target.value) }))
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
              onClick={handleSave}
              disabled={isLoading || !cemeteryId || !blockId}
            >
              Salvar
            </IGRPButton>
          </div>
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
