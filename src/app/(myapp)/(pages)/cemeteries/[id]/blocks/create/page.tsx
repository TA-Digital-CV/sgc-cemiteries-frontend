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
 * BlocksCreatePage
 * Provides a form to create a new cemetery block under a given cemetery.
 * Validates required fields and uniqueness of code within the cemetery.
 */
export default function BlocksCreatePage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");

  const { fetchBlocks, blocks, createBlock, isLoading } = useCemetery();

  const [form, setForm] = useState<{
    name: string;
    code: string;
    maxCapacity: number;
  }>({
    name: "",
    code: "",
    maxCapacity: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  const isCodeDuplicate = useMemo(() => {
    const codeNorm = form.code.trim().toLowerCase();
    return blocks.some(
      (b: CemeteryBlock) =>
        b.cemeteryId === cemeteryId &&
        String(b.code).toLowerCase() === codeNorm,
    );
  }, [blocks, cemeteryId, form.code]);

  const validate = (): string | null => {
    if (!cemeteryId) return "Cemetery is required";
    if (!form.name.trim()) return "Name is required";
    if (!form.code.trim()) return "Code is required";
    if (isCodeDuplicate) return "Code must be unique in this cemetery";
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
    const res = await createBlock({
      cemeteryId,
      name: form.name.trim(),
      maxCapacity: Number(form.maxCapacity),
      code: form.code.trim(),
    });
    if (res.success) {
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      setError(res.errors?.[0] || "Failed to create block");
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
            <h1 className="text-3xl font-bold tracking-tight">Novo Bloco</h1>
            <p className="text-muted-foreground">
              Adicionar bloco ao cemitério
            </p>
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
              disabled={isLoading || !cemeteryId}
            >
              Criar
            </IGRPButton>
          </div>
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
