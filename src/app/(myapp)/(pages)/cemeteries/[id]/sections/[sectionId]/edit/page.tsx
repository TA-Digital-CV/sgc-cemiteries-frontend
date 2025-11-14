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
import type { CemeteryBlock, CemeterySection } from "@/types/cemetery";

/**
 * SectionEditPage
 * Edits a specific section, discovering its block by searching blocks/sections.
 */
export default function SectionEditPage() {
  const router = useRouter();
  const params = useParams();
  const cemeteryId = String(params.id ?? "");
  const sectionId = String(params.sectionId ?? "");

  const { fetchBlocks, blocks, getSectionById, updateSection, isLoading } =
    useCemetery();

  const [activeBlockId, setActiveBlockId] = useState<string>("");
  const [loadedSection, setLoadedSection] = useState<CemeterySection | null>(
    null,
  );
  const [form, setForm] = useState<{
    name: string;
    code: string;
    plotType: "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
    totalPlots: number;
  }>({
    name: "",
    code: "",
    plotType: "GROUND",
    totalPlots: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cemeteryId) {
      void fetchBlocks(cemeteryId);
    }
  }, [cemeteryId, fetchBlocks]);

  useEffect(() => {
    const loadSection = async () => {
      const section = await getSectionById(sectionId);
      if (section) {
        setLoadedSection(section);
        setActiveBlockId(section.blockId);
        setForm({
          name: section.name,
          code: section.code,
          plotType: section.plotType as any,
          totalPlots: Number(section.totalPlots),
        });
      }
    };
    void loadSection();
  }, [getSectionById, sectionId]);

  const validate = (): string | null => {
    if (!cemeteryId || !sectionId || !activeBlockId)
      return "Invalid route parameters";
    if (!form.name.trim()) return "Name is required";
    if (!form.code.trim()) return "Code is required";
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
    const res = await updateSection(sectionId, {
      name: form.name.trim(),
      code: form.code.trim(),
      plotType: form.plotType,
      totalPlots: Number(form.totalPlots),
    });
    if (res.success) {
      router.push(`/cemeteries/${cemeteryId}`);
    } else {
      setError(res.errors?.[0] || "Failed to update section");
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
            <h1 className="text-3xl font-bold tracking-tight">Editar Setor</h1>
            <p className="text-muted-foreground">Atualize os dados do setor</p>
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
                value={activeBlockId}
                onValueChange={(v) => setActiveBlockId(String(v))}
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
                value={form.plotType}
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
              disabled={
                isLoading || !cemeteryId || !sectionId || !activeBlockId
              }
            >
              Salvar
            </IGRPButton>
          </div>
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
